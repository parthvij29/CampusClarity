# Campus Clarity Technical Report

PromptForge · Team ID PE-B25-34 · SCSE4041 Prompt Engineering · Milestone 2 · Problem Pool C1

## 1. Architecture

CampusClarity helps students find sample rules for attendance, grading, exams, fees and hostels. The React portal includes Dashboard, Ask, Handbook and Student tools. Ten simulated policy sections are bundled in student_handbook.json. Each section has a unique ID, a topic and policy text.

The browser normalizes the question and checks it against ordered rules and refund conditions. For a match, the engine selects a clause or full section and confirms the quotation appears in the source. It returns answer, quoted_source_text, section_id and status. Some clauses also have a plain-language rewrite. When the engine finds no supported match, it returns "not found" with null source fields and directs the student to the Academic Office.

Students can open the cited section, search or filter the handbook, save policies and revisit recent questions. The attendance calculator uses the sample handbook's standard 75% threshold and estimates how many consecutive classes a student needs to attend. Bookmarks, recent questions and planner tasks are stored in the current browser.

## 2. Tools and Models

The web prototype is hosted on Vercel and built with React, JavaScript, Vite and Node.js tooling. Policy answering runs in the browser without an API key or a model call. The separate Python prompt experiment can call Gemini with GEMINI_API_KEY configured and otherwise uses a simulation fallback.

## 3. Prompt Design

The repository preserves three iterations: v1 baseline, v2 with a structured schema, and v3 with grounding examples, exact quotations and an explicit fallback. The five final prompt artifacts define intent classification, context extraction, grounded answering, citation extraction and refusal handling. The web prototype implements policy answering with deterministic JavaScript rules.

## 4. Test Results

The Vite production build passed. The current JavaScript engine was run against the repository's 40-question benchmark. All 40 cases matched the expected status and, where applicable, the expected section ID. All 33 answered cases contained a verbatim quote from the cited section. All 7 expected refusals returned "not found." These checks measure the bundled dataset's expected outcomes and quote integrity.

## 5. Limitations

The handbook contains simulated policies. Rule-based matching has limited coverage for unfamiliar wording, Hinglish, multi-part questions and cases that require combining multiple policy sections. Calculator results use the standard threshold and assume the student attends each upcoming class in the estimate. Saved items are specific to the current browser.

## 6. Team Contributions

| Enrollment number | Name | Main task |
| --- | --- | --- |
| S24CSEU1616 | Parth Vij | Led the team and designed the five-prompt pipeline (P1–P5) and prompt iterations. |
| S24CSEU0217 | Maitreyi Chaudhary | Curated the sample student handbook and designed the policy section IDs. |
| S24CSEU0211 | Madhav Puri | Developed grounded policy retrieval and P1/P2 intent routing. |
| S24CSEU1615 | Prashant Mangal | Built the React student portal and deployed the web prototype on Vercel. |
| S24CSEU0055 | Kushagra Garg | Developed the P4 verbatim citation checks and P5 JSON validation and refusal logic. |
| S24CSEU0212 | Madhav Goyal | Created the 12 report test cases and 40 benchmark cases and prepared the technical report. |

Live prototype | https://campus-clarity-xo49.vercel.app/

Repository | https://github.com/parthvij29/CampusClarity
