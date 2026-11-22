import { useState } from "react";
import {
  ArrowRight, Bookmark, CalendarDays, ClipboardCheck, CreditCard, GraduationCap,
  History, LibraryBig, MessageSquare, Plus, Trash2,
} from "lucide-react";
import { runPipeline, STUDENT_HANDBOOK } from "./utils/engine.js";
import "./Portal.css";

const services = [
  { title: "Ask CampusClarity", description: "Get answers with handbook citations", icon: MessageSquare, page: "ask" },
  { title: "Fees & refunds", description: "Payment deadlines, late fees and refunds", icon: CreditCard, category: "Fees" },
  { title: "Exams & re-evaluation", description: "Exam rules and answer script review", icon: GraduationCap, category: "Examinations" },
  { title: "Student handbook", description: "Browse every policy section", icon: LibraryBig, page: "handbook" },
];

export function Dashboard({ navigate, saved, toggleSaved, tasks, recent, clearRecent, reopen, headingRef }) {
  const pending = tasks.filter(({ done }) => !done).length;
  return <div className="portal-page">
    <section className="portal-hero">
      <div>
        <p className="portal-eyebrow">CampusClarity Student Portal</p>
        <h1 ref={headingRef} tabIndex={-1}>Your campus dashboard</h1>
        <p>Find campus policies, check your attendance and keep track of your deadlines.</p>
        <button className="portal-cta" onClick={() => navigate("ask")}>Ask a policy question <ArrowRight size={17} /></button>
      </div>
      <GraduationCap className="portal-hero-mark" aria-hidden="true" strokeWidth={1} />
    </section>

    <section className="portal-section">
      <h2>Campus services</h2>
      <div className="service-grid">
        {services.map(({ title, description, icon: Icon, page, category }) => (
          <button className="card service-tile" key={title} onClick={() => navigate(page || "handbook", null, category)}>
            <span className="service-icon"><Icon size={21} /></span>
            <strong>{title}</strong>
            <span>{description}</span>
            <ArrowRight className="service-arrow" size={17} />
          </button>
        ))}
      </div>
    </section>

    <section className="portal-section">
      <h2>My workspace</h2>
      <div className="portal-grid">
        <article className="card portal-card">
          <h2><CalendarDays size={20} /> Student planner</h2>
          <p>{pending ? `${pending} open ${pending === 1 ? "task" : "tasks"}` : "Add your next deadline or reminder."}</p>
          <button className="text-button" onClick={() => navigate("tools")}>Open student tools <ArrowRight size={16} /></button>
        </article>
        <article className="card portal-card">
          <h2><History size={20} /> Recent policy questions</h2>
          {recent.length ? <>
            <ul className="portal-list">
              {recent.map((question) => <li key={question}>
                <button className="text-button" onClick={() => reopen(question)}>{question} <ArrowRight size={15} /></button>
              </li>)}
            </ul>
            <button className="text-button" onClick={clearRecent}>Clear history</button>
          </> : <p>Questions you ask will appear here for quick access.</p>}
        </article>
        <article className="card portal-card">
          <h2><Bookmark size={20} /> Saved policies</h2>
          {saved.length ? <ul className="portal-list">
            {saved.map((id) => {
              const section = STUDENT_HANDBOOK.find(({ section_id }) => section_id === id);
              return section && <li key={id}>
                <button className="text-button" onClick={() => navigate("handbook", id)}>{section.title}</button>
                <button className="portal-icon-button" aria-label={`Remove bookmark for ${section.title}`} onClick={() => toggleSaved(id)}><Trash2 size={16} /></button>
              </li>;
            })}
          </ul> : <p>Bookmark a handbook section to keep it here.</p>}
        </article>
      </div>
    </section>
  </div>;
}

const attendancePolicy = runPipeline("What is the minimum attendance required?");
const attendanceTarget = Number(attendancePolicy.quoted_source_text.match(/\d+(?=%)/)[0]);

function Attendance({ navigate }) {
  const [held, setHeld] = useState("");
  const [attended, setAttended] = useState("");
  const valid = held !== "" && attended !== "" && +held > 0 && +attended >= 0 && +attended <= +held;
  const percentage = valid ? +attended / +held * 100 : 0;
  const needed = Math.max(0, Math.ceil((attendanceTarget * +held - 100 * +attended) / (100 - attendanceTarget)));
  return <article className="card portal-card">
    <h2><ClipboardCheck size={20} /> Attendance calculator</h2>
    <p>Check one course against the handbook's standard {attendanceTarget}% threshold.</p>
    <div className="tool-fields">
      <label>Classes held<input type="number" min="1" step="1" value={held} onChange={(event) => setHeld(event.target.value)} /></label>
      <label>Classes attended<input type="number" min="0" step="1" value={attended} onChange={(event) => setAttended(event.target.value)} /></label>
    </div>
    <div className="attendance-result" role="status">
      {valid && Number.isInteger(+held) && Number.isInteger(+attended) ? <>
        <strong>{new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(percentage)}%</strong>
        <progress aria-label="Current attendance" value={percentage} max="100" />
        <span>{needed ? `Attend the next ${needed} ${needed === 1 ? "class" : "classes"} in a row to reach ${attendanceTarget}%.` : "You meet the standard attendance threshold."}</span>
      </> : <span>{held && attended ? "Use whole numbers. Classes attended must be between zero and classes held." : "Enter both class counts to see your attendance."}</span>}
    </div>
    <button className="text-button" onClick={() => navigate("handbook", attendancePolicy.section_id)}>Read attendance and condonation policy <ArrowRight size={16} /></button>
  </article>;
}

export function StudentTools({ navigate, tasks, setTasks, headingRef }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const orderedTasks = [...tasks].sort((first, second) =>
    Number(first.done) - Number(second.done) || (first.date || "9999").localeCompare(second.date || "9999")
  );

  function addTask(event) {
    event.preventDefault();
    if (!title.trim()) return;
    const task = { id: crypto.randomUUID(), title: title.trim(), date, done: false };
    setTasks((current) => [...current, task]);
    setTitle("");
    setDate("");
  }

  return <div className="portal-page">
    <header className="tools-header">
      <h1 ref={headingRef} tabIndex={-1}>Student tools</h1>
      <p>Check attendance and plan upcoming deadlines.</p>
    </header>
    <div className="portal-grid">
      <Attendance navigate={navigate} />
      <article className="card portal-card">
        <h2><CalendarDays size={20} /> Student planner</h2>
        <p>Tasks are saved in this browser.</p>
        <form className="tool-fields planner-form" onSubmit={addTask}>
          <label>Task<input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} placeholder="e.g. Pay semester fees" required /></label>
          <label>Due date (optional)<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
          <button className="primary-button" disabled={!title.trim()}><Plus size={17} /> Add task</button>
        </form>
        {orderedTasks.length > 0 && <ul className="portal-list planner-list">
          {orderedTasks.map((task) => <li key={task.id}>
            <label className={task.done ? "task-done" : undefined}>
              <input type="checkbox" checked={task.done} onChange={(event) => {
                const done = event.target.checked;
                setTasks((current) => current.map((item) => item.id === task.id ? { ...item, done } : item));
              }} />
              <span>{task.title}{task.date && <time dateTime={task.date}>{new Date(`${task.date}T00:00:00`).toLocaleDateString("en-IN", { dateStyle: "medium" })}</time>}</span>
            </label>
            <button className="portal-icon-button" aria-label={`Delete ${task.title}`} onClick={() => setTasks((current) => current.filter(({ id }) => id !== task.id))}><Trash2 size={16} /></button>
          </li>)}
        </ul>}
      </article>
    </div>
  </div>;
}
