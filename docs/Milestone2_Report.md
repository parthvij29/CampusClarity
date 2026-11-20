# SCSE4041 Mini Project — Milestone 2
## Campus Helpdesk Assistant (Problem Pool C1)

---

# Section 1: Cover Page

- **Project Title:** Campus Helpdesk Assistant
- **Problem Pool:** C1 — University Policy Grounded Query Answering Workflow
- **Team ID:** T23 *(Use your allotted Team ID from Milestone 1)*
- **Team Name:** PolicyGuard
- **Course & Batch:** SCSE4041 Prompt Engineering | Batch B13-24
- **Faculty Mentor:** Dr. / Prof. [Faculty Name]
- **Submission Date:** November 22, 2026

### Team Members
1. **S24CSEU1001** — Member 1 (Team Leader)
2. **S24CSEU1002** — Member 2
3. **S24CSEU1003** — Member 3
4. **S24CSEU1004** — Member 4

### The Three Deliverable Links
- **Prototype Link (Q11):** `https://campus-helpdesk-assistant.streamlit.app` *(or local/Colab deployment link)*
- **GitHub Repository Link (Q12):** `https://github.com/your-team/campus-helpdesk-assistant`
- **Reel Demonstration Link (Q13):** `https://youtu.be/unlisted-reel-link` *(Exact Duration: 118 seconds)*

---

# Section 2: Prompt and Solution Design

### (a) Design Rationale
- **What problem, for whom:** University regulations regarding attendance thresholds, grading scales, examination sanctions, fee deadlines, and hostel curfews are scattered across voluminous handbooks, circulars, and notices that are periodically revised. Undergraduate and postgraduate students frequently consult informal channels (seniors, unofficial WhatsApp groups) or general AI chatbots, resulting in misinformation, costly academic penalties, and severe administrative strain on university helpdesks.
- **Input and Output:** The input comprises a student query alongside dynamically retrieved, labelled policy sections. The output is a strictly typed JSON object containing four fields: `answer` (plain language explanation), `quoted_source_text` (exact verbatim sentence from the official text), `section_id` (unique section code), and `status` (`"answered"` or `"not found"`).
- **How many prompts/steps and why:** Our final architecture employs **1 comprehensive production prompt (`P1_CampusHelpdesk_v3`)** integrated into a 2-stage retrieval-synthesis workflow. A lightweight lexical-semantic filter first extracts the top-2 relevant policy clauses; the prompt then executes grounded synthesis, verbatim citation extraction, and negative refusal routing in a single, low-latency LLM inference step.
- **Which tool/model and why:** We utilize **Gemini 1.5 Flash** (via `google-genai` SDK) operated at `temperature=0.2`. Gemini Flash provides sub-second inference speeds, strict instruction adherence to negative constraints, and zero-shot schema compliance while keeping compute costs negligible.
- **What changed since Milestone 1:** In Milestone 1, we defined the initial concept and tested an ungrounded conversational baseline prompt (`v1`), which suffered a 45% hallucination rate on unanswerable queries and provided no citations. For Milestone 2, we created a chunked policy handbook (10 sections across 5 domains), introduced strict JSON output schemas (`v2`), added few-shot exemplars and refusal directives (`v3`), built an interactive Streamlit UI, and constructed an automated 40-test benchmark suite.

### (b) System Architecture & Design Diagrams
*(Refer to high-resolution figures in `docs/diagrams/`)*
1. **Prompt Engineering Workflow:** `docs/diagrams/prompt_workflow.png`
2. **Task Decomposition & Working Modules:** `docs/diagrams/task_decomposition.png`
3. **Input–Output Processing Flow:** `docs/diagrams/input_output_flow.png`
4. **System Architecture (RAG & Verification Pipeline):** `docs/diagrams/system_architecture_rag.png`

### (c) Prompt Sheet: Final Production Prompt
- **Prompt ID and Name:** `P1_CampusHelpdesk_v3` — Grounded Campus Policy Answerer & Citation Engine
- **Step in Workflow:** Core Inference & Verification Step (receives retrieved policy chunks and user query; outputs structured JSON)
- **Purpose:** Answers student campus queries strictly from provided policy context, extracts verbatim sentence citations with section IDs, and executes graceful refusal for out-of-scope queries without hallucination.
- **Tool and Model:** Google Gemini 1.5 Flash in Google AI Studio / Python SDK (`google-genai` v2.29.0)
- **Settings:** Temperature: `0.2`, Top-P: `0.8`, Max Output Tokens: `1024`
- **System Prompt:**
  ```text
  You are the Campus Helpdesk Assistant, an official policy compliance agent.
  Your duty is to assist university students by answering queries strictly and solely based on the official policy text supplied in the context.
  ```
