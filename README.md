# Campus Helpdesk Assistant (Problem Pool C1)

**SCSE4041 Mini Project — Milestone 2**  
*Grounded, Verifiable University Policy Answering Workflow with Zero Hallucinations*

---

## 📌 Project Overview
University rules on attendance, grading, exams, fees, and hostels are distributed across lengthy handbooks, circulars, and notices that undergo revisions each academic year. Students often skip reading these documents and turn to seniors, WhatsApp groups, or generic AI chatbots, leading to outdated advice, severe hallucinated rules, and overwhelming administrative burdens.

The **Campus Helpdesk Assistant** is a prompt engineering workflow grounded strictly in official university policy text. For every student inquiry, the system:
1. Identifies and retrieves relevant official policy sections.
2. Formulates an answer in plain, accessible language.
3. Quotes the exact verbatim sentence from the official text alongside the unique `section_id`.
4. Gracefully refuses queries outside the policy scope by returning `status: "not found"`, null quotes, and routing the student directly to the Academic Office.

---

## 👥 Team Information (6 Members)
- **Team ID:** `T16` *(Milestone 1 Assigned Team ID)*
- **Team Name:** `PolicyGuard`
- **Project Title:** `Campus Helpdesk Assistant`
- **Course & Batch:** SCSE4041 - Prompt Engineering | B.Tech CSE

| Enrollment Number | Member Name | Role | Primary Task (Milestone 2) | Contribution (%) |
| :--- | :--- | :--- | :--- | :--- |
| `S24CSEU1616` | **Parth Vij** (Lead) | Lead & Prompt Architecture | Designed v1–v3 prompts, few-shot refusal guards, hyperparameter tuning | **20%** |
| `S24CSEU0217` | **Maitreyi Chaudhary** | Knowledge Base Engineering | Curated student handbook (10 sections across 5 domains), Section ID schema | **16%** |
| `S24CSEU0211` | **Madhav Puri** | Retrieval & Grounding | Built lexical grounding retriever and dynamic context formatter | **16%** |
| `S24CSEU1615` | **Prashant Mangal** | Prototype & UI Engineering | Built interactive Streamlit application and live context preview | **16%** |
| `S24CSEU0055` | **Kushagra Garg** | Integrity & Schema Auditor | Developed raw JSON validator and verbatim substring containment verifier | **16%** |
| `S24CSEU0212` | **Madhav Goyal** | Benchmarking & Technical Report | Formulated 12-case test table & 40-test suite; authored Technical Report | **16%** |

**Total Contribution:** 100% (All members unanimously agreed to this allocation).

---

## 🔗 Important Links
- **Prototype Link:** [Streamlit App Live Demo / Local Run Instructions](#how-to-run-locally)
- **GitHub Repository:** Public GitHub Repository URL *(Replace with your repository URL)*
- **Reel Link (90–150s):** Drive / Unlisted YouTube Video Link *(Exact length in seconds: 118s)*

---

## 📂 Project Directory Structure

```text
project/
├── README.md                      # Project description, instructions, team data, links
├── CHANGELOG.md                   # Chronological development log since Milestone 1
├── prompts/
│   ├── v1/
│   │   └── P1_v1.txt              # Baseline zero-shot prompt
│   ├── v2/
│   │   └── P1_v2.txt              # Schema-constrained prompt
│   ├── v3/
│   │   └── P1_v3.txt              # Few-shot, grounded refusal prompt
│   └── final/
│       └── P1_CampusHelpdesk_v3.txt # Production final prompt template
├── code/
│   ├── app.py                     # Streamlit web prototype
│   ├── engine.py                  # Grounding context retriever, LLM engine & quote verifier
│   ├── evaluate.py                # Automated 40-question evaluation benchmark suite
│   ├── generate_test_data.py      # Test table & benchmark dataset generator
│   └── requirements.txt           # Python dependencies
├── test-data/
│   ├── test_inputs.json           # 12 test table cases (Normal, Edge, Invalid)
│   ├── comprehensive_40_tests.json# 40-question benchmark dataset
│   └── evaluation_summary.json    # Empirical benchmark metrics
├── data/
│   └── student_handbook.json      # Knowledge base with 10 labelled sections (5 domains)
└── docs/
    ├── diagrams/                  # Workflow, Task Decomposition, Input-Output & RAG diagrams
    ├── generate_m2_pdf.py         # Automated ReportLab generator for Milestone 2 PDF
    ├── generate_tech_report_pdf.py# Automated ReportLab generator for Supporting Tech Report
    ├── Milestone2_Report.md       # Full 7-section submission documentation
    ├── Technical_Report.md        # 2-page Supporting Technical Report
    └── REEL_SCRIPT.md             # Timed 118-second video demonstration script
```

---

## 🚀 How to Run Locally

### 1. Prerequisites
Ensure Python 3.10+ is installed on your system.

### 2. Install Dependencies
```bash
pip install -r code/requirements.txt
```

### 3. Launch Interactive Web Prototype
```bash
streamlit run code/app.py
```
Open your browser at `http://localhost:8501`.

### 4. Run Automated Evaluation Suite
```bash
python code/evaluate.py
```

---

## 📊 Summary of Counts (Form & PDF Consistency)
- **Q10 (Number of final prompts):** `1` (`P1_CampusHelpdesk_v3.txt`)
- **Q17 (Number of test inputs):** `12` (in Milestone 2 Test Table) + 40 in comprehensive suite
- **Q18 (Number of prompt versions):** `3` (v1: Baseline, v2: Schema-Only, v3: Few-shot Grounded)
- **Q19 (Prototype status):** `All modules working`
- **Q20 (Names of working modules):**
  - `Policy Knowledge Base Indexer`
  - `Relevance Retriever & Context Formatter`
  - `Grounded Answering & Citation Engine`
  - `Structured JSON Validator & Refusal Guard`
