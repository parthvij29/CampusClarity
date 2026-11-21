# Microsoft Form (Milestone 2) Submission Guide
**Submission URL:** https://forms.cloud.microsoft/r/GUPcGsWdRr  
**Deadline:** Sunday, 22 November 2026, 11:59 PM  
**Important Rule:** Evaluators cross-check every number and detail entered in the form against the PDF. All values below match the generated PDF (`M2_T16_CampusHelpdeskAssistant.pdf`) exactly.

---

### Question-by-Question Form Responses (Ready to Copy-Paste)

| Question No. | Field Name | Exact Response to Enter | Notes / Instructions |
| :--- | :--- | :--- | :--- |
| **Q1** | Team ID | `T16` *(or the exact Team ID given to your team after Milestone 1)* | Use the team ID allotted after M1. |
| **Q2** | Team name | `PolicyGuard` *(or your team name from Milestone 1)* | Exactly as used in Milestone 1 and PDF cover page. |
| **Q3** | Project title | `Campus Helpdesk Assistant` | Same title as on PDF cover page. |
| **Q4** | Team leader name | `Parth Vij` | Team leader's full name. |
| **Q5** | Team leader enrollment no. | `S24CSEU1616` | Format: `S24CSEU1616`. |
| **Q6** | Group (batch) | `B16` *(or your WhatsApp batch group e.g., B13-24)* | Your assigned batch group. |
| **Q7** | Enrollment numbers of all members | `S24CSEU1616`<br/>`S24CSEU0217`<br/>`S24CSEU0211`<br/>`S24CSEU1615`<br/>`S24CSEU0055`<br/>`S24CSEU0212` | One per line, leader included. Format `S24CSEU1234`. |
| **Q8** | Project type | Select: **`App with code`** and **`Prompt-only workflow`** | Tick these 2 checkboxes (at most 2 options). Do not select Other. |
| **Q9** | Main AI tool and model | `Gemini Flash in Google Antigravity` | Tool and model used. |
| **Q10** | Number of prompts (1–50) | `5` | **5 distinct prompts in 5-stage pipeline** (P1_Intent_Classifier, P2_Context_Extractor, P3_Grounded_Answerer, P4_Citation_Extractor, P5_Safety_Refusal_Guard). Exactly 5 prompt sheets in Section 2(c)! |
| **Q11** | Prototype link | `https://campus-helpdesk-assistant.streamlit.app` | Open prototype link. Evaluator must NOT need to request access! |
| **Q12** | Repository or folder link | `https://github.com/parthvij29/CampusClarity` | Public GitHub repository link (checked and working). |
| **Q13** | Reel link | *[Paste your Drive or unlisted YouTube link]* | Google Drive or YouTube (Unlisted), set to "Anyone with the link can view". |
| **Q14** | Reel length | `118` | Exact duration in seconds (between 90 and 150). |
| **Q15** | Supporting document type | Select: **`Technical report`** | One of the 5 allowed types. |
| **Q16** | Upload supporting document | Upload `PolicyGuard_TechnicalReport.pdf` | Named `TeamName_DocumentType.pdf`, max 10 MB (our file is ~226 KB). |
| **Q17** | Number of test inputs | `12` | Matches Section 4 test table rows (minimum 10 required). |
| **Q18** | Number of prompt versions | `3` | Matches versions in iteration log (v1, v2, v3). |
| **Q19** | Prototype status | Select: **`All modules working`** | Only if every module in status table is Working. |
| **Q20** | Names of working modules | `Policy Knowledge Base Indexer`<br/>`Relevance Retriever & Context Formatter`<br/>`Grounded Answering & Citation Engine`<br/>`Structured JSON Validator & Refusal Guard` | One per line, exact same names as Section 3 status table. |
| **Q21** | Upload Milestone 2 PDF | Upload `M2_T16_CampusHelpdeskAssistant.pdf` | Named `M2_TeamID_ProjectTitle.pdf`, max 10 MB (our file is ~1.38 MB). |
| **Q22** | Main task of each member | `S24CSEU1616 - Parth Vij - Lead, 5-prompt pipeline architecture (P1-P5) and iteration design`<br/>`S24CSEU0217 - Maitreyi Chaudhary - Student handbook policy curation and Section ID schema design`<br/>`S24CSEU0211 - Madhav Puri - Grounding retrieval engine and P1/P2 intent routing logic`<br/>`S24CSEU1615 - Prashant Mangal - Interactive Streamlit web prototype and P3 synthesis UI`<br/>`S24CSEU0055 - Kushagra Garg - P4 verbatim substring auditor and P5 JSON guard engine`<br/>`S24CSEU0212 - Madhav Goyal - Test dataset creation (12 table cases, 40 benchmark tests) and technical report` | One line per member: `S24CSEU1234 - Name - Task`. Matches Section 7. |
| **Q23** | Anything the evaluator should know | `The project implements a modular 5-stage prompt pipeline (P1 to P5) for grounded university policy answering. The interactive prototype is built with Streamlit and can be run locally via 'streamlit run code/app.py' or via the cloud deployment link. An automated 40-question benchmark suite is runnable via 'python code/evaluate.py' evaluating JSON schema compliance, citation accuracy, and graceful refusal. A deterministic offline simulation engine is included so the app executes reliably without requiring external API keys.` | Optional. How to run / evaluator notes. |
| **Q24** | Confirmation | **Tick the checkbox [X]** | Confirms all members agreed to the contribution table. |
