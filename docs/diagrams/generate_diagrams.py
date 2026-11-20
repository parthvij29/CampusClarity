"""
Generates visual architecture and workflow diagrams for Milestone 2 PDF.
Outputs high-resolution PNGs into docs/diagrams/
"""

import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

OUTPUT_DIR = os.path.dirname(__file__)

def create_prompt_workflow_diagram():
    fig, ax = plt.subplots(figsize=(10, 4.5), dpi=300)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 5)
    ax.axis("off")

    ax.text(5, 4.6, "Prompt Engineering Workflow: Campus Helpdesk Assistant", 
            ha="center", va="center", fontsize=13, fontweight="bold", color="#1E3A8A")

    boxes = [
        {"x": 0.5, "y": 2.2, "w": 1.6, "h": 1.4, "title": "Student Query\nInput", "desc": "Question entered\nvia web UI", "color": "#DBEAFE", "border": "#2563EB"},
        {"x": 2.5, "y": 2.2, "w": 1.8, "h": 1.4, "title": "Grounding Filter\n& Retrieval", "desc": "Matches keywords to\nhandbook sections", "color": "#E0E7FF", "border": "#4F46E5"},
        {"x": 4.7, "y": 2.2, "w": 1.8, "h": 1.4, "title": "Prompt Assembler\n(Template P1)", "desc": "{policy_context} +\n{student_question}", "color": "#FEF3C7", "border": "#D97706"},
        {"x": 6.9, "y": 2.2, "w": 1.6, "h": 1.4, "title": "LLM Inference\n(Temp 0.2)", "desc": "Gemini / GPT / Claude\nFew-shot guided", "color": "#DCFCE7", "border": "#16A34A"},
        {"x": 8.9, "y": 2.2, "w": 1.0, "h": 1.4, "title": "JSON &\nVerification", "desc": "Status &\nQuote check", "color": "#FCE7F3", "border": "#DB2777"}
    ]

    for b in boxes:
        rect = patches.FancyBboxPatch(
            (b["x"], b["y"]), b["w"], b["h"],
            boxstyle="round,pad=0.1,rounding_size=0.15",
            facecolor=b["color"], edgecolor=b["border"], linewidth=1.5
        )
        ax.add_patch(rect)
        ax.text(b["x"] + b["w"]/2, b["y"] + b["h"]*0.65, b["title"], 
                ha="center", va="center", fontsize=8.5, fontweight="bold", color="#111827")
        ax.text(b["x"] + b["w"]/2, b["y"] + b["h"]*0.28, b["desc"], 
                ha="center", va="center", fontsize=7, color="#4B5563")

    arrow_props = dict(arrowstyle="->", lw=2, color="#4B5563")
    ax.annotate("", xy=(2.4, 2.9), xytext=(2.2, 2.9), arrowprops=arrow_props)
    ax.annotate("", xy=(4.6, 2.9), xytext=(4.4, 2.9), arrowprops=arrow_props)
    ax.annotate("", xy=(6.8, 2.9), xytext=(6.6, 2.9), arrowprops=arrow_props)
    ax.annotate("", xy=(8.8, 2.9), xytext=(8.6, 2.9), arrowprops=arrow_props)

    out_rect = patches.FancyBboxPatch(
        (3.5, 0.4), 3.0, 1.1,
        boxstyle="round,pad=0.1,rounding_size=0.15",
        facecolor="#F3F4F6", edgecolor="#6B7280", linewidth=1.5
    )
    ax.add_patch(out_rect)
    ax.text(5.0, 1.05, "Structured JSON Output", ha="center", va="center", fontsize=8.5, fontweight="bold", color="#111827")
    ax.text(5.0, 0.65, 'status: "answered" (quote + sec_id) OR\nstatus: "not found" (academic office fallback)', ha="center", va="center", fontsize=6.5, color="#374151")

    ax.annotate("", xy=(6.5, 1.5), xytext=(9.4, 2.2), arrowprops=dict(arrowstyle="->", lw=1.5, color="#DB2777", connectionstyle="arc3,rad=0.2"))

    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, "prompt_workflow.png"), bbox_inches="tight")
    plt.close()