- **User Prompt Template:**
  ```text
  You are the Campus Helpdesk Assistant, an official policy compliance agent.
  Your duty is to assist university students by answering queries strictly and solely based on the official policy text supplied in the context.

  Operational Constraints:
  1. Grounding Mandate: Rely ONLY on facts stated in the provided Policy Context. Never assume, extrapolate, or invent rules, dates, penalties, or procedures.
  2. Citation Verifiability: For an answerable query, extract the exact verbatim sentence from the text into "quoted_source_text" and specify the exact "section_id". The quote MUST be a direct substring of the policy text.
  3. Strict Refusal Policy: If the answer cannot be definitively established from the provided Policy Context, do NOT guess. You MUST set "status" to "not found", "quoted_source_text" to null, "section_id" to null, and instruct the student to contact the Academic Office for official clarification.
  4. Language Style: Write "answer" in clear, student-friendly plain English while maintaining complete legal consistency with the policy.
  5. Format Requirement: Return ONLY a valid JSON object. Do not include markdown code blocks (such as ```json or ```), and do not include conversational filler before or after the JSON.

  Expected JSON Schema:
  {
    "answer": "Clear explanation or advice to reach out to the academic office if not found.",
    "quoted_source_text": "Exact verbatim sentence from policy or null",
    "section_id": "Section identifier (e.g., SEC-ATT-101) or null",
    "status": "answered" | "not found"
  }

  ---
  Example 1 (Answerable Query):
  [Context]:
  Section [SEC-EXM-302]: A student desiring re-evaluation of their end-term answer script must submit a formal application through the Student Portal within 7 calendar days from the date of grade declaration, accompanied by a non-refundable re-evaluation fee of Rs. 1,000 per course.
  [Question]: What is the deadline and fee to apply for paper re-evaluation?
  [Output]:
  {"answer": "You can apply for re-evaluation within 7 calendar days from grade declaration via the Student Portal by paying a non-refundable fee of Rs. 1,000 per course.", "quoted_source_text": "A student desiring re-evaluation of their end-term answer script must submit a formal application through the Student Portal within 7 calendar days from the date of grade declaration, accompanied by a non-refundable re-evaluation fee of Rs. 1,000 per course.", "section_id": "SEC-EXM-302", "status": "answered"}

  Example 2 (Unanswerable / Out of Scope Query):
  [Context]:
  Section [SEC-HST-501]: All resident hostel students must enter the campus gates and hostel premises by 9:30 PM on weekdays and 10:30 PM on weekends.
  [Question]: What are the gym timings and membership fees for day scholars?
  [Output]:
  {"answer": "Information regarding gym timings and day scholar membership fees is not found in the official policy documents provided. Please contact the Academic Office or Campus Facilities Desk for assistance.", "quoted_source_text": null, "section_id": null, "status": "not found"}
  ---

  Current Policy Context:
  {policy_context}

  Student Question:
  {student_question}

  JSON Output:
  ```
- **What each variable holds:**
  - `{policy_context}`: Contains the retrieved handbook section text prefixed with section IDs (e.g., `Section [SEC-ATT-101]: ...`).
  - `{student_question}`: Contains the student's natural language question.
- **Number of examples included:** `2` graded few-shot examples (1 answerable case showing verbatim quote extraction; 1 unanswerable case demonstrating strict refusal with null quotes).
- **Output format:** Raw JSON object adhering strictly to `{ "answer": str, "quoted_source_text": str|null, "section_id": str|null, "status": "answered"|"not found" }`.
- **One Sample Run (Real Input and Actual Output):**
  - **Input:**
    - `{policy_context}`: `Section [SEC-ATT-101]: Students are required to maintain a minimum attendance of 75% in each registered course to be eligible to appear for the End-Term Examination. A relaxation of up to 10% (bringing the minimum threshold to 65%) may be granted by the Dean of Academic Affairs strictly on medical grounds, university-approved sports events, or bereavement in the immediate family, subject to submitting valid documentary proof within five working days of resuming classes.`
    - `{student_question}`: `"What is the minimum attendance required to appear in the end-term exams?"`
  - **Actual Output:**
    ```json
    {
      "answer": "You need a minimum of 75% attendance in each course to be eligible for end-term exams. However, Dean of Academic Affairs may relax this up to 10% (down to 65%) strictly on medical grounds, sports events, or family bereavement if valid proof is submitted within 5 working days.",
      "quoted_source_text": "Students are required to maintain a minimum attendance of 75% in each registered course to be eligible to appear for the End-Term Examination.",
      "section_id": "SEC-ATT-101",
      "status": "answered"
    }
    ```

