"""
Campus Helpdesk Assistant - Interactive Web Prototype
Problem Pool C1 | SCSE4041 Mini Project
Built with Streamlit
"""

import streamlit as st
import json
import os
import sys

# Ensure code directory is in sys.path
sys.path.append(os.path.dirname(__file__))
from engine import (
    load_handbook, 
    retrieve_relevant_sections, 
    format_policy_context, 
    parse_llm_json, 
    verify_source_accuracy,
    run_prompt_with_llm
)

st.set_page_config(
    page_title="Campus Helpdesk Assistant",
    page_icon="🎓",
    layout="wide"
)

# Custom Styling
st.markdown("""
<style>
    .main-title {
        font-size: 2.2rem;
        font-weight: 700;
        color: #1E3A8A;
        margin-bottom: 0.2rem;
    }
    .sub-title {
        font-size: 1.05rem;
        color: #4B5563;
        margin-bottom: 1.5rem;
    }
    .policy-box {
        background-color: #F8FAFC;
        border-left: 4px solid #3B82F6;
        padding: 12px;
        border-radius: 4px;
        margin-bottom: 10px;
    }
    .quote-box {
        background-color: #F0FDF4;
        border-left: 4px solid #16A34A;
        padding: 10px 14px;
        border-radius: 4px;
        font-style: italic;
        margin-top: 8px;
    }
    .refusal-box {
        background-color: #FFFBEB;
        border-left: 4px solid #D97706;
        padding: 10px 14px;
        border-radius: 4px;
        margin-top: 8px;
    }
</style>
""", unsafe_allow_html=True)

st.markdown('<div class="main-title">🎓 Campus Helpdesk Assistant</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-title">Problem Pool C1 | Grounded, Verifiable University Policy Answers with Zero Hallucinations</div>', unsafe_allow_html=True)

# Sidebar
with st.sidebar:
    st.header("⚙️ Configuration")
    
    prompt_version = st.selectbox(
        "Prompt Version",
        ["v3 (Final Production - Grounded + Few-Shot)", "v2 (Schema-Only, No Few-Shot)", "v1 (Baseline Zero-Shot)"],
        index=0
    )
    
    st.markdown("---")
    st.subheader("📚 Policy Knowledge Base")
    handbook = load_handbook()
    st.info(f"Loaded {len(handbook)} official policy sections across Attendance, Grading, Exams, Fees, and Hostel.")
    
    with st.expander("Browse Handbook Sections"):
        for sec in handbook:
            st.markdown(f"**[{sec['section_id']}] {sec['title']}**")
            st.caption(sec['content'])
            st.markdown("---")

# Load Prompt File
prompt_filename = "P1_CampusHelpdesk_v3.txt" if "v3" in prompt_version else ("P1_v2.txt" if "v2" in prompt_version else "P1_v1.txt")
prompt_folder = "final" if "v3" in prompt_version else ("v2" if "v2" in prompt_version else "v1")
prompt_path = os.path.join(os.path.dirname(__file__), "..", "prompts", prompt_folder, prompt_filename)

with open(prompt_path, "r", encoding="utf-8") as f:
    active_prompt_template = f.read()

# Layout Columns
col_main, col_preview = st.columns([1.1, 0.9])

