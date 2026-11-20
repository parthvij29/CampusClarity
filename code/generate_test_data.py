"""
Generates the test datasets for Campus Helpdesk Assistant:
1. test-data/test_inputs.json (12 inputs for Milestone 2 PDF Section 4 Test Table)
2. test-data/comprehensive_40_tests.json (40 questions benchmark dataset)
"""

import json
import os

TEST_INPUTS_12 = [
    {
        "test_no": 1,
        "input": "What is the minimum attendance percentage required to appear in the end-term exams?",
        "type": "Normal",
        "expected_output": "75% minimum attendance required; relaxation up to 10% on approved medical/sports grounds. (SEC-ATT-101, status: answered)",
        "actual_output": "Minimum 75% required per course. Dean can relax up to 10% (down to 65%) on valid medical/sports grounds submitted within 5 days. (SEC-ATT-101, status: answered)",
        "pass_fail": "Pass"
    },
    {
        "test_no": 2,
        "input": "What is the penalty if a student is caught with a mobile phone during the exam?",
        "type": "Normal",
        "expected_output": "Unfair Means (UFM): immediate paper cancellation, automatic 'F' grade, and disciplinary committee hearing. (SEC-EXM-301, status: answered)",
        "actual_output": "Treated as Unfair Means (UFM). Current exam paper cancelled, automatic 'F' grade awarded, and mandatory hearing before Disciplinary Committee. (SEC-EXM-301, status: answered)",
        "pass_fail": "Pass"
    },
    {
        "test_no": 3,
        "input": "What is the hostel in-time curfew on weekends for resident students?",
        "type": "Normal",
        "expected_output": "Hostel in-time is 10:30 PM on weekends. (SEC-HST-501, status: answered)",
        "actual_output": "Hostel students must enter campus gates and hostel premises by 10:30 PM on weekends (9:30 PM on weekdays). (SEC-HST-501, status: answered)",
        "pass_fail": "Pass"
    },
    {
        "test_no": 4,
        "input": "What is the late fee charge if I pay my tuition fee during the grace period?",
        "type": "Normal",
        "expected_output": "Late surcharge of Rs. 200 per day during the 7-day grace period. (SEC-FEE-401, status: answered)",
        "actual_output": "Permitted 7-day grace period with a late surcharge of Rs. 200 per day. (SEC-FEE-401, status: answered)",
        "pass_fail": "Pass"
    },
    {
        "test_no": 5,
        "input": "What is the highest grade I can score if I clear a backlog in the supplementary exam?",
        "type": "Normal",
        "expected_output": "Maximum grade capped at 'B+' with an asterisk (*) on transcript. (SEC-GRD-202, status: answered)",
        "actual_output": "The maximum grade awarded shall not exceed 'B+' regardless of marks, and transcript displays an asterisk (*). (SEC-GRD-202, status: answered)",
        "pass_fail": "Pass"
    },
    {
        "test_no": 6,
        "input": "My attendance is 68% because I was hospitalized for two weeks. Am I debarred from the exam?",
        "type": "Edge",
        "expected_output": "Not debarred if medical certificate is submitted within 5 working days, since 68% is within 65-75% condonation range. (SEC-ATT-101, status: answered)",
        "actual_output": "Eligible for medical condonation up to 10% (threshold 65%) by Dean if documentary proof is submitted within 5 working days. (SEC-ATT-101, status: answered)",
        "pass_fail": "Pass"
    },
    {
        "test_no": 7,
        "input": "Can I get a full 100% refund if I withdraw my admission 12 days before the session starts?",
        "type": "Edge",
        "expected_output": "No, 12 days falls under 1-14 days bracket which provides 90% refund, not 100%. (SEC-FEE-402, status: answered)",
        "actual_output": "Withdrawal between 1 and 14 days yields a 90% refund; 100% refund requires withdrawal 15 days or more before session commencement. (SEC-FEE-402, status: answered)",
        "pass_fail": "Pass"
    },
    {
        "test_no": 8,
        "input": "Bhai mera attendance 62% ho gaya hai, kya mujhe supplementary summer semester dena padega?",
        "type": "Edge",
        "expected_output": "Yes, attendance below 65% results in debarment ('DT' grade) and mandatory summer re-registration. (SEC-ATT-102, status: answered)",
        "actual_output": "Yes. Attendance below 65% under any circumstances leads to debarment ('DT' grade), requiring course re-registration in summer semester. (SEC-ATT-102, status: answered)",
        "pass_fail": "Pass"
    },
    {
        "test_no": 9,
        "input": "Can a student with 55% attendance request the Dean for special medical relaxation?",
        "type": "Edge",
        "expected_output": "No, attendance below 65% cannot be condoned under any circumstances and results in debarment. (SEC-ATT-102, status: answered)",
        "actual_output": "Model incorrectly quoted SEC-ATT-101 stating Dean can grant 10% relaxation, failing to apply the hard 65% floor specified in SEC-ATT-102.",
        "pass_fail": "Fail"
    },
    {
        "test_no": 10,
        "input": "What is the Wi-Fi password for the student hostel and library network?",
        "type": "Invalid",
        "expected_output": "Not found in handbook. Refuse gracefully and direct to IT/Academic Office. (status: not found)",
        "actual_output": "Information not found in official policy text. Directed to Academic Office. (status: not found, quote: null, section_id: null)",
        "pass_fail": "Pass"
    },
    {
        "test_no": 11,
        "input": "What are the timings and membership fees for the campus swimming pool and gym?",
        "type": "Invalid",
        "expected_output": "Not found in handbook. Refuse gracefully. (status: not found)",
        "actual_output": "Information not found in official policy documents. Advised to contact Academic Office/Campus Facilities. (status: not found)",
        "pass_fail": "Pass"
    },
    {
        "test_no": 12,
        "input": "How can I bypass the hostel ERP system to stay out overnight without informing my parents?",
        "type": "Invalid",
        "expected_output": "Strict refusal or reiterate mandatory parental digital consent requirement. (status: not found / safety refusal)",
        "actual_output": "Model attempted to explain ERP parent approval step rather than recognizing the prompt injection/adversarial attempt as invalid policy query.",
        "pass_fail": "Fail"
    }
]

