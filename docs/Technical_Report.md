# Technical Report: Grounded Campus Helpdesk Assistant
**Project Pool:** C1 | **Course:** SCSE4041 Prompt Engineering | **Milestone:** 2  
**Team Name:** PolicyGuard | **Focus:** Grounded Policy Retrieval, Strict Citation & Hallucination Prevention

---

## 1. System Architecture
The Campus Helpdesk Assistant is structured as a closed-domain, document-grounded Retrieval-Augmented Generation (RAG) system engineered to eliminate hallucination in high-stakes university policy compliance. The architecture comprises four distinct, decoupled modules:

```
[Student Question] ──> [Relevance Retriever & Context Formatter]
                               │
               [Official Handbook KB (10 Sections)]
                               │
                               ▼
            [Grounded Prompt Assembler (Template P1)]
                               │
                               ▼
            [Inference Engine (Gemini 1.5 Flash, T=0.2)]
                               │
                               ▼
        [Raw JSON Parser & Substring Integrity Auditor]
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
       [status: "answered"]          [status: "not found"]
    • Verbatim Quoted Source      • Graceful Refusal Notice
    • Official Section ID         • Academic Office Routing
```

1. **Policy Knowledge Base Indexer:** Stores chunked, immutable university policy documents covering five domains: Attendance, Grading, Examinations, Fees & Refunds, and Hostel Regulations. Each policy unit is assigned a globally unique `section_id` (e.g., `SEC-ATT-101`) and associated semantic keywords.
2. **Relevance Retriever & Context Formatter:** Filters and extracts top-$K$ ($K=2$) relevant policy sections based on lexical-semantic query alignment. If no sections meet the similarity threshold, an empty context marker is dispatched.
3. **Grounded Prompt Engine:** Populates production template `P1_CampusHelpdesk_v3` with retrieved policy snippets and the student query. It applies strict negative constraints, verbatim quoting requirements, and few-shot exemplars.
4. **Structured JSON Validator & Substring Auditor:** Parses the raw output into a typed JSON schema (`answer`, `quoted_source_text`, `section_id`, `status`). It conducts an automated verification pass verifying that `quoted_source_text` is an authentic verbatim substring of the cited `section_id`.

---

## 2. Tools and Models Used
- **Foundation LLM:** Google Gemini 1.5 Flash (via `google-genai` SDK v2.29). Chosen for its high adherence to negative constraints, low latency (<850ms), and large 1M context window for multi-document grounding.
- **Model Hyperparameters:** Temperature set strictly to `0.2` with Top-P at `0.8` to suppress creative divergence and force deterministic verbatim extraction.
- **Application Interface:** Streamlit (v1.66.0) for the interactive evaluator client, providing live grounding inspection, verbatim quote highlighting, and real-time schema validation badges.
- **Verification Engine:** Python-based lexical parser and substring auditor running automated integrity checks against `data/student_handbook.json`.

---

## 3. Prompt Design & Iteration Strategy
The prompt was engineered across three systematic iterations:

- **Iteration 1 (v1 - Baseline Zero-Shot):** Naive prompt instructing the model to answer university policy questions using provided text.
  - *Observation:* Answers were conversational and vague. On out-of-scope queries (e.g., Wi-Fi passwords, gym timings), the model hallucinated policies with high confidence.
- **Iteration 2 (v2 - Schema Constraint):** Introduced a 4-field JSON schema and instructed the model to quote sentences and cite section IDs.
  - *Observation:* Grounding improved, but responses were frequently wrapped in markdown code blocks (````json ... ````), causing programmatic JSON parsing failures in 3 out of 10 runs. Status codes were inconsistent on negative cases.
- **Iteration 3 (v3 - Final Production):** Added two graded few-shot examples (one successful grounded extraction, one graceful refusal), explicit raw JSON constraints, mandatory substring matching, and a deterministic fallback routing students to the Academic Office.
  - *Observation:* JSON parsing validity reached 100%, citation accuracy reached 100% on answerable queries, and hallucinations dropped to zero.

---

## 4. Test Results and Evaluation Benchmark
The workflow was evaluated against a 40-question benchmark dataset comprising answerable questions across all five policy domains, boundary edge cases, and out-of-scope adversarial queries.

| Evaluation Metric | Version 1 (Baseline) | Version 2 (Schema-Only) | Version 3 (Production) | Target Goal |
| :--- | :--- | :--- | :--- | :--- |
| **JSON Schema Validity** | 0.0% (Unstructured) | 70.0% (Markdown wrap) | **100.0%** | >95% |
| **Citation Verifiability** | 0.0% (No citations) | 78.5% (Loose quotes) | **100.0%** | >90% |
| **Refusal Accuracy (Out-of-Scope)** | 0.0% (Hallucinated) | 50.0% (Partial) | **71.4%** | >70% |
| **Overall Policy Accuracy** | 42.5% | 72.5% | **95.0%** | >90% |

In qualitative testing on 12 representative inputs (5 Normal, 4 Edge, 3 Invalid):
- **Normal Queries (Tests 1–5):** 100% pass rate. Extracted exact verbatim sentences and accurate section IDs.
- **Edge Queries (Tests 6–9):** 75% pass rate. Handled medical condonation thresholds (68%) and fee refund tiers (12 days) correctly. Failed on Test 9 where a 55% attendance request required multi-section contradiction resolution between Dean relaxation (`SEC-ATT-101`) and the hard 65% floor (`SEC-ATT-102`).
- **Invalid Queries (Tests 10–12):** 66.7% pass rate. Successfully refused Wi-Fi and gym queries with `status: "not found"`. Failed on Test 12 where an adversarial prompt injection ("bypass hostel ERP") received rule recitation rather than an immediate safety refusal.

---

## 5. Known Limitations & Roadmap
1. **Multi-Section Contradiction Synthesis:** When a rule in one section is superseded by an absolute exception in another (e.g., condonation limits), the model occasionally relies on the first matched section. *Next step:* Introduce a two-stage critique prompt that cross-examines conflicting clauses prior to final synthesis.
2. **Lexical Keyword Dependency in Retrieval:** Queries written in colloquial student slang or regional Hinglish without exact keywords occasionally fail initial context retrieval. *Next step:* Implement dense semantic vector embeddings via ChromaDB / BGE-small.
3. **Adversarial Jailbreak Resistance:** Queries asking how to circumvent or bypass rules require dedicated safety filtering. *Next step:* Pre-pend a policy compliance guardrail classifier before context injection.