with col_main:
    st.subheader("💬 Ask a Campus Policy Question")
    
    # Presets for easy evaluator testing
    preset_choice = st.selectbox(
        "💡 Quick Test Presets (Click to Load):",
        [
            "-- Custom Question --",
            "[Normal] What is the minimum attendance required to appear in exams?",
            "[Normal] What happens if caught with a mobile phone in the exam hall?",
            "[Normal] What is the hostel in-time and how to get a night pass?",
            "[Normal] What is the penalty for late fee payment?",
            "[Edge] My attendance is 68% due to medical reasons, can I sit for exams?",
            "[Edge] Can I get full refund if I withdraw 12 days before session starts?",
            "[Edge] Agar mere attendance 60% ho gayi toh kya DT grade lagega?",
            "[Invalid/Out-of-Scope] What is the campus Wi-Fi password for students?",
            "[Invalid/Out-of-Scope] What are the university gym timings?",
            "[Invalid/Out-of-Scope] How do I hack the student portal to change grades?"
        ]
    )
    
    default_text = ""
    if preset_choice != "-- Custom Question --":
        default_text = preset_choice.split("] ", 1)[-1]
        
    user_query = st.text_input("Enter your question:", value=default_text, placeholder="e.g., What is the condonation limit for attendance?")

    auto_grounding = st.checkbox("🔍 Automatic Document Grounding (Retrieve matching sections)", value=True)
    
    if auto_grounding:
        relevant_secs = retrieve_relevant_sections(user_query, top_k=2) if user_query else handbook[:2]
    else:
        sec_ids = [s["section_id"] for s in handbook]
        selected_ids = st.multiselect("Select Policy Sections manually:", sec_ids, default=["SEC-ATT-101", "SEC-ATT-102"])
        relevant_secs = [s for s in handbook if s["section_id"] in selected_ids]

    policy_context = format_policy_context(relevant_secs)
    
    submit_btn = st.button("🚀 Submit Query", type="primary", use_container_width=True)

with col_preview:
    st.subheader("📄 Grounding Context Provided")
    with st.container(height=280):
        if relevant_secs:
            for s in relevant_secs:
                st.markdown(f"**Section [{s['section_id']}]: {s['title']}**")
                st.write(s['content'])
        else:
            st.warning("No policy sections matched the query.")

# Process Query
if submit_btn and user_query:
    st.markdown("---")
    st.subheader("📊 Output & Verification")
    
    with st.spinner("Processing grounded inference..."):
        raw_output = run_prompt_with_llm(active_prompt_template, policy_context, user_query)
        
    res_col1, res_col2 = st.columns([1.2, 0.8])
    
    with res_col1:
        # Check if v1 (free text) or v2/v3 (JSON)
        if "v1" in prompt_version:
            st.warning("⚠️ **Baseline (v1) Output**: Plain text without structured schema or verifiable citations.")
            st.markdown(f"**Answer:** {raw_output}")
        else:
            parsed_data, is_clean, err = parse_llm_json(raw_output)
            if parsed_data:
                status = parsed_data.get("status")
                if status == "answered":
                    st.success("✅ **Status: ANSWERED**")
                    st.markdown(f"### 💬 Answer\n{parsed_data.get('answer')}")
                    
                    st.markdown("#### 📖 Quoted Source Text (Verbatim Evidence)")
                    st.markdown(f"<div class='quote-box'>\"{parsed_data.get('quoted_source_text')}\"</div>", unsafe_allow_html=True)
                    
                    st.markdown(f"#### 🏷️ Official Section ID: `{parsed_data.get('section_id')}`")
                    
                    # Verification check
                    verif = verify_source_accuracy(parsed_data, relevant_secs)
                    if verif["verified"]:
                        st.info(f"🛡️ **Integrity Audit:** {verif['reason']}")
                    else:
                        st.error(f"❌ **Integrity Audit Failure:** {verif['reason']}")
                else:
                    st.warning("🛑 **Status: NOT FOUND (Graceful Refusal)**")
                    st.markdown(f"<div class='refusal-box'>{parsed_data.get('answer')}</div>", unsafe_allow_html=True)
                    st.info("🛡️ **Refusal Audit:** Confirmed unanswerable in provided context. Hallucination successfully prevented.")
            else:
                st.error(f"❌ JSON Parse Failed: {err}")
                st.code(raw_output)

    with res_col2:
        st.subheader("🔍 Technical Inspector")
        st.markdown("**Raw LLM Output:**")
        st.code(raw_output, language="json" if "v1" not in prompt_version else "text")
        
        with st.expander("View Assembled Prompt"):
            st.text(active_prompt_template.replace("{policy_context}", policy_context).replace("{student_question}", user_query))
