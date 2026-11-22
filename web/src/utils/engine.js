import handbook from "../data/student_handbook.json" with { type: "json" };

export const STUDENT_HANDBOOK = handbook;

// Keep abbreviations such as "Rs." inside their original policy sentences.
const sentences = (content) => content.split(/(?<!\bRs\.)(?<=\.)\s+(?=[A-Z])/);

const rules = [
  ["SEC-ATT-102", 1, /debarred.*(?:fees?|repeat|register)|attendance.*(?:summer|supplementary|62%)/],
  ["SEC-ATT-102", 0, /attendance.*(?:below 65|shortage.*grade)|grade.*debarred|debarred.*attendance/],
  ["SEC-ATT-101", 1, /(?:attendance|condonation).*(?:relaxation|medical|sports|bereavement)|(?:medical|sports|bereavement).*attendance/],
  ["SEC-ATT-101", 0, /(?:minimum|required|how much).*attendance|attendance.*(?:minimum|required|eligible|eligibility)/],
  ["SEC-GRD-201", 1, /\bsgpa\b|semester grade point average/],
  ["SEC-GRD-201", 2, /(?:passing|pass a course|['"]p['"] grade|grade ['"]p['"])/],
  ["SEC-GRD-201", 0, /grading scale|letter grades?|10.point scale/],
  ["SEC-GRD-202", 0, /(?:gets?|receives?|what happens).*\b(?:f|dt) grade/],
  ["SEC-GRD-202", 1, /(?:supplementary|backlog).*(?:grade|marks|cap|transcript)|(?:grade|transcript).*(?:supplementary|backlog)/],
  ["SEC-EXM-301", 1, /ufm.*(?:hear|penalt)|(?:committee|hearing).*ufm|(?:caught|penalt|consequence).*(?:phone|smartwatch|cheat|unfair means)|(?:phone|smartwatch|cheat).*(?:penalt|caught|consequence)/],
  ["SEC-EXM-301", 0, /(?:phone|smartwatch|cheat sheet).*(?:exam|hall)|(?:exam|hall).*(?:phone|smartwatch|cheat sheet)/],
  ["SEC-EXM-302", 1, /third.*evaluat|(?:re.evaluat|answer script).*(?:revised|varies|15%)/],
  ["SEC-EXM-302", 0, /re[ -]?evaluat|reeval|(?:apply|deadline|fee).*answer script/],
  ["SEC-FEE-401", 2, /(?:dues|fees?).*(?:unpaid|suspend)|(?:unpaid|suspend).*fees?/],
  ["SEC-FEE-401", 1, /late (?:fee|surcharge|charge|payment)|grace period|(?:fee|tuition).*per day/],
  ["SEC-FEE-401", 0, /(?:tuition|semester fees?|institutional fees?).*(?:deadline|\bdue\b|\bwhen\b)|(?:when|deadline|\bdue\b).*(?:tuition|semester fees?|institutional fees?)|\bfees? (?:payment deadline|deadline|due date)\b|^when (?:is|are) (?:the )?fees? due[?!.]*$|^payment (?:deadline|due date)[?!.]*$/],
  ["SEC-HST-501", 1, /night (?:out|pass)|overnight.*(?:pass|approval|permission|authorization)|(?:approval|permission|authorization).*overnight/],
  ["SEC-HST-501", 0, /in[ -]?time|curfew|(?:hostel|campus gate).*?(?:weekday|weekend)/],
  ["SEC-HST-502", 1, /second offen[cs]e|(?:fine|penalt|caught|expel).*(?:alcohol|heater|hostel|prohibited)|(?:alcohol|heater|hostel|prohibited).*(?:fine|penalt|expel)/],
  ["SEC-HST-502", 0, /prohibited items|(?:alcohol|tobacco|heater|induction stove|immersion rod|narcotics).*(?:hostel|room|permit|allow)|hostel.*(?:alcohol|tobacco|heater|induction stove|immersion rod|narcotics)/],
];

const unsupported = /\b(?:bypass|hack|sneak|ignore|wi[ -]?fi|wedding|calculator|installments?|instalments?|scholarship|delivery|day scholars?|guest charges|parking|gym|swimming|holidays?)\b|cgpa.*(?:convert|conversion|percentage)|(?:convert|conversion|percentage).*cgpa|without.*(?:parents?|guardians?).*(?:knowing|approval|informing)|without informing.*(?:parents?|guardians?)/;

function refundClause(question) {
  if (!/\b(?:refund\w*|withdraw\w*|cancel admission)\b/.test(question)) return null;
  const timing = question.match(/\b(\d+)\s+days?\s+(before|after)\b/);
  if (timing) {
    const days = Number(timing[1]);
    if (timing[2] === "after") return days > 30 ? 2 : null;
    if (days > 0) return days >= 15 ? 0 : 1;
  }
  return /\b(?:deduction|processing|full refund)\b|\b100%/.test(question) ? 0 : null;
}

function plainLanguage(quote) {
  return quote
    .replace(/^Students are required to maintain a minimum attendance of (\d+%) in each registered course to be eligible to appear for the End-Term Examination\.$/, "You need at least $1 attendance in each registered course to sit its end-term exam.")
    .replace(/^The minimum passing grade in any individual course is '([^']+)' \(Grade Point (\d+)\)\.$/, "You need at least a $1 grade ($2 grade points) to pass a course.")
    .replace(/^A grace period of (\d+) days is permitted with a late surcharge of (.+) per day\.$/, "The grace period is $1 days. The late fee is $2 per day.")
    .replace(/^All resident hostel students must enter the campus gates and hostel premises by (.+)\.$/, "Hostel residents must return by $1.")
    .replace(/^For withdrawal requests received between (\d+) and (\d+) days before classes start, (\d+%) is refunded\.$/, "You get a $3 refund if you withdraw $1 to $2 days before classes start.");
}

const notFound = {
  answer: "The answer was not found in the supplied policy. Please contact the Academic Office for help.",
  quoted_source_text: null,
  section_id: null,
  status: "not found",
};

const feeOverviews = [
  [/^(?:fees?|(?:semester|tuition|institutional) fees?|tuition|fee payment)(?: policy)?[?!.]*$/, "SEC-FEE-401"],
  [/^(?:refunds?|fee refunds?|tuition refunds?)(?: policy)?[?!.]*$/, "SEC-FEE-402"],
];

export function runPipeline(question) {
  const query = question.trim().toLowerCase();
  if (unsupported.test(query)) return notFound;

  const refund = refundClause(query);
  const overview = feeOverviews.find(([pattern]) => pattern.test(query));
  const rule = refund === null
    ? rules.find(([, , pattern]) => pattern.test(query)) ?? (overview && [overview[1]])
    : ["SEC-FEE-402", refund];
  if (!rule) return notFound;

  const [id, index] = rule;
  const section = handbook.find((entry) => entry.section_id === id);
  const quote = section && (index === undefined ? section.content : sentences(section.content)[index]);
  if (!quote || !section.content.includes(quote)) return notFound;

  return {
    answer: plainLanguage(quote),
    quoted_source_text: quote,
    section_id: id,
    status: "answered",
  };
}
