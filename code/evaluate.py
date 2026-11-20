"""
Automated Evaluation Suite for Campus Helpdesk Assistant
Compares prompt versions (v1, v2, v3) across:
- Schema Compliance / JSON Validity
- Grounding & Quoted Source Accuracy
- Refusal Behavior on Out-of-Scope Questions
Problem Pool C1 | SCSE4041 Mini Project
"""

import os
import sys
import json
import csv
from typing import Dict, Any, List

sys.path.append(os.path.dirname(__file__))
from engine import (
    load_handbook,
    retrieve_relevant_sections,
    format_policy_context,
    parse_llm_json,
    verify_source_accuracy,
    run_prompt_with_llm
)

def evaluate_suite():
    base_dir = os.path.dirname(__file__)
    prompt_dir = os.path.join(base_dir, "..", "prompts")
    test_data_dir = os.path.join(base_dir, "..", "test-data")

    # Load prompt versions
    with open(os.path.join(prompt_dir, "v1", "P1_v1.txt"), "r", encoding="utf-8") as f:
        p_v1 = f.read()
    with open(os.path.join(prompt_dir, "v2", "P1_v2.txt"), "r", encoding="utf-8") as f:
        p_v2 = f.read()
    with open(os.path.join(prompt_dir, "final", "P1_CampusHelpdesk_v3.txt"), "r", encoding="utf-8") as f:
        p_v3 = f.read()

    prompts = {"v1": p_v1, "v2": p_v2, "v3": p_v3}

    # Load 40 benchmark questions
    with open(os.path.join(test_data_dir, "comprehensive_40_tests.json"), "r", encoding="utf-8") as f:
        test_cases = json.load(f)

    results_summary = {}

    for v_name, p_text in prompts.items():
        total = len(test_cases)
        json_valid_count = 0
        refusal_correct_count = 0
        quote_verified_count = 0
        refusal_total = 0
        answered_total = 0
        detailed_records = []

        for item in test_cases:
            query = item["query"]
            expected_status = item["expected_status"]
            expected_section = item["expected_section"]
            is_refusal_case = (expected_status == "not found")

            if is_refusal_case:
                refusal_total += 1
            else:
                answered_total += 1

            # Retrieve context
            secs = retrieve_relevant_sections(query, top_k=2)
            context = format_policy_context(secs)

            # Run prompt
            raw_out = run_prompt_with_llm(p_text, context, query)

            if v_name == "v1":
                # v1 is plain text, JSON validity is 0%
                is_json = False
                parsed = None
                refusal_ok = ("not found" in raw_out.lower() or "contact" in raw_out.lower()) and is_refusal_case
                quote_ok = False
            else:
                parsed, is_clean, err = parse_llm_json(raw_out)
                is_json = (parsed is not None and is_clean)
                if is_json:
                    json_valid_count += 1
                    status = parsed.get("status")
                    if is_refusal_case:
                        refusal_ok = (status == "not found")
                    else:
                        refusal_ok = True  # Not a refusal test
                    
                    if not is_refusal_case and status == "answered":
                        verif = verify_source_accuracy(parsed, secs)
                        quote_ok = verif["verified"]
                    else:
                        quote_ok = (status == "not found")
                else:
                    refusal_ok = False
                    quote_ok = False

            if refusal_ok and is_refusal_case:
                refusal_correct_count += 1
            if quote_ok and not is_refusal_case:
                quote_verified_count += 1

            detailed_records.append({
                "id": item["id"],
                "query": query,
                "domain": item["domain"],
                "version": v_name,
                "expected_status": expected_status,
                "raw_output": raw_out[:120].replace("\n", " "),
                "json_valid": is_json,
                "refusal_correct": refusal_ok,
                "quote_verified": quote_ok
            })

        results_summary[v_name] = {
            "total_questions": total,
            "json_valid_rate": f"{(json_valid_count / total) * 100:.1f}%",
            "citation_accuracy": f"{(quote_verified_count / answered_total) * 100:.1f}%" if answered_total else "N/A",
            "refusal_accuracy": f"{(refusal_correct_count / refusal_total) * 100:.1f}%" if refusal_total else "N/A",
            "overall_score": f"{((quote_verified_count + refusal_correct_count) / total) * 100:.1f}%"
        }

    # Save summary
    with open(os.path.join(test_data_dir, "evaluation_summary.json"), "w", encoding="utf-8") as f:
        json.dump(results_summary, f, indent=2)

    print("\n================== EVALUATION BENCHMARK RESULTS (40 TESTS) ==================")
    for v_name, metrics in results_summary.items():
        print(f"\n--- Prompt Version: {v_name.upper()} ---")
        for k, v in metrics.items():
            print(f"  {k}: {v}")
    print("=============================================================================\n")

if __name__ == "__main__":
    evaluate_suite()