def create_task_decomposition_diagram():
    fig, ax = plt.subplots(figsize=(10, 4.5), dpi=300)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 5)
    ax.axis("off")

    ax.text(5, 4.6, "Task Decomposition & Working Modules", 
            ha="center", va="center", fontsize=13, fontweight="bold", color="#1E3A8A")

    modules = [
        {"x": 0.5, "y": 1.2, "w": 2.0, "h": 2.6, "title": "Module 1:\nPolicy Indexer", "items": ["• Chunk handbook", "• Label Section IDs", "• Keyword mapping", "• Campus-agnostic schema"], "color": "#EFF6FF", "border": "#3B82F6"},
        {"x": 2.8, "y": 1.2, "w": 2.0, "h": 2.6, "title": "Module 2:\nContext Retriever", "items": ["• Query keyword scan", "• Top-K relevant select", "• Dynamic context feed", "• Document grounding"], "color": "#F0FDF4", "border": "#16A34A"},
        {"x": 5.1, "y": 1.2, "w": 2.0, "h": 2.6, "title": "Module 3:\nGrounded Prompt", "items": ["• Strict grounding rule", "• Verbatim quote rule", "• Few-shot exemplars", "• Refusal instructions"], "color": "#FEF3C7", "border": "#D97706"},
        {"x": 7.4, "y": 1.2, "w": 2.1, "h": 2.6, "title": "Module 4:\nAudit & Validator", "items": ["• Raw JSON parsing", "• Substring verifier", "• Fallback route guard", "• Streamlit UI renderer"], "color": "#FDF2F8", "border": "#DB2777"},
    ]

    for m in modules:
        rect = patches.FancyBboxPatch(
            (m["x"], m["y"]), m["w"], m["h"],
            boxstyle="round,pad=0.1,rounding_size=0.15",
            facecolor=m["color"], edgecolor=m["border"], linewidth=1.5
        )
        ax.add_patch(rect)
        ax.text(m["x"] + m["w"]/2, m["y"] + m["h"]*0.82, m["title"], 
                ha="center", va="center", fontsize=8.5, fontweight="bold", color="#111827")
        y_text = m["y"] + m["h"]*0.58
        for itm in m["items"]:
            ax.text(m["x"] + 0.15, y_text, itm, ha="left", va="center", fontsize=7.2, color="#374151")
            y_text -= 0.35

    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, "task_decomposition.png"), bbox_inches="tight")
    plt.close()

def create_input_output_flow_diagram():
    fig, ax = plt.subplots(figsize=(10, 4.2), dpi=300)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 5)
    ax.axis("off")

    ax.text(5, 4.6, "Input – Processing – Output Flow", 
            ha="center", va="center", fontsize=13, fontweight="bold", color="#1E3A8A")

    # Inputs
    in_box = patches.FancyBboxPatch((0.5, 1.2), 2.5, 2.7, boxstyle="round,pad=0.1", facecolor="#E0F2FE", edgecolor="#0284C7", lw=1.5)
    ax.add_patch(in_box)
    ax.text(1.75, 3.5, "INPUTS", ha="center", va="center", fontsize=10, fontweight="bold", color="#0369A1")
    ax.text(1.75, 2.5, "1. Student Question\n   (e.g., Attendance condonation,\n   Hostel gate timings)\n\n2. Grounded Policy Sections\n   (Official Handbook text with\n   Section IDs)", ha="center", va="center", fontsize=7.5, color="#0F172A")

    # Process
    proc_box = patches.FancyBboxPatch((3.7, 1.2), 2.6, 2.7, boxstyle="round,pad=0.1", facecolor="#FEF9C3", edgecolor="#CA8A04", lw=1.5)
    ax.add_patch(proc_box)
    ax.text(5.0, 3.5, "PROCESSING", ha="center", va="center", fontsize=10, fontweight="bold", color="#A16207")
    ax.text(5.0, 2.4, "• Grounded Prompt Template\n• LLM Zero-Hallucination Gate\n• Extract verbatim substring\n• If missing: Set not found\n• Verify quote in handbook", ha="center", va="center", fontsize=7.5, color="#0F172A")

    # Output
    out_box = patches.FancyBboxPatch((7.0, 1.2), 2.5, 2.7, boxstyle="round,pad=0.1", facecolor="#DCFCE7", edgecolor="#16A34A", lw=1.5)
    ax.add_patch(out_box)
    ax.text(8.25, 3.5, "STRUCTURED OUTPUT", ha="center", va="center", fontsize=10, fontweight="bold", color="#15803D")
    ax.text(8.25, 2.4, "Valid JSON Object:\n• answer: plain explanation\n• quoted_source_text: exact\n• section_id: e.g. SEC-ATT-101\n• status: 'answered' |\n          'not found'", ha="center", va="center", fontsize=7.5, color="#0F172A")

    # Arrows
    ax.annotate("", xy=(3.6, 2.5), xytext=(3.1, 2.5), arrowprops=dict(arrowstyle="->", lw=2, color="#0284C7"))
    ax.annotate("", xy=(6.9, 2.5), xytext=(6.4, 2.5), arrowprops=dict(arrowstyle="->", lw=2, color="#CA8A04"))

    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, "input_output_flow.png"), bbox_inches="tight")
    plt.close()

