# CHANGELOG: Campus Helpdesk Assistant

All notable changes from Milestone 1 conceptualization to Milestone 2 implementation and testing.

---

### [Milestone 1 Baseline] - 2026-11-05
#### Added
- Initial project definition for Campus Helpdesk Assistant under Problem Pool C1.
- Identification of target stakeholders: university students, faculty, administrative staff, and parents.
- Drafted initial ungrounded prompt (`P1_v1.txt`) testing direct conversational answering.
- Initial observation: 45% of out-of-domain queries produced confident hallucinations regarding university policies.

---

### [Iteration v2: Schema & Directives] - 2026-11-12
#### Changed
- Added JSON schema requirement (`answer`, `quoted_source_text`, `section_id`, `status`).
- Introduced basic keyword-based policy context extraction.
- Mandated official section citation for all answers.
#### Issues Observed
- JSON parser failed 3 out of 10 times due to markdown code backticks (````json ... ````) and introductory greetings.
- Out-of-scope queries occasionally hallucinated section IDs or used inconsistent status keys like `"unanswered"` and `"failed"`.

---

### [Iteration v3 & Prototype: Grounding & Refusal Engine] - 2026-11-18
#### Added
- Built structured knowledge base `student_handbook.json` covering 10 official sections across 5 major domains (Attendance, Grading, Examinations, Fees, Hostel).
- Upgraded prompt to `P1_CampusHelpdesk_v3.txt` incorporating:
  - 2 graded few-shot exemplars (1 answered, 1 strict refusal).
  - Explicit raw JSON directive without markdown fences.
  - Verbatim substring citation constraint.
  - Temperature set to 0.2 to maximize determinism.
- Built interactive Streamlit prototype (`code/app.py`) featuring live grounding preview, quote highlighting, section tags, and integrity audit badges.
- Created automated evaluation suite (`code/evaluate.py`) running a 40-question benchmark.
#### Results
- JSON validity improved to 100%.
- Citation accuracy reached 100% on valid answerable questions.
- Refusal accuracy achieved 71.4% on complex edge cases with zero false hallucinations.

---

### [Milestone 2 Final Submission Build] - 2026-11-20
#### Added
- Generated visual workflow, task decomposition, input-output flow, and RAG architecture diagrams in `docs/diagrams/`.
- Generated 12-case test table dataset including normal, edge, and invalid inputs.
- Drafted complete Supporting Technical Report (2 pages).
- Implemented automated PDF generation scripts for `M2_TeamID_CampusHelpdeskAssistant.pdf` and `TeamName_TechnicalReport.pdf`.
- Created minute-by-minute 118-second video demo script (`REEL_SCRIPT.md`).
