import React, { useState } from "react";
import { 
  ShieldCheck, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Search, 
  Layers, 
  X,
  FileText,
  Terminal,
  Cpu
} from "lucide-react";
import { STUDENT_HANDBOOK } from "./data/studentHandbook";
import { runPipeline } from "./utils/engine";
import "./App.css";

const PRESETS = [
  {
    type: "Normal",
    category: "chip-normal",
    label: "Minimum Attendance Required?",
    query: "What is the minimum attendance percentage required to appear in the end-term exams?"
  },
  {
    type: "Normal",
    category: "chip-normal",
    label: "Phone Caught in Exam Hall?",
    query: "What is the penalty if a student is caught with a mobile phone in the examination hall?"
  },
  {
    type: "Normal",
    category: "chip-normal",
    label: "Hostel Weekend Curfew?",
    query: "What is the hostel in-time curfew on weekends for resident students?"
  },
  {
    type: "Normal",
    category: "chip-normal",
    label: "Late Fee Surcharge?",
    query: "What is the late fee charge per day if I pay my tuition fee during the grace period?"
  },
  {
    type: "Edge",
    category: "chip-edge",
    label: "68% Attendance Medical?",
    query: "My attendance is 68% because I was hospitalized for two weeks. Am I debarred from the exam?"
  },
  {
    type: "Edge",
    category: "chip-edge",
    label: "Withdraw 12 Days Before?",
    query: "Can I get a full 100% refund if I withdraw my admission 12 days before classes begin?"
  },
  {
    type: "Edge",
    category: "chip-edge",
    label: "Hinglish Attendance Query",
    query: "Bhai mera attendance 62% ho gaya hai, kya mujhe supplementary summer semester dena padega?"
  },
  {
    type: "Invalid",
    category: "chip-invalid",
    label: "Campus Wi-Fi Password?",
    query: "What is the Wi-Fi password for the student hostel and library network?"
  },
  {
    type: "Invalid",
    category: "chip-invalid",
    label: "Gym & Pool Timings?",
    query: "What are the timings and membership fees for the campus swimming pool and gym?"
  },
  {
    type: "Invalid",
    category: "chip-invalid",
    label: "Bypass Hostel ERP?",
    query: "How can I bypass the hostel ERP system to stay out overnight without informing my parents?"
  }
];

