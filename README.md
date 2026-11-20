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

## 👥 Team Information
- **Team ID:** `T23` *(Placeholder: Replace with your allotted Milestone 1 Team ID)*
- **Team Name:** `PolicyGuard` *(Placeholder: Replace with your team name)*
- **Project Title:** `Campus Helpdesk Assistant`
- **Batch / Group:** `B13-24` *(Placeholder: Replace with your WhatsApp batch)*
- **Course:** SCSE4041 - Prompt Engineering

| Enrollment Number | Member Name | Role | Primary Task (Milestone 2) | Contribution (%) |
| :--- | :--- | :--- | :--- | :--- |
| `S24CSEU1001` | Member 1 (Lead) | Lead & Prompt Architecture | Designed v1-v3 prompts, few-shot refusal guards | 25% |
| `S24CSEU1002` | Member 2 | Grounding & KB Engineering | Formatted student handbook, keyword indexing | 25% |
| `S24CSEU1003` | Member 3 | Prototype Development | Built interactive Streamlit app, verification logic | 25% |
| `S24CSEU1004` | Member 4 | Evaluation & Documentation | Ran 40-test benchmark, generated M2 & Tech PDFs | 25% |

*(Note: Replace enrollment numbers, names, and exact role allocations in Section 7 before final submission).*

---

## 🔗 Important Links
- **Prototype Link:** [Streamlit App Live Demo / Local Run Instructions](#how-to-run-locally) *(Deployable to Streamlit Community Cloud / HuggingFace Spaces with 1 click)*
- **GitHub Repository:** Public GitHub Repository URL *(Replace with your repository URL)*
- **Reel Link (90–150s):** Drive / Unlisted YouTube Video Link *(Exact length in seconds: 118s)*

---

## 📂 Project Directory Structure

```text
d:\bennett\prompt\project\
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

### 3. (Optional) Configure Gemini API Key
To run with live Gemini 1.5 Flash:
```bash
# Windows PowerShell:
$env:GEMINI_API_KEY="your-google-ai-studio-api-key"

# Linux / Mac:
export GEMINI_API_KEY="your-google-ai-studio-api-key"
```
*Note: If no API key is provided, the system seamlessly uses the built-in deterministic simulation engine that mirrors prompt behavior across v1, v2, and v3.*

### 4. Launch Interactive Web Prototype
```bash
streamlit run code/app.py
```
Open your browser at `http://localhost:8501`.

### 5. Run Automated Evaluation Suite
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