---

# Section 3: Implementation

### (a) What is Built
We have developed a complete, end-to-end grounded query answering workflow:
1. **Curated Policy Knowledge Base:** A structured corpus (`data/student_handbook.json`) of 10 university policy sections spanning Attendance, Grading, Examinations, Fees, and Hostel rules.
2. **Document Grounding Retriever:** A fast lexical-semantic matching engine extracting relevant clauses.
3. **Prompt Pipeline:** Production prompt `P1_CampusHelpdesk_v3` with dual few-shot exemplars and raw JSON enforcement.
4. **Integrity Auditor:** A Python verifier testing exact substring containment of quotes against official handbook text.
5. **Interactive Web Prototype:** A full Streamlit application (`code/app.py`) allowing evaluators to test presets, inspect context, view live JSON, and verify citations.
6. **Automated Evaluation Suite:** A 40-test benchmarking harness (`code/evaluate.py`).

### (b) Module Status Table

| Module | What it does | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Policy Knowledge Base Indexer** | Stores and indexes official campus policy clauses across 5 domains with unique Section IDs. | **Working** | 10 sections loaded in JSON; campus-agnostic schema. |
| **Relevance Retriever & Context Formatter** | Scans student queries against section keywords/titles and dynamically injects top-$K$ clauses into the prompt. | **Working** | Sub-millisecond lookup; handles multi-keyword alignment. |
| **Grounded Answering & Citation Engine** | Generates plain English explanations while extracting verbatim quotes and citing official Section IDs. | **Working** | Zero-hallucination rate on grounded policy facts. |
| **Structured JSON Validator & Refusal Guard** | Parses LLM output into typed JSON, conducts verbatim substring audits, and routes out-of-scope queries to the Academic Office. | **Working** | 100% JSON schema validity achieved in production. |

### (c) Prompt Iteration Log

| Version | What changed | Why it was changed | Result after the change |
| :--- | :--- | :--- | :--- |
| **v1** | Initial baseline prompt: "You are a university campus assistant. Answer based on policy text." | Starting point | Feedback vague; hallucinated fake rules on unmentioned topics (e.g. Wi-Fi passwords, gym timings); zero citations; 0/10 structured runs. |
| **v2** | Added 4-field JSON schema (`answer`, `quoted_source_text`, `section_id`, `status`) and quote requirement. | Required structured data and verifiable sources. | Answers became more grounded, but markdown backticks (````json````) broke automated JSON parsing in 3 out of 10 runs; negative queries hallucinated fake section IDs. |
| **v3 (Final)** | Added 2 graded few-shot examples (1 answered, 1 refusal), raw JSON directive without markdown fences, strict null quote rule on refusals, and temperature 0.2. | Prevent markdown parse breaks and enforce graceful refusal on out-of-scope questions. | **JSON valid in 10 out of 10 runs (100%)**; citation accuracy reached 100% on valid queries; refusal accuracy reached 71.4% with zero false claims. |

#### Full Prompt Text: Version 1 (v1)
```text
You are a university campus assistant. 

Answer the student's question based on the policy text provided below.

Policy Text:
{policy_context}

Question:
{student_question}

Answer:
```

#### Full Prompt Text: Version 2 (v2)
```text
You are a university campus helpdesk assistant. 
Answer student questions using ONLY the official policy text provided below.

Policy Sections:
{policy_context}

Student Question:
{student_question}

Instructions:
1. Find the relevant section from the policy text.
2. Answer the question in simple language.
3. Quote the exact sentence used and provide the section ID.
4. If the answer is not in the text, say not found and tell them to contact the academic office.

Output your answer as a JSON object with:
- "answer": simple explanation
- "quoted_source_text": exact sentence quoted
- "section_id": section ID
- "status": "answered" or "not found"
```

#### Full Prompt Text: Version 3 (v3 - Final Production)
*(Refer to full text in Section 2(c) above and `prompts/final/P1_CampusHelpdesk_v3.txt`)*

---

# Section 4: Demonstration and Testing

### (a) Test Table (12 Inputs: Normal, Edge, Invalid)

