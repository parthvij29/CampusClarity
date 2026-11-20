# Milestone 2 Demonstration Video (Reel) Script
**Total Target Duration:** 118 seconds (Allowed range: 90 to 150 seconds)  
**Project:** Campus Helpdesk Assistant (Problem Pool C1)  
**Platform Format:** Screen recording + voice-over narration (Horizontal 16:9 or Vertical 9:16)  
**Access Setting:** Google Drive or YouTube (Unlisted), "Anyone with the link can view"

---

## Part 1: Problem & Stakeholders (~12 seconds | 0:00 – 0:12)
- **Screen Action:** Display the title slide of the project and show a collage of dense PDF university circulars with red warning callouts.
- **Voiceover:**
  > "University rules on attendance, exams, fees, and hostels are scattered across dozens of confusing circulars that change every year. Students either get outdated advice from WhatsApp groups or fall victim to hallucinated answers from general chatbots. Our solution is the Campus Helpdesk Assistant—a strictly grounded AI workflow that delivers 100% verified policy answers with exact sentence citations and zero hallucinations."

---

## Part 2: Prompt Experiment: Before & After (~38 seconds | 0:12 – 0:50)
- **Screen Action:** Open IDE / text editor or split-screen showing `prompts/v1/P1_v1.txt` vs. `prompts/final/P1_CampusHelpdesk_v3.txt`.
- **Voiceover:**
  > "Here is our prompt iteration experiment. In version 1, our baseline zero-shot prompt simply told the model to answer university policy questions. When we asked an unanswerable question like 'What is the student Wi-Fi password?', the model hallucinated a fake password and invented nonexistent rules. Furthermore, the answers were unstructured conversational text with zero citations.
  > 
  > In Version 3, our final production prompt, we engineered three key mechanisms:
  > First, strict document grounding requiring answers to stem ONLY from the injected text.
  > Second, mandatory verbatim substring quoting with section IDs.
  > And third, few-shot refusal exemplars with a temperature of 0.2.
  > This eliminated all hallucinations, improved JSON validity to 100%, and achieved automated refusal whenever a policy clause was absent."

---

## Part 3: Live Working Prototype Demo (~50 seconds | 0:50 – 1:40)
- **Screen Action:** Switch to browser showing live Streamlit app (`streamlit run code/app.py`).
  1. *[0:50 - 1:05]* Select Normal preset: "What is the minimum attendance required to appear in exams?" Click Submit.
  2. *[1:05 - 1:20]* Highlight output card: Green badge `STATUS: ANSWERED`, plain English answer, highlighted green quote block, and `[SEC-ATT-101]` badge with passing substring audit.
  3. *[1:20 - 1:40]* Test Out-of-Scope query: Select "What is the campus Wi-Fi password for students?" Click Submit. Show amber badge `STATUS: NOT FOUND`, null quotes, and automatic routing to the Academic Office.
- **Voiceover:**
  > "Now let's see the live prototype in action. Here on our Streamlit web application, we select a standard student query: 'What is the minimum attendance required to appear in exams?'
  > When we submit, the retrieval module dynamically pulls Section SEC-ATT-101. The assistant responds with a clear explanation, extracts the exact sentence verbatim from the official handbook, and confirms verification through our substring audit engine.
  > 
  > Next, let's test an out-of-scope query: 'What is the campus Wi-Fi password?'
  > Notice that instead of guessing or hallucinating, the assistant immediately flags status as 'not found', returns null for quotes and section ID, and directs the student to the official Academic Office. Every single answer is fully structured, transparent, and auditable."

---

## Part 4: Progress & Milestone 3 Roadmap (~18 seconds | 1:40 – 1:58)
- **Screen Action:** Switch to slides or README showing the working modules table and next milestone objectives.
- **Voiceover:**
  > "For Milestone 2, all four core modules are fully operational: the policy indexer, context retriever, prompt engine, and JSON validator.
  > For Milestone 3, we will integrate vector semantic search using ChromaDB, implement multi-turn conversational memory, and deploy the assistant across WhatsApp and Web channels for campus-wide testing. Thank you!"

---

## ⏱️ Video Timing Summary Table

| Part | Section | Planned Time | Actual Time |
| :--- | :--- | :--- | :--- |
| **Part 1** | Problem Statement & Users | ~10 s | 12 s |
| **Part 2** | Prompt Experiment (Before vs. After) | ~30–40 s | 38 s |
| **Part 3** | Live Working Prototype Run | ~40–60 s | 50 s |
| **Part 4** | Current Progress & Milestone 3 Plan | ~15–20 s | 18 s |
| **Total** | **Full Video Length** | **90–150 s** | **118 seconds (1m 58s)** |

*Important: When recording the video, verify that your final recording length is between 90 and 150 seconds. In Question 14 of the Microsoft Form, enter the exact duration in seconds (e.g. `118`).*
