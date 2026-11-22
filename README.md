# Campus Helpdesk Assistant (Problem Pool C1)

**SCSE4041 Mini Project — Milestone 2**  
*React web prototype and prompt-engineering experiments*

---

## 📌 Project Overview
University rules on attendance, grading, exams, fees, and hostels are distributed across lengthy handbooks, circulars, and notices that undergo revisions each academic year. Students often skip reading these documents and turn to seniors, WhatsApp groups, or generic AI chatbots, leading to outdated advice, severe hallucinated rules, and overwhelming administrative burdens.

**CampusClarity** is the student-facing prototype. It runs a local, clause-based matcher against 10 sample policy sections in [the bundled handbook](web/src/data/student_handbook.json). A response includes a plain-language answer where supported, an exact quote, a section ID and a status. Unmatched questions direct students to the Academic Office. The React demo requires no API key and makes no model calls. It has limited paraphrase and multi-part question coverage, and the sample corpus should not be used to make real university decisions.

The separate prompt experiments in `prompts/` describe this five-stage design:

1. **P1_Intent_Classifier:** Classifies inquiry into Attendance, Grading, Examinations, Fees, Hostel, or Out_Of_Scope.
2. **P2_Context_Extractor:** Selectively prunes candidate handbook sections to isolate operative policy text.
3. **P3_Grounded_Answerer:** Formulates an explanation in plain, accessible language with zero extrapolation.
4. **P4_Citation_Extractor:** Quotes the exact verbatim sentence from the official text alongside the unique `section_id`.
5. **P5_Safety_Refusal_Guard:** Enforces graceful refusal (`status: "not found"` and null quotes) for unanswerable/adversarial queries, routing students directly to the Academic Office.

---

## 👥 Team Information (6 Members)
- **Team ID:** `T16` *(Milestone 1 Assigned Team ID)*
- **Team Name:** `PolicyGuard`
- **Project Title:** `Campus Helpdesk Assistant`
- **Course & Batch:** SCSE4041 - Prompt Engineering | B.Tech CSE

| Enrollment Number | Member Name | Role | Primary Task (Milestone 2) | Contribution (%) |
| :--- | :--- | :--- | :--- | :--- |
| `S24CSEU1616` | **Parth Vij** (Lead) | Lead & 5-Prompt Architect | Architected P1-P5 pipeline, few-shot refusal guards, hyperparameter tuning | **20%** |
| `S24CSEU0217` | **Maitreyi Chaudhary** | Knowledge Base Engineering | Curated student handbook (10 sections across 5 domains), Section ID schema | **16%** |
| `S24CSEU0211` | **Madhav Puri** | Retrieval & Grounding | Built lexical grounding retriever and P1/P2 dynamic context formatter | **16%** |
| `S24CSEU1615` | **Prashant Mangal** | React Frontend & Vercel | Built modern React / Node.js web prototype and deployed to Vercel | **16%** |
| `S24CSEU0055` | **Kushagra Garg** | Integrity & Schema Auditor | Developed P4 verbatim substring verifier and P5 raw JSON schema validator | **16%** |
| `S24CSEU0212` | **Madhav Goyal** | Benchmarking & Technical Report | Formulated 12-case test table & 40-test suite; authored Technical Report | **16%** |

**Total Contribution:** 100% (All members unanimously agreed to this allocation).

---

## 🔗 Important Links
- **Prototype Link (Vercel):** [CampusClarity](https://campus-clarity-xo49.vercel.app/)
- **GitHub Repository:** https://github.com/parthvij29/CampusClarity
- **Reel Link (90–150s):** Drive / Unlisted YouTube Video Link *(Exact length in seconds: 118s)*

---

## 🚀 How to Run Locally

### 1. Run the Modern React / Node Web Application (Recommended)
```bash
cd web
npm install
npm run dev
```
Open your browser at `http://localhost:5173`. Ask a question, inspect the cited section in the searchable handbook, or expand the four-field JSON output.

### 2. Deploy to Vercel (1-Click Deployment)
1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete Milestone 2 web application"
   git push origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Set **Root Directory** to `web` (or leave default since root `vercel.json` is configured).
5. Click **Deploy**! Your app will be live within 30 seconds at `https://<your-project>.vercel.app`.

### 3. Run Automated Evaluation Suite (Python)
```bash
python code/evaluate.py
```

---

## 📊 Summary of Counts (Form & PDF Consistency)
- **Q10 (Number of final prompts):** `5` (`P1` to `P5` in Section 2(c))
- **Q17 (Number of test inputs):** `12` (in Milestone 2 Test Table) + 40 in comprehensive suite
- **Q18 (Number of prompt versions):** `3` (v1: Baseline, v2: Schema-Only, v3: 5-Prompt Pipeline)
- **Q19 (Prototype status):** `All modules working`
- **Q20 (Names of working modules):**
  - `Policy Knowledge Base Indexer`
  - `Relevance Retriever & Context Formatter`
  - `Grounded Answering & Citation Engine`
  - `Structured JSON Validator & Refusal Guard`