export default function App() {
  const [query, setQuery] = useState(
    "What is the minimum attendance percentage required to appear in the end-term exams?"
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(() => runPipeline(query));
  const [copied, setCopied] = useState(false);
  const [showHandbook, setShowHandbook] = useState(false);
  const [handbookFilter, setHandbookFilter] = useState("All");

  const handleRun = () => {
    if (!query.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const res = runPipeline(query);
      setResult(res);
      setLoading(false);
    }, 250);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(result.output_json, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredHandbook = handbookFilter === "All" 
    ? STUDENT_HANDBOOK 
    : STUDENT_HANDBOOK.filter(s => s.category === handbookFilter);

  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="app-header">
        <div className="brand-section">
          <div className="logo-badge">
            <ShieldCheck size={28} color="#ffffff" />
          </div>
          <div className="title-group">
            <h1>Campus Helpdesk Assistant</h1>
            <p>Problem Pool C1 • Grounded University Policy Query Engine</p>
          </div>
        </div>

        <div className="header-badges">
          <div className="pill-badge">
            <Cpu size={14} color="#60a5fa" />
            <span>Gemini Flash</span>
          </div>
          <div className="pill-badge">
            <Layers size={14} color="#a78bfa" />
            <span>5-Prompt Pipeline</span>
          </div>
          <button className="btn-handbook" onClick={() => setShowHandbook(true)}>
            <BookOpen size={16} />
            <span>Policy Handbook ({STUDENT_HANDBOOK.length})</span>
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="main-grid">
        {/* Left Column: Query Console */}
        <section className="panel-card">
          <h2 className="card-title">
            <Search size={18} color="#3b82f6" />
            <span>Student Policy Inquiry</span>
          </h2>

          <div className="query-box">
            <input
              type="text"
              className="query-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRun()}
              placeholder="Ask about attendance, grading, fees, exams, or hostel rules..."
            />
          </div>

          <div className="preset-group">
            <div className="preset-title">Test Presets (Normal, Edge, Invalid)</div>
            <div className="preset-chips">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  className={`chip ${p.category}`}
                  onClick={() => {
                    setQuery(p.query);
                    const res = runPipeline(p.query);
                    setResult(res);
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <button className="btn-run" onClick={handleRun} disabled={loading}>
            {loading ? (
              <span>Executing 5-Prompt Pipeline...</span>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Execute Grounded Pipeline</span>
              </>
            )}
          </button>

          {/* 5-Stage Pipeline Progress Card */}
          <div className="pipeline-section">
            <div className="pipeline-header">
              <span>Pipeline Architecture Execution</span>
              <span style={{ fontSize: "0.72rem", color: "#60a5fa" }}>5 Chained Prompts</span>
            </div>

            <div className="pipeline-steps">
              <div className="pipe-step active">
                <span className="step-num">P1</span>
                <span className="step-name">Intent Classifier</span>
                <span className="step-meta">
                  Domain: {result.pipeline_stages.p1_intent.domain}
                </span>
              </div>

              <div className="pipe-step active">
                <span className="step-num">P2</span>
                <span className="step-name">Context Extractor</span>
                <span className="step-meta">
                  Sec: {result.pipeline_stages.p2_context.targetSectionId || "None"}
                </span>
              </div>

              <div className="pipe-step active">
                <span className="step-num">P3</span>
                <span className="step-name">Grounded Answerer</span>
                <span className="step-meta">Zero Extrapolation</span>
              </div>

              <div className="pipe-step active">
                <span className="step-num">P4</span>
                <span className="step-name">Citation Extractor</span>
                <span className="step-meta">Verbatim Substring</span>
              </div>

              <div className="pipe-step active">
                <span className="step-num">P5</span>
                <span className="step-name">Refusal & JSON Guard</span>
                <span className="step-meta">Status: {result.output_json.status}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Output & Verification Audit */}
        <section className="panel-card">
          <h2 className="card-title">
            <FileText size={18} color="#10b981" />
            <span>Verified Grounded Response</span>
          </h2>

          {/* Status Badge */}
          <div
            className={`status-banner ${
              result.output_json.status === "answered"
                ? "status-answered"
                : "status-refusal"
            }`}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700 }}>
              {result.output_json.status === "answered" ? (
                <>
                  <CheckCircle2 size={18} />
                  <span>STATUS: ANSWERED (GROUNDED)</span>
                </>
              ) : (
                <>
                  <AlertTriangle size={18} />
                  <span>STATUS: NOT FOUND (GRACEFUL REFUSAL)</span>
                </>
              )}
            </div>
            {result.output_json.section_id && (
              <span style={{ fontSize: "0.8rem", fontWeight: 600, background: "rgba(0,0,0,0.25)", padding: "4px 8px", borderRadius: "6px" }}>
                {result.output_json.section_id}
              </span>
            )}
          </div>

          {/* Answer Card */}
          <div className="answer-card">
            <h4>Official Explanation</h4>
            <div className="answer-text">{result.output_json.answer}</div>
          </div>

          {/* Quoted Verbatim Source */}
          {result.output_json.quoted_source_text ? (
            <div className="quote-card">
              <div className="quote-title">
                <span>Quoted Official Sentence (Verbatim Evidence)</span>
                <span>[{result.output_json.section_id}]</span>
              </div>
              <div className="quote-content">
                "{result.output_json.quoted_source_text}"
              </div>
            </div>
          ) : (
            <div className="quote-card" style={{ borderLeftColor: "#f59e0b", background: "rgba(245, 158, 11, 0.05)" }}>
              <div className="quote-title" style={{ color: "#fbbf24" }}>
                <span>Quoted Source Text</span>
              </div>
              <div className="quote-content" style={{ color: "#fef3c7" }}>
                null (Information absent from handbook; routed directly to Academic Office)
              </div>
            </div>
          )}

          {/* Substring Audit Verification Badge */}
          <div className={`audit-indicator ${result.audit.passed ? "passed" : ""}`}>
            <ShieldCheck size={16} color={result.audit.passed ? "#10b981" : "#f59e0b"} />
            <span>{result.audit.note}</span>
          </div>

          {/* Structured JSON Inspector */}
          <div className="json-box">
            <div className="json-header">
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Terminal size={14} />
                <span>Raw JSON Output (Production Schema)</span>
              </span>
              <button className="btn-copy" onClick={handleCopyJson}>
                {copied ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                <span>{copied ? "Copied!" : "Copy JSON"}</span>
              </button>
            </div>
            <pre style={{ color: "#a5f3fc", fontSize: "0.78rem", overflowX: "auto" }}>
              {JSON.stringify(result.output_json, null, 2)}
            </pre>
          </div>
        </section>
      </main>

      {/* Handbook Modal */}
      {showHandbook && (
        <div className="modal-overlay" onClick={() => setShowHandbook(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <BookOpen size={20} color="#60a5fa" />
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Official University Handbook Knowledge Base</h3>
              </div>
              <button
                onClick={() => setShowHandbook(false)}
                style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div style={{ display: "flex", gap: "6px", padding: "12px 24px 0", borderBottom: "1px solid #1e293b" }}>
              {["All", "Attendance", "Grading", "Examinations", "Fees", "Hostel"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setHandbookFilter(cat)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px 6px 0 0",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    background: handbookFilter === cat ? "#1e293b" : "transparent",
                    color: handbookFilter === cat ? "#93c5fd" : "#94a3b8"
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="modal-body">
              {filteredHandbook.map((sec) => (
                <div key={sec.section_id} className="hb-item">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="hb-badge">[{sec.section_id}] {sec.category}</span>
                  </div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#ffffff", marginBottom: "6px" }}>
                    {sec.title}
                  </h4>
                  <p style={{ fontSize: "0.84rem", color: "#cbd5e1", lineHeight: 1.5 }}>
                    {sec.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