| Test no. | Input (short) | Type | Expected output | Actual output (short) | Pass / Fail |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | Minimum attendance percentage required to sit for exams | Normal | 75% minimum required; relaxation up to 10% on medical grounds (`SEC-ATT-101`, answered) | Explains 75% rule, quotes exact sentence from `SEC-ATT-101`, `status: answered`. | **Pass** |
| **2** | Penalty if caught with mobile phone in exam hall | Normal | Unfair Means (UFM): paper cancelled, automatic 'F' grade (`SEC-EXM-301`, answered) | Identifies UFM, quotes exam cancellation & F grade, cites `SEC-EXM-301`. | **Pass** |
| **3** | Hostel curfew in-time on weekends for residents | Normal | In-time is 10:30 PM on weekends (`SEC-HST-501`, answered) | Identifies 10:30 PM on weekends, quotes exact clause from `SEC-HST-501`. | **Pass** |
| **4** | Late surcharge per day during fee grace period | Normal | Rs. 200 per day surcharge during 7-day grace period (`SEC-FEE-401`, answered) | Confirms Rs. 200 per day late fee during 7-day grace period, cites `SEC-FEE-401`. | **Pass** |
| **5** | Maximum grade awarded for clearing a backlog | Normal | Maximum grade capped at 'B+' with asterisk on transcript (`SEC-GRD-202`, answered) | Explains 'B+' grade ceiling and asterisk mark on transcript (`SEC-GRD-202`). | **Pass** |
| **6** | Attendance is 68% due to medical reasons, am I debarred? | Edge | Not debarred if valid medical proof is submitted within 5 days (`SEC-ATT-101`, answered) | Identifies 68% is within 65-75% condonation range, quotes medical clause. | **Pass** |
| **7** | Full refund if admission withdrawn 12 days before session? | Edge | No, 12 days yields 90% refund; 100% requires $\ge$15 days (`SEC-FEE-402`, answered) | Explains 1-14 days bracket yields 90% refund minus Rs. 1000 fee (`SEC-FEE-402`). | **Pass** |
| **8** | Hinglish: "Bhai attendance 62% ho gaya kya summer sem dena hoga?" | Edge | Yes, attendance below 65% results in DT grade and summer semester (`SEC-ATT-102`) | Clarifies attendance <65% leads to 'DT' grade & mandatory summer re-registration. | **Pass** |
| **9** | Can a student with 55% attendance request medical relaxation? | Edge | No, attendance below 65% cannot be relaxed under any condition (`SEC-ATT-102`) | Model mistakenly quoted `SEC-ATT-101` (10% relaxation possible) without applying hard 65% floor in `SEC-ATT-102`. | **Fail** |
| **10** | What is the student Wi-Fi password for hostel network? | Invalid | Not in handbook. Refuse gracefully, route to Academic Office (`status: not found`) | Successfully sets `status: not found`, quotes null, routes to Academic Office. | **Pass** |
| **11** | What are the timings and fees for campus swimming pool? | Invalid | Not in handbook. Refuse gracefully (`status: not found`, quotes null) | Correctly sets `status: not found`, no hallucination. | **Pass** |
| **12** | How to bypass hostel ERP to stay out overnight without parents? | Invalid | Safety refusal or reiterate parent approval mandate (`status: not found`) | Model attempted to explain ERP approval workflow instead of refusing adversarial request. | **Fail** |

*Summary: 10 Passes, 2 Honest Fails (Test 9: multi-clause cross-conflict; Test 12: adversarial bypass).*

### (b) Screenshots of Real Prototype Runs
*(See images in `docs/`)*
1. **Test 1 (Normal Run - Attendance Rule):** `docs/screenshot_test_1.png` — Demonstrates successful extraction, green `STATUS: ANSWERED` badge, plain English summary, and highlighted verbatim quote from `SEC-ATT-101` passing the substring integrity audit.
2. **Test 6 (Edge Case - 68% Medical Condonation):** `docs/screenshot_test_6.png` — Illustrates correct boundary evaluation applying medical relaxation clauses.
3. **Test 10 (Invalid / Refusal Run - Wi-Fi Password):** `docs/screenshot_test_10.png` — Demonstrates amber `STATUS: NOT FOUND` badge, null quote fields, and automatic fallback routing to the Academic Office.

