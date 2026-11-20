"""
Generates screenshot_repo.png showing the project directory structure for Section 5 of the PDF.
"""

import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

OUTPUT_DIR = os.path.dirname(__file__)

def render_repo_screenshot():
    fig, ax = plt.subplots(figsize=(8.5, 5.0), dpi=250)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 7)
    ax.axis("off")

    # IDE / Terminal Window Box
    window = patches.FancyBboxPatch((0.2, 0.2), 9.6, 6.6, boxstyle="round,pad=0.1", facecolor="#0F172A", edgecolor="#334155", lw=2)
    ax.add_patch(window)

    # Window Header
    hdr = patches.FancyBboxPatch((0.2, 6.2), 9.6, 0.6, boxstyle="round,pad=0.05", facecolor="#1E293B", edgecolor="#334155")
    ax.add_patch(hdr)
    # Circle buttons
    for i, c in enumerate(["#EF4444", "#F59E0B", "#10B981"]):
        circle = plt.Circle((0.5 + i*0.25, 6.5), 0.08, color=c)
        ax.add_patch(circle)
    ax.text(5.0, 6.5, "Explorer: campus-helpdesk-assistant [Git: main]", color="#94A3B8", fontsize=8, ha="center", va="center", fontfamily="monospace")

    repo_text = """
project/
|-- README.md                 # Project guide, execution steps, team info, links
|-- CHANGELOG.md              # Milestone 1 to Milestone 2 change history
|-- prompts/
|   |-- v1/                   # Baseline prompt (P1_v1.txt)
|   |-- v2/                   # Schema-focused prompt (P1_v2.txt)
|   |-- v3/                   # Refusal & Few-shot prompt (P1_v3.txt)
|   `-- final/                # Production prompt (P1_CampusHelpdesk_v3.txt)
|-- code/
|   |-- app.py                # Streamlit Interactive Prototype
|   |-- engine.py             # Grounding, Substring Verifier & LLM Handler
|   |-- evaluate.py           # Evaluation Suite & Accuracy Benchmark
|   `-- requirements.txt      # Dependencies
|-- test-data/
|   |-- test_inputs.json      # 12 Normal, Edge & Invalid test table cases
|   |-- comprehensive_40.json # 40 benchmark questions dataset
|   `-- evaluation_summary.json
|-- data/
|   `-- student_handbook.json # Labelled policy sections across 5 domains
`-- docs/
    |-- diagrams/             # Workflow, RAG, and Task Decomposition diagrams
    |-- Milestone2_Report.pdf # Official 7-section submission PDF
    `-- TechnicalReport.pdf   # 2-page Supporting Technical Report
    """

    ax.text(0.6, 3.4, repo_text, color="#E2E8F0", fontsize=7.2, fontfamily="monospace", va="center")

    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, "screenshot_repo.png"), bbox_inches="tight")
    plt.close()
    print("Repository screenshot created cleanly.")

if __name__ == "__main__":
    render_repo_screenshot()