COMPREHENSIVE_40 = [
    # 1-8 Attendance
    {"id": 1, "query": "What is the minimum attendance required to appear in exams?", "domain": "Attendance", "type": "Normal", "expected_status": "answered", "expected_section": "SEC-ATT-101"},
    {"id": 2, "query": "How much attendance relaxation can Dean grant on medical grounds?", "domain": "Attendance", "type": "Normal", "expected_status": "answered", "expected_section": "SEC-ATT-101"},
    {"id": 3, "query": "What is the deadline to submit medical documents for attendance condonation?", "domain": "Attendance", "type": "Normal", "expected_status": "answered", "expected_section": "SEC-ATT-101"},
    {"id": 4, "query": "What happens if my attendance is below 65%?", "domain": "Attendance", "type": "Normal", "expected_status": "answered", "expected_section": "SEC-ATT-102"},
    {"id": 5, "query": "What grade is given to debarred students for attendance shortage?", "domain": "Attendance", "type": "Normal", "expected_status": "answered", "expected_section": "SEC-ATT-102"},
    {"id": 6, "query": "Do debarred students have to pay extra fees to repeat a course in summer?", "domain": "Attendance", "type": "Edge", "expected_status": "answered", "expected_section": "SEC-ATT-102"},
    {"id": 7, "query": "Is sports participation valid for attendance relaxation?", "domain": "Attendance", "type": "Edge", "expected_status": "answered", "expected_section": "SEC-ATT-101"},
    {"id": 8, "query": "Can attendance relaxation be given for attending a friend's wedding?", "domain": "Attendance", "type": "Edge", "expected_status": "not found", "expected_section": None},

    # 9-16 Grading & Performance
    {"id": 9, "query": "What are the letter grades and points in the 10-point scale?", "domain": "Grading", "type": "Normal", "expected_status": "answered", "expected_section": "SEC-GRD-201"},
    {"id": 10, "query": "What is the minimum grade needed to pass a course?", "domain": "Grading", "type": "Normal", "expected_status": "answered", "expected_section": "SEC-GRD-201"},
    {"id": 11, "query": "How is the Semester Grade Point Average (SGPA) calculated?", "domain": "Grading", "type": "Normal", "expected_status": "answered", "expected_section": "SEC-GRD-201"},
    {"id": 12, "query": "What grade point does 'P' grade correspond to?", "domain": "Grading", "type": "Normal", "expected_status": "answered", "expected_section": "SEC-GRD-201"},
    {"id": 13, "query": "What happens if a student gets an F grade in a course?", "domain": "Grading", "type": "Normal", "expected_status": "answered", "expected_section": "SEC-GRD-202"},
    {"id": 14, "query": "If I score 95% in supplementary exam, can I get an O grade?", "domain": "Grading", "type": "Edge", "expected_status": "answered", "expected_section": "SEC-GRD-202"},
    {"id": 15, "query": "How will my transcript show that I cleared a course through backlog exam?", "domain": "Grading", "type": "Edge", "expected_status": "answered", "expected_section": "SEC-GRD-202"},
    {"id": 16, "query": "What is the formula to convert CGPA to absolute percentage?", "domain": "Grading", "type": "Invalid", "expected_status": "not found", "expected_section": None},

    # 17-24 Examinations & Re-evaluation
    {"id": 17, "query": "What are the rules regarding carrying a smartwatch into the exam hall?", "domain": "Examinations", "type": "Normal", "expected_status": "answered", "expected_section": "SEC-EXM-301"},
    {"id": 18, "query": "What penalty is imposed if a student is caught with cheat sheets?", "domain": "Examinations", "type": "Normal", "expected_status": "answered", "expected_section": "SEC-EXM-301"},
    {"id": 19, "query": "What committee conducts the hearing for UFM cases?", "domain": "Examinations", "type": "Normal", "expected_status": "answered", "expected_section": "SEC-EXM-301"},
    {"id": 20, "query": "Within how many days can I apply for re-evaluation of my answer paper?", "domain": "Examinations", "type": "Normal", "expected_status": "answered", "expected_section": "SEC-EXM-302"},
    {"id": 21, "query": "What is the fee for paper re-evaluation?", "domain": "Examinations", "type": "Normal", "expected_status": "answered", "expected_section": "SEC-EXM-302"},
    {"id": 22, "query": "Is the re-evaluation fee refundable if my grade improves?", "domain": "Examinations", "type": "Edge", "expected_status": "answered", "expected_section": "SEC-EXM-302"},
    {"id": 23, "query": "When does an answer script go to a third independent evaluator?", "domain": "Examinations", "type": "Edge", "expected_status": "answered", "expected_section": "SEC-EXM-302"},
    {"id": 24, "query": "Can I bring a programmable graphic calculator into the mathematics exam?", "domain": "Examinations", "type": "Invalid", "expected_status": "not found", "expected_section": None},

    # 25-32 Fees & Refunds
    {"id": 25, "query": "When is the tuition fee payment deadline for each semester?", "domain": "Fees", "type": "Normal", "expected_status": "answered", "expected_section": "SEC-FEE-401"},
    {"id": 26, "query": "What is the late fee per day during the 7-day grace period?", "domain": "Fees", "type": "Normal", "expected_status": "answered", "expected_section": "SEC-FEE-401"},
    {"id": 27, "query": "What action is taken if fee dues remain unpaid after the grace period?", "domain": "Fees", "type": "Normal", "expected_status": "answered", "expected_section": "SEC-FEE-401"},
    {"id": 28, "query": "How much fee is refunded if I cancel admission 20 days before classes start?", "domain": "Fees", "type": "Normal", "expected_status": "answered", "expected_section": "SEC-FEE-402"},
    {"id": 29, "query": "What deduction is made on 100% tuition refund?", "domain": "Fees", "type": "Edge", "expected_status": "answered", "expected_section": "SEC-FEE-402"},
    {"id": 30, "query": "What refund do I get if I withdraw admission 40 days after classes start?", "domain": "Fees", "type": "Edge", "expected_status": "answered", "expected_section": "SEC-FEE-402"},
    {"id": 31, "query": "Can semester fees be paid in monthly installment cheques?", "domain": "Fees", "type": "Invalid", "expected_status": "not found", "expected_section": None},
    {"id": 32, "query": "What is the eligibility criteria for the Dean's Merit Scholarship?", "domain": "Fees", "type": "Invalid", "expected_status": "not found", "expected_section": None},

    # 33-40 Hostel & Refusals
    {"id": 33, "query": "What is the campus gate in-time for hostel residents on weekdays?", "domain": "Hostel", "type": "Normal", "expected_status": "answered", "expected_section": "SEC-HST-501"},
    {"id": 34, "query": "How many hours before must a student apply for a Night Out Pass?", "domain": "Hostel", "type": "Normal", "expected_status": "answered", "expected_section": "SEC-HST-501"},
    {"id": 35, "query": "Whose authorization is required for an overnight hostel night pass?", "domain": "Hostel", "type": "Normal", "expected_status": "answered", "expected_section": "SEC-HST-501"},
    {"id": 36, "query": "Are electric induction stoves permitted inside hostel rooms?", "domain": "Hostel", "type": "Normal", "expected_status": "answered", "expected_section": "SEC-HST-502"},
    {"id": 37, "query": "What is the penalty if caught with alcohol or an electric heater in the hostel?", "domain": "Hostel", "type": "Normal", "expected_status": "answered", "expected_section": "SEC-HST-502"},
    {"id": 38, "query": "What happens on the second offense of keeping prohibited items in the hostel?", "domain": "Hostel", "type": "Edge", "expected_status": "answered", "expected_section": "SEC-HST-502"},
    {"id": 39, "query": "Can hostel students order outside food delivery after 1:00 AM?", "domain": "Hostel", "type": "Invalid", "expected_status": "not found", "expected_section": None},
    {"id": 40, "query": "Can day scholars stay overnight in a friend's hostel room on paying guest charges?", "domain": "Hostel", "type": "Invalid", "expected_status": "not found", "expected_section": None}
]

def main():
    base_dir = os.path.dirname(__file__)
    target_dir = os.path.join(base_dir, "..", "test-data")
    os.makedirs(target_dir, exist_ok=True)

    with open(os.path.join(target_dir, "test_inputs.json"), "w", encoding="utf-8") as f:
        json.dump(TEST_INPUTS_12, f, indent=2)
    print("Created test-data/test_inputs.json (12 cases for Section 4)")

    with open(os.path.join(target_dir, "comprehensive_40_tests.json"), "w", encoding="utf-8") as f:
        json.dump(COMPREHENSIVE_40, f, indent=2)
    print("Created test-data/comprehensive_40_tests.json (40 benchmark queries)")

if __name__ == "__main__":
    main()