def create_rag_pipeline_diagram():
    fig, ax = plt.subplots(figsize=(10, 5), dpi=300)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 5.2)
    ax.axis("off")

    ax.text(5, 4.8, "System Architecture: Grounded RAG & Verification Pipeline", 
            ha="center", va="center", fontsize=13, fontweight="bold", color="#1E3A8A")

    kb_rect = patches.FancyBboxPatch((0.5, 2.0), 2.2, 2.2, boxstyle="round,pad=0.1", facecolor="#EFF6FF", edgecolor="#3B82F6", lw=1.5)
    ax.add_patch(kb_rect)
    ax.text(1.6, 3.8, "Official Student\nHandbook (KB)", ha="center", va="center", fontsize=9, fontweight="bold", color="#1D4ED8")
    ax.text(1.6, 2.8, "• Attendance\n• Grading\n• Examinations\n• Fees & Refunds\n• Hostel Norms", ha="center", va="center", fontsize=7.5, color="#374151")

    ret_rect = patches.FancyBboxPatch((3.4, 2.0), 2.8, 2.2, boxstyle="round,pad=0.1", facecolor="#FEF3C7", edgecolor="#D97706", lw=1.5)
    ax.add_patch(ret_rect)
    ax.text(4.8, 3.8, "Document Grounding &\nPrompt Engine", ha="center", va="center", fontsize=9, fontweight="bold", color="#B45309")
    ax.text(4.8, 2.8, "1. Substring & Keyword Index\n2. Top-K Section Injection\n3. Negative Prompt Grounding\n4. Few-Shot Schema Injector", ha="center", va="center", fontsize=7.5, color="#374151")

    llm_rect = patches.FancyBboxPatch((6.9, 2.0), 2.6, 2.2, boxstyle="round,pad=0.1", facecolor="#ECFDF5", edgecolor="#059669", lw=1.5)
    ax.add_patch(llm_rect)
    ax.text(8.2, 3.8, "Inference & Verification\nEngine", ha="center", va="center", fontsize=9, fontweight="bold", color="#047857")
    ax.text(8.2, 2.8, "• Gemini 1.5 Flash (T=0.2)\n• Strict Raw JSON Parser\n• Verbatim Substring Auditor\n• Refusal Routing Guard", ha="center", va="center", fontsize=7.5, color="#374151")

    ax.annotate("", xy=(3.3, 3.1), xytext=(2.8, 3.1), arrowprops=dict(arrowstyle="->", lw=2, color="#2563EB"))
    ax.annotate("", xy=(6.8, 3.1), xytext=(6.3, 3.1), arrowprops=dict(arrowstyle="->", lw=2, color="#D97706"))

    client_rect = patches.FancyBboxPatch((2.0, 0.4), 6.0, 1.1, boxstyle="round,pad=0.1", facecolor="#F8FAFC", edgecolor="#475569", lw=1.5)
    ax.add_patch(client_rect)
    ax.text(5.0, 1.05, "Interactive Client: Streamlit Web Prototype", ha="center", va="center", fontsize=9, fontweight="bold", color="#0F172A")
    ax.text(5.0, 0.65, "Interactive Presets (Normal, Edge, Invalid) | Verbatim Quote Box | Section Badges | Live JSON Inspector", ha="center", va="center", fontsize=7, color="#475569")

    ax.annotate("", xy=(4.8, 1.9), xytext=(3.5, 1.6), arrowprops=dict(arrowstyle="->", lw=1.5, color="#2563EB"))
    ax.annotate("", xy=(6.5, 1.6), xytext=(8.2, 1.9), arrowprops=dict(arrowstyle="->", lw=1.5, color="#059669"))

    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, "system_architecture_rag.png"), bbox_inches="tight")
    plt.close()

if __name__ == "__main__":
    create_prompt_workflow_diagram()
    create_task_decomposition_diagram()
    create_input_output_flow_diagram()
    create_rag_pipeline_diagram()
    print("All 4 diagrams successfully generated in docs/diagrams/")
