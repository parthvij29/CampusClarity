import { useEffect, useRef, useState } from "react";
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Check, ChevronRight,
  CircleHelp, Clipboard, Code2, FileText, GraduationCap, LibraryBig, Search,
  Bookmark, LayoutDashboard, X,
} from "lucide-react";
import { runPipeline, STUDENT_HANDBOOK } from "./utils/engine.js";
import { Dashboard, StudentTools } from "./Portal.jsx";
import "./App.css";

const examples = [
  ["Attendance", "What is the minimum attendance required to sit end-term exams?"],
  ["Grading", "What is the minimum passing grade?"],
  ["Exams", "How do I apply for re-evaluation?"],
  ["Fees", "What is the late fee per day?"],
  ["Hostel", "What is the hostel curfew on weekends?"],
  ["Outside handbook", "What is the campus Wi-Fi password?"],
];

const categories = ["All sections", ...new Set(STUDENT_HANDBOOK.map(({ category }) => category))];
const feeQuestions = ["When are fees due?", "What is the late fee per day?", "Fee refund policy"];

function usePortalStorage(key) {
  const storageKey = `campusclarity.${key}`;
  const [items, setItems] = useState(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(storageKey));
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // Keep the current session usable when browser storage is restricted.
    }
  }, [storageKey, items]);
  return [items, setItems];
}

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [saved, setSaved] = usePortalStorage("bookmarks");
  const [tasks, setTasks] = usePortalStorage("tasks");
  const [recent, setRecent] = usePortalStorage("recent-questions");
  const [draft, setDraft] = useState("");
  const [run, setRun] = useState(null);
  const [filter, setFilter] = useState(categories[0]);
  const [search, setSearch] = useState("");
  const [sourceId, setSourceId] = useState(null);
  const [copyStatus, setCopyStatus] = useState("");
  const [jsonOpen, setJsonOpen] = useState(false);
  const resultRef = useRef(null);
  const questionRef = useRef(null);
  const headingRef = useRef(null);
  const copyRequest = useRef(0);

  const response = run?.response;
  const source = STUDENT_HANDBOOK.find(({ section_id }) => section_id === response?.section_id);
  const json = response && JSON.stringify(response, null, 2);
  const visibleSections = STUDENT_HANDBOOK.filter((section) =>
    (filter === categories[0] || section.category === filter) &&
    [section.title, section.content, section.section_id, section.category, ...section.keywords]
      .some((text) => text.toLowerCase().includes(search.trim().toLowerCase()))
  );

  function ask(question) {
    const text = question.trim();
    if (!text) return;
    setDraft(text);
    copyRequest.current += 1;
    setCopyStatus("");
    setRun({ question: text, response: runPipeline(text) });
    setRecent((current) => [text, ...current.filter((item) => item.toLowerCase() !== text.toLowerCase())].slice(0, 5));
    requestAnimationFrame(() => resultRef.current?.focus());
  }

  function clearQuestion() {
    copyRequest.current += 1;
    setCopyStatus("");
    setJsonOpen(false);
    setDraft("");
    setRun(null);
    questionRef.current?.focus();
  }

  function toggleSaved(id) {
    setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function navigate(nextPage, section = null, category = categories[0]) {
    setSourceId(section);
    setFilter(category);
    setSearch("");
    setPage(nextPage);
    requestAnimationFrame(() => {
      if (section) document.getElementById(section)?.focus();
      else headingRef.current?.focus();
    });
  }

  async function copyJson() {
    const request = ++copyRequest.current;
    let message = "Copied";
    try {
      await navigator.clipboard.writeText(json);
    } catch {
      message = "Clipboard unavailable. Select and copy the JSON manually.";
    }
    if (copyRequest.current === request) setCopyStatus(message);
  }

  return (
    <div className="site">
      <header className="topbar">
        <div className="bar-inner">
          <button className="brand" onClick={() => navigate("dashboard")}>
            <span className="brand-icon"><GraduationCap size={23} /></span>
            <span>Campus<span className="brand-accent">Clarity</span><small>Student portal</small></span>
          </button>
          <nav aria-label="Main navigation">
            <button aria-current={page === "dashboard" ? "page" : undefined} onClick={() => navigate("dashboard")}><LayoutDashboard size={17} /> Dashboard</button>
            <button aria-current={page === "ask" ? "page" : undefined} onClick={() => navigate("ask")}>Ask</button>
            <button aria-current={page === "handbook" ? "page" : undefined} onClick={() => navigate("handbook")}><BookOpen size={17} /> Handbook</button>
            <button aria-current={page === "tools" ? "page" : undefined} onClick={() => navigate("tools")}>Student tools</button>
          </nav>
        </div>
      </header>

      <main className="shell">
        {page === "dashboard" && <Dashboard
          navigate={navigate} saved={saved} toggleSaved={toggleSaved} tasks={tasks}
          recent={recent} clearRecent={() => setRecent([])}
          reopen={(question) => { setPage("ask"); ask(question); }}
          headingRef={headingRef}
        />}
        {page === "tools" && <StudentTools navigate={navigate} tasks={tasks} setTasks={setTasks} headingRef={headingRef} />}
        {page === "ask" && <>
          <section className="hero">
            <div>
              <h1 ref={headingRef} tabIndex={-1}>Campus policy,<br /><em>made clear.</em></h1>
              <p>Ask about attendance, grades, exams, fees or hostel rules. Every answer includes the policy it came from.</p>
            </div>
            <button className="hero-source" onClick={() => navigate("handbook")}>
              <span className="hero-source-icon"><LibraryBig size={22} /></span>
              <span><strong>Sample student handbook</strong><small>{STUDENT_HANDBOOK.length} policy sections · Simulated policies</small></span>
              <ArrowUpRight size={17} />
            </button>
          </section>

          <div className="workspace">
            <div className="primary">
              <form className="card ask-card" onSubmit={(event) => { event.preventDefault(); ask(draft); }}>
                <label htmlFor="question">What would you like to know?</label>
                <div className="compose">
                  <Search size={20} aria-hidden="true" />
                  <input id="question" ref={questionRef} placeholder="e.g. fees or minimum attendance" value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={500} required />
                  {(draft || run) && <button className="clear-question" type="button" aria-label="Clear question and answer" onClick={clearQuestion}><X size={18} /></button>}
                  <button className="primary-button" disabled={!draft.trim()}>Find answer <ArrowRight size={17} /></button>
                </div>
              </form>

              <section className="card result" aria-labelledby="result-title" ref={resultRef} tabIndex={-1}>
                <div className="result-heading">
                  <h2 id="result-title"><FileText size={19} /> Policy answer</h2>
                  {response && <span className={source ? "status answered" : "status missing"}>{source ? <Check size={15} /> : <CircleHelp size={15} />}{source ? "Answered" : "Not found"}</span>}
                </div>
                {response ? <>
                  <p className="asked">{run.question}</p>
                  <p className="answer">{response.answer}</p>
                  {source && <div className="evidence">
                    <div><strong>Exact policy quote</strong><span>{source.section_id}</span></div>
                    <blockquote>“{response.quoted_source_text}”</blockquote>
                    <button className="text-button" onClick={() => navigate("handbook", source.section_id)}>Read full section <ArrowUpRight size={15} /></button>
                    <button className="text-button bookmark-button" aria-pressed={saved.includes(source.section_id)} onClick={() => toggleSaved(source.section_id)}><Bookmark size={15} /> {saved.includes(source.section_id) ? "Saved to dashboard" : "Save policy"}</button>
                  </div>}
                  {source?.category === "Fees" && <div className="filters related" role="group" aria-label="Related fee questions">
                    {feeQuestions.filter((question) => question.toLowerCase() !== run.question.toLowerCase()).map((question) => (
                      <button key={question} onClick={() => ask(question)}>{question}</button>
                    ))}
                  </div>}
                  {!source && <button className="text-button" onClick={() => navigate("handbook")}>Browse the handbook <ArrowUpRight size={15} /></button>}
                  <details className="json" open={jsonOpen} onToggle={(event) => setJsonOpen(event.currentTarget.open)}>
                    <summary><Code2 size={17} /> JSON output <ArrowDown size={15} /></summary>
                    <div className="json-content">
                      <button className="text-button" onClick={copyJson}><Clipboard size={15} /> Copy JSON</button>
                      <span role="status">{copyStatus}</span>
                      <pre>{json}</pre>
                    </div>
                  </details>
                </> : <div className="empty">
                  <span><BookOpen size={24} /></span>
                  <p>Your answer and its exact policy quote will appear here.</p>
                </div>}
              </section>
            </div>

            <aside className="card examples">
              <h2>Try a question</h2>
              {examples.map(([category, question]) => (
                <button key={category} onClick={() => ask(question)}>
                  <span><small>{category}</small>{question}</span><ChevronRight size={17} />
                </button>
              ))}
              <div className="topic-links filters" role="group" aria-label="Browse handbook by topic">
                <h2>Browse by topic</h2>
                {categories.slice(1).map((category) => (
                  <button key={category} onClick={() => navigate("handbook", null, category)}>{category}</button>
                ))}
              </div>
            </aside>
          </div>
        </>}
        {page === "handbook" && <>
          <button className="text-button back" onClick={() => navigate("ask")}><ArrowLeft size={17} /> Back to questions</button>
          <section className="handbook">
            <h1 ref={headingRef} tabIndex={-1}>Student handbook</h1>
            <p>Browse the simulated policy sections used by this prototype.</p>
            <label className="handbook-search"><Search size={19} /><input type="search" aria-label="Search policy sections" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by keyword or section ID" /></label>
            <div className="filters" aria-label="Filter by topic">
              {categories.map((category) => <button key={category} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}</button>)}
            </div>
            <div className="sections">
              {visibleSections.map((section) => <article id={section.section_id} key={section.section_id} tabIndex={-1} className={section.section_id === sourceId ? "card selected-section" : "card"}>
                <div className="section-meta"><span>{section.category}</span><span>{section.section_id}</span></div>
                <h2>{section.title}</h2>
                <p>{section.content}</p>
                <button className="text-button bookmark-button" aria-pressed={saved.includes(section.section_id)} onClick={() => toggleSaved(section.section_id)}><Bookmark size={15} /> {saved.includes(section.section_id) ? "Saved to dashboard" : "Save policy"}</button>
              </article>)}
              {!visibleSections.length && <p role="status">No sections match your search.</p>}
            </div>
          </section>
        </>}
        <footer><span>CampusClarity · SCSE4041</span><span>Local prototype · Sample policies for demonstration</span></footer>
      </main>
    </div>
  );
}