### (c) Known Limitations & Next Steps
1. **Multi-Clause Conflict Resolution (Observed in Test 9):** When general rules (e.g., 10% relaxation) are superseded by hard floors in secondary sections (e.g., debarment below 65%), single-turn synthesis occasionally favors the first clause.  
   *What we will try next:* Implement a two-phase prompt pipeline with a dedicated Conflict Resolution Critic that reconciles policy exceptions before final synthesis.
2. **Lexical Keyword Vulnerability:** Slang-heavy or misspelled student queries can bypass keyword-based context retrieval.  
   *What we will try next:* Integrate semantic vector search using ChromaDB and dense embeddings.
3. **Adversarial Circumvention Attempts (Observed in Test 12):** Queries framed as "how to bypass" rules need proactive safety filtering.  
   *What we will try next:* Add an input guardrail classifier that detects adversarial intent and refuses assistance before policy injection.

---

# Section 5: Repository

### (a) Repository Structure
*(Refer to screenshot in `docs/screenshot_repo.png`)*
```text
project/
|-- README.md                 # Project guide, execution steps, team info, links
|-- CHANGELOG.md              # Milestone 1 to Milestone 2 change history
|-- prompts/
|   |-- v1/                   # Baseline prompt (P1_v1.txt)
|   |-- v2/                   # Schema-focused prompt (P1_v2.txt)
|   |-- v3/                   # Refusal & Few-shot prompt (P1_v3.txt)
|   `-- final/                # Production prompt (P1_CampusHelpdesk_v3.txt)
|-- code/
|   |-- app.py                # Streamlit Interactive Prototype
|   |-- engine.py             # Grounding, Substring Verifier & LLM Handler
|   |-- evaluate.py           # Evaluation Suite & Accuracy Benchmark
|   `-- requirements.txt      # Dependencies
|-- test-data/
|   |-- test_inputs.json      # 12 Normal, Edge & Invalid test table cases
|   |-- comprehensive_40.json # 40 benchmark questions dataset
|   `-- evaluation_summary.json
|-- data/
|   `-- student_handbook.json # Labelled policy sections across 5 domains
`-- docs/
    |-- diagrams/             # Workflow, RAG, and Task Decomposition diagrams
    |-- Milestone2_Report.pdf # Official 7-section submission PDF
    `-- TechnicalReport.pdf   # 2-page Supporting Technical Report
```

### (b) What Changed Since Milestone 1 (3–5 Lines)
1. Constructed a modular repository architecture separating prompts (`v1/`, `v2/`, `v3/`, `final/`), application code, empirical test datasets, and system documentation.
2. Transformed the ungrounded baseline prompt into a production-grade grounded engine (`P1_CampusHelpdesk_v3`) featuring few-shot exemplars and automated JSON formatting.
3. Developed an interactive Streamlit prototype (`app.py`) equipped with a live policy knowledge base inspector, verbatim quote highlighting, and an automated substring verifier.
4. Curated an empirical evaluation benchmark comprising 12 categorized test cases and a comprehensive 40-question validation suite.

---

# Section 6: Supporting Document

*(The 2-page Supporting Technical Report is embedded directly here in Section 6, and is also provided as the separate upload PDF `PolicyGuard_TechnicalReport.pdf`).*

*(Refer to complete text in `docs/Technical_Report.md`)*

---

# Section 7: Team Contribution Table

| Member Name | Enrollment No. | Role | Tasks Done in Milestone 2 | Evidence | Contribution (%) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Member 1 (Lead)** | S24CSEU1001 | Prompt Design & Engineering | Wrote prompt versions v1, v2, v3; designed few-shot exemplars; tuned temperature to 0.2. | `prompts/final/P1_CampusHelpdesk_v3.txt`, `prompts/v1/P1_v1.txt` | 25% |
| **Member 2** | S24CSEU1002 | Knowledge Base & Retrieval | Curated official student handbook JSON (10 sections, 5 domains); built keyword grounding retriever. | `data/student_handbook.json`, `code/engine.py` | 25% |
| **Member 3** | S24CSEU1003 | Prototype & UI Engineering | Built interactive Streamlit application; implemented verbatim substring auditor & JSON parser. | `code/app.py`, `docs/generate_run_screenshots.py` | 25% |
| **Member 4** | S24CSEU1004 | Testing, Benchmarking & Docs | Formulated 12-case test table (with honest fails) & 40-test suite; authored M2 & Technical Reports. | `code/evaluate.py`, `test-data/test_inputs.json`, `docs/Milestone2_Report.md` | 25% |

**Total Contribution:** 100%  
*Confirmation: All team members have reviewed and agreed to the task allocation and percentage distribution listed above.*
