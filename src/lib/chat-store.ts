import type { UIMessage } from "ai";

export type ChatThread = {
  id: string;
  title: string;
  updatedAt: number;
  messages: UIMessage[];
  platformId?: string | undefined;
  agentCategory?: string | undefined;
};

const key = "wellio-chat-threads-v6";
const legacyV5Key = "wellio-chat-threads-v5";
const legacyV4Key = "wellio-chat-threads-v4";
const legacyV3Key = "wellio-chat-threads-v3";
const legacyV2Key = "wellio-chat-threads-v2";
const legacyV1Key = "wellio-chat-threads-v1";
const legacyKey = "wrute-chat-threads-v1";

export const DEFAULT_DEMO_THREADS: ChatThread[] = [
  // =========================================================================
  // GOODDOC HMS (All 14 Categories in Natural ChatGPT-Style Prose)
  // =========================================================================

  // 1. Patient Insights
  {
    id: "hms-demo-patient-insights",
    title: "OPD Demographic & Return Visit Audit",
    platformId: "gooddoc-hms",
    agentCategory: "Patient Demographics & Cohort Retention Analytics",
    updatedAt: Date.now() - 1000 * 60 * 15,
    messages: [
      {
        id: "hms-msg-1-u1",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Show new vs returning patient trends this month across cardiology and general medicine",
          },
        ],
      },
      {
        id: "hms-msg-1-a1",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `During October 2026, Cardiology recorded 2,840 total outpatient visits. Of these, 796 were new registrations and 2,044 were returning patients, reflecting a 72% repeat attendance rate with an average visit interval of 28 days.

General Medicine handled 4,120 visits, split between 1,895 new patients and 2,225 returning visits, giving a 54% return rate and an average return interval of 42 days. For context, Orthopedics saw a 58% return rate across 1,930 visits, while Pediatrics stood at 54.1% across 1,460 visits.

The strong re-attendance in Cardiology is largely driven by structured hypertension and post-angioplasty follow-up regimens for patients aged 52 to 68. In General Medicine, 64% of new patient registrations originated from the Outer Ring Road cluster, showing strong patient pull from our recently opened diagnostic outreach center. However, 142 post-discharge cardiac patients missed their scheduled 30-day review, and automated reminders have been dispatched.`,
          },
        ],
      },
      {
        id: "hms-msg-1-u2",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Which age cohort has the highest 30-day drop-off rate, and what are their primary pin codes?",
          },
        ],
      },
      {
        id: "hms-msg-1-a2",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Patients aged 58 to 72 years showed the highest attrition, with a 38.4% drop-off rate for non-acute consultations.

The majority of these drop-offs originated from three primary postal zones: 600096 in Perungudi with 48 missed visits, 600119 in Sholinganallur with 36 missed visits, and 600042 in Velachery with 24 missed visits.

The primary factor cited in patient outreach logs is travel distance exceeding 14 kilometers and difficulty arranging attendant escorts for morning diagnostic appointments. Setting up satellite tele-followup slots or home specimen collections could help recapture this cohort.`,
          },
        ],
      },
      {
        id: "hms-msg-1-u3",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Export the list of high-risk diabetic patients who haven't returned for their 90-day HbA1c screening.",
          },
        ],
      },
      {
        id: "hms-msg-1-a3",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `We have identified 86 chronic diabetic patients with a last recorded HbA1c above 8.5% who have not had a hospital encounter logged in the past 90 days.

This cohort has been assigned to Sister Revathi at the Endocrinology Clinic. Automated booking links have been sent with a 15% diagnostic package benefit, and home phlebotomy visits have been scheduled for 28 senior patients living along the OMR corridor.`,
          },
        ],
      },
    ],
  },

  // 2. Appointment Management
  {
    id: "hms-demo-appointment-management",
    title: "Cardiology No-Show & Booking Hour Analysis",
    platformId: "gooddoc-hms",
    agentCategory: "Outpatient Appointment & Scheduling Operations",
    updatedAt: Date.now() - 1000 * 60 * 30,
    messages: [
      {
        id: "hms-msg-2-u1",
        role: "user",
        parts: [
          {
            type: "text",
            text: "What is our appointment no-show rate this week and what are peak cancellation hours?",
          },
        ],
      },
      {
        id: "hms-msg-2-a1",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `This week across our outpatient departments, 1,280 appointments were scheduled. Out of these, 1,062 consultations were completed successfully, representing an 83% completion rate. Cancellations with over 24 hours notice accounted for 98 appointments (7.7%), while unnotified no-shows stood at 120 appointments, or 9.3%.

No-shows clustered heavily around the 8:30 AM to 10:00 AM window, which accounted for nearly half of all unnotified absences, mainly due to weekday morning transit congestion. In contrast, the afternoon window between 3:00 PM and 4:30 PM saw the highest rate of same-day reschedules, with patients frequently citing clinic waiting times.

To mitigate this, we recommend introducing a controlled 10% overbooking buffer on early morning slots, combined with interactive confirmation messages sent two hours ahead of appointments.`,
          },
        ],
      },
      {
        id: "hms-msg-2-u2",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Break down no-shows by booking source — web portal, WhatsApp bot, or reception desk.",
          },
        ],
      },
      {
        id: "hms-msg-2-a2",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Looking at channel adherence, appointments booked through the WhatsApp bot achieved the lowest no-show rate at 5.2% across 520 bookings. The reception desk recorded a 7.9% no-show rate across 480 bookings.

The self-service web portal had the highest attrition, with an 18.9% no-show rate across 280 bookings. This difference is largely because the web portal currently lacks automated calendar reminders and real-time transit directions, whereas WhatsApp delivers conversational reminders and direct directions.`,
          },
        ],
      },
      {
        id: "hms-msg-2-u3",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Can we activate automatic slot recycling for cancellations made within 3 hours?",
          },
        ],
      },
      {
        id: "hms-msg-2-a3",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Automatic slot recycling is now active. Any appointment cancelled within three hours of consultation is immediately routed to the walk-in triage standby queue, with priority given to category 3 and 4 triage cases.

Today, 14 released consultation slots were successfully reallocated within an average of 4.2 minutes, recovering ₹11,200 in consulting revenue and shortening waiting times for walk-in patients.`,
          },
        ],
      },
    ],
  },

  // 3. Doctor Insights
  {
    id: "hms-demo-doctor-insights",
    title: "Specialist Consultation & Workload Review",
    platformId: "gooddoc-hms",
    agentCategory: "Specialist Consultation & Clinical Workload Performance",
    updatedAt: Date.now() - 1000 * 60 * 45,
    messages: [
      {
        id: "hms-msg-3-u1",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Compare consultation volume and workload across specialists for current quarter",
          },
        ],
      },
      {
        id: "hms-msg-3-a1",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `During the third quarter, Dr. Rajesh Varma in Cardiology led outpatient volume with 1,420 consultations and 184 inpatient rounds, averaging 14.2 minutes per patient and maintaining a patient satisfaction score of 94.2.

Dr. Sunita Menon in Pulmonology conducted 1,180 consultations and 142 inpatient rounds with an average consult time of 16.5 minutes. Dr. Anand Kulkarni in Orthopedics handled 990 consultations alongside a demanding surgical inpatient schedule of 210 rounds, averaging 12.0 minutes per clinic visit. Dr. Preeti Nair in Endocrinology completed 1,260 consultations and 92 inpatient rounds with an average visit length of 18.0 minutes and a satisfaction score of 95.6.

Dr. Varma is currently operating at 118% of scheduled clinic capacity, which has created an average 38-minute queue in Clinic 4. We recommend allocating adjacent room 4B for pre-consultation nursing vitals to reduce in-room consultation time.`,
          },
        ],
      },
      {
        id: "hms-msg-3-u2",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Why is Dr. Rajesh Varma's OPD waiting queue averaging 38 minutes?",
          },
        ],
      },
      {
        id: "hms-msg-3-a2",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `The queue delay stems primarily from diagnostic review during the consult itself. Approximately 24% of Dr. Varma's patients undergo an impromptu 12-lead ECG or echocardiogram review while inside the consultation room rather than during initial nursing triage.

In addition, documenting post-angioplasty coronary notes takes an average of 4.5 minutes per patient in the current EHR layout. Having these tests and initial vitals completed prior to doctor entry will significantly shorten the queue.`,
          },
        ],
      },
      {
        id: "hms-msg-3-u3",
        role: "user",
        parts: [
          {
            type: "text",
            text: "What if we assign a junior registrar to Room 4B for pre-consultation vitals and ECG documentation?",
          },
        ],
      },
      {
        id: "hms-msg-3-a3",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Assigning a junior registrar for pre-consultation workup is projected to reduce Dr. Varma's consult time from 14.2 minutes down to 9.5 minutes per patient.

This adjustment will cut average patient waiting time from 38 minutes down to roughly 16 minutes, representing a 58% reduction, while allowing the clinic to safely handle 6 additional follow-up appointments daily without physician strain.`,
          },
        ],
      },
    ],
  },

  // 4. Department Insights
  {
    id: "hms-demo-department-insights",
    title: "OP vs IP Department Revenue & Utilization",
    platformId: "gooddoc-hms",
    agentCategory: "Clinical Department Performance & Specialty Utilization",
    updatedAt: Date.now() - 1000 * 60 * 60,
    messages: [
      {
        id: "hms-msg-4-u1",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Compare OP vs IP revenue and patient volume across major clinical departments this month",
          },
        ],
      },
      {
        id: "hms-msg-4-a1",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Month to date, Cardiology leads clinical performance with 2,840 outpatient visits generating ₹22.7 Lakhs, and 184 inpatient admissions generating ₹84.6 Lakhs at 91.5% bed occupancy.

Orthopedics recorded 1,930 outpatient visits with ₹15.4 Lakhs in revenue and 128 inpatient admissions generating ₹58.9 Lakhs at 79.2% occupancy. Neurology handled 1,410 outpatient visits and 92 admissions, generating ₹53.3 Lakhs in combined revenue. General Surgery admitted 146 inpatients, contributing ₹51.3 Lakhs in inpatient billing at 88% bed utilization. Gastroenterology saw 1,650 outpatient visits and 82 admissions, producing ₹47.6 Lakhs in total revenue.

Across all five departments, combined billing reached ₹3.43 Crore across 9,050 patient encounters.`,
          },
        ],
      },
      {
        id: "hms-msg-4-u2",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Why did Orthopedics IP revenue dip by 8.4% compared to last month?",
          },
        ],
      },
      {
        id: "hms-msg-4-a2",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `The revenue dip in Orthopedics was primarily due to scheduled downtime in Operating Theater 3. The theater was taken offline for three days for laminar airflow HEPA filter recertification, which required postponing 14 elective joint arthroplasties.

Additionally, a consignment shipment of knee implants experienced a 48-hour customs clearance delay, temporarily holding up two complex revisions.`,
          },
        ],
      },
      {
        id: "hms-msg-4-u3",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Has the backlog of pending elective joint replacement surgeries been cleared?",
          },
        ],
      },
      {
        id: "hms-msg-4-a3",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Nine of the fourteen postponed cases have already been completed using extended Saturday surgical blocks. 

The remaining five procedures are scheduled for Monday and Tuesday, with eight private orthopedics ward beds reserved in advance. The entire backlog will be fully cleared by Thursday.`,
          },
        ],
      },
    ],
  },

  // 5. Financial Insights
  {
    id: "hms-demo-financial-insights",
    title: "Insurance Claims Aging & TPA Settlement Audit",
    platformId: "gooddoc-hms",
    agentCategory: "Hospital Billing, Revenue & Insurance Claims Management",
    updatedAt: Date.now() - 1000 * 60 * 75,
    messages: [
      {
        id: "hms-msg-5-u1",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Summary of outstanding insurance claims, denial rates, and aging past 45 days",
          },
        ],
      },
      {
        id: "hms-msg-5-a1",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `We currently have ₹2.94 Crore in total submitted insurance claims across our primary payers. 

Medi Assist accounts for the largest share, with 198 claims totaling ₹1.12 Crore, of which ₹92.4 Lakhs has been approved and ₹18.4 Lakhs is aging past 45 days across 22 queried files. Star Health holds 142 claims totaling ₹78.4 Lakhs, with ₹11.8 Lakhs aging past 45 days across 14 files. Vidal Health has ₹12.4 Lakhs aging past 45 days, and ICICI Lombard has ₹5.6 Lakhs across 6 files.

In total, ₹48.2 Lakhs is currently pending resolution beyond the 45-day threshold across 53 disputed claims.`,
          },
        ],
      },
      {
        id: "hms-msg-5-u2",
        role: "user",
        parts: [
          {
            type: "text",
            text: "What is the primary reason for queries raised by Medi Assist on IPD packages?",
          },
        ],
      },
      {
        id: "hms-msg-5-a2",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Over the past 30 days, 62% of queries raised by Medi Assist were caused by missing implant invoice stickers and batch barcode scans from surgical documentation.

Another 28% were related to room category discrepancies, where patients were pre-authorized for twin-sharing but admitted to single deluxe rooms without an attached written consent letter. The remaining 10% stemmed from minor item mismatches between the final discharge summary and the pharmacy dispensing ledger.`,
          },
        ],
      },
      {
        id: "hms-msg-5-u3",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Show list of unbilled discharge cases from yesterday's second shift.",
          },
        ],
      },
      {
        id: "hms-msg-5-a3",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Three patient files from yesterday's evening shift are currently awaiting final billing reconciliation.

IP-44091 in Ward 4 is pending final surgical consumable logging for ₹42,800. IP-44104 in Ward 5 is awaiting a pharmacy return credit adjustment of ₹18,950. IP-44118 in Deluxe Room 302 is waiting for final TPA settlement confirmation on a ₹1.24 Lakh bill. The billing desk has been notified to complete all three by 10:30 AM.`,
          },
        ],
      },
    ],
  },

  // 6. Pharmacy Intelligence
  {
    id: "hms-demo-pharmacy-intelligence",
    title: "Critical Drug Inventory & Expiry Schedule",
    platformId: "gooddoc-hms",
    agentCategory: "Hospital Pharmacy Inventory & Formulary Management",
    updatedAt: Date.now() - 1000 * 60 * 90,
    messages: [
      {
        id: "hms-msg-6-u1",
        role: "user",
        parts: [
          {
            type: "text",
            text: "List critical medicines running low on stock and batches expiring within the next 30 days",
          },
        ],
      },
      {
        id: "hms-msg-6-a1",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Currently, two critical medications are below their safety buffer thresholds. Injectable Meropenem 1g has 42 vials remaining against a minimum buffer of 150 vials, providing approximately 1.8 days of coverage. Injectable Noradrenaline 4mg has 18 ampoules left against a 60-ampoule buffer, representing roughly 1.2 days of stock.

Enoxaparin 40mg prefilled syringes stand at 84 units with 3.4 days of stock, and Apixaban 5mg tablets have 310 units with 4.2 days of stock.

In terms of upcoming expiries, 180 vials of Injectable Pantoprazole 40mg (Batch PT-904, valued at ₹7,560) expire on November 15. These have been flagged for priority use in outpatient care to avoid discard loss.`,
          },
        ],
      },
      {
        id: "hms-msg-6-u2",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Which supplier has the shortest lead time for emergency Inj. Noradrenaline procurement?",
          },
        ],
      },
      {
        id: "hms-msg-6-a2",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Metro Pharma Lifesciences offers the fastest turnaround, with direct courier dispatch in approximately 4 hours under our active rate contract at ₹115 per ampoule.

By comparison, Apollo Central Distribution requires a 12-hour fulfillment cycle at ₹124 per ampoule. Purchase order 88412 has already been issued to Metro Pharma for 150 ampoules, with expected arrival before 2:00 PM today.`,
          },
        ],
      },
      {
        id: "hms-msg-6-u3",
        role: "user",
        parts: [
          {
            type: "text",
            text: "What is our current monthly holding cost for slow-moving oncology biologics?",
          },
        ],
      },
      {
        id: "hms-msg-6-a3",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `The hospital currently has approximately ₹14.8 Lakhs tied up in slow-moving oncology biologics across 12 low-turnover monoclonal antibodies, primarily Trastuzumab and Bevacizumab.

Transitioning 8 of these high-cost SKUs to an on-demand vendor consignment model will release approximately ₹6.2 Lakhs back into active working capital by the end of the month, while ensuring uninterrupted patient access.`,
          },
        ],
      },
    ],
  },

  // 7. Laboratory Intelligence
  {
    id: "hms-demo-laboratory-intelligence",
    title: "Pathology TAT & Critical Value Alert Report",
    platformId: "gooddoc-hms",
    agentCategory: "Diagnostic Laboratory & Pathology Operations Analytics",
    updatedAt: Date.now() - 1000 * 60 * 105,
    messages: [
      {
        id: "hms-msg-7-u1",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Identify lab tests with turnaround time delays over 4 hours and peak sample influx hours",
          },
        ],
      },
      {
        id: "hms-msg-7-a1",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Over the past week, STAT Troponin-I testing averaged 64 minutes against a 45-minute benchmark, with 22% of samples exceeding standard turnaround due to centrifuge sequencing delays during evening hours.

Arterial Blood Gas testing maintained full compliance, averaging 18 minutes against our 20-minute target. Serum Creatinine and Electrolytes averaged 118 minutes against a 90-minute benchmark, with 14% of runs delayed by recalibration on Analyzer 2. Blood cultures averaged 56 hours against the 48-hour protocol.

Peak specimen influx consistently occurs between 8:30 AM and 10:45 AM, representing 58% of our daily outpatient phlebotomy load.`,
          },
        ],
      },
      {
        id: "hms-msg-7-u2",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Why did Troponin-I STAT testing exceed the 45-minute emergency threshold yesterday evening?",
          },
        ],
      },
      {
        id: "hms-msg-7-a2",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Yesterday between 7:15 PM and 8:30 PM, Centrifuge-03 experienced an rotor balance alarm during an emergency intake run. The technician rerouted samples to Biochemistry Lab 2, adding a 19-minute transit delay.

To prevent recurrence, a dedicated microcentrifuge unit has been installed in the Emergency Department triage laboratory this morning.`,
          },
        ],
      },
      {
        id: "hms-msg-7-u3",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Are all critical value alerts being communicated to treating ICU consultants within 15 minutes?",
          },
        ],
      },
      {
        id: "hms-msg-7-a3",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Our critical value escalation compliance currently stands at 98.4% across 64 flagged lab values this week. The average response time from lab verification to verified doctor read-back was 7.2 minutes.

Only one delayed call occurred in Ward 3 involving an elevated potassium result, which was acknowledged in 18 minutes with no adverse outcome.`,
          },
        ],
      },
    ],
  },

  // 8. Bed & Admission Analytics
  {
    id: "hms-demo-bed-admission-analytics",
    title: "ICU & General Ward Bed Census & Discharge Flow",
    platformId: "gooddoc-hms",
    agentCategory: "Inpatient Bed Census & Ward Admission Analytics",
    updatedAt: Date.now() - 1000 * 60 * 120,
    messages: [
      {
        id: "hms-msg-8-u1",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Current ICU and general ward bed occupancy rate and emergency admission capacity",
          },
        ],
      },
      {
        id: "hms-msg-8-a1",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Hospital-wide bed occupancy is currently 87.2%, with 190 of our 214 operational beds occupied.

In critical care, the Medical ICU has 23 of 24 beds occupied (95.8%), leaving 1 bed free. The Surgical ICU is currently at full 100% capacity across all 16 beds. The Coronary Care Unit has 12 of 14 beds occupied with 1 bed reserved, and the Step-Down HDU has 17 of 20 beds occupied. General medical wards are running at 88.8% occupancy with 6 available beds, and post-surgical wards have 5 available beds.`,
          },
        ],
      },
      {
        id: "hms-msg-8-u2",
        role: "user",
        parts: [
          {
            type: "text",
            text: "How many planned discharges are scheduled before 12:00 PM today to free up beds?",
          },
        ],
      },
      {
        id: "hms-msg-8-a2",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Eighteen discharges are planned before noon today. Eleven patients have received final physician sign-off, eight have completed pharmacy reconciliation, and five have received final TPA clearance.

These discharges will release 2 critical beds in CCU, 4 in the post-surgical ward, and 8 in general medical care, all expected to be sanitized and ready by 12:30 PM.`,
          },
        ],
      },
      {
        id: "hms-msg-8-u3",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Can we expedite Step-Down HDU transfers for stable post-op cardiac patients?",
          },
        ],
      },
      {
        id: "hms-msg-8-a3",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Dr. Rajesh Varma has evaluated and approved two transfers. Patient A in CCU Bed 04 is post-angioplasty day two and stable, and has been cleared for transfer to HDU Bed 08. 

Patient B in SICU Bed 11 is post-cholecystectomy day one with stable vitals, and has been transferred to Ward 4. These two transfers immediately release one surgical ICU bed and one coronary care bed for emergency intake.`,
          },
        ],
      },
    ],
  },

  // 9. Queue & Waiting Analysis
  {
    id: "hms-demo-queue-waiting-analysis",
    title: "OPD Token Flow & Departmental Bottleneck Audit",
    platformId: "gooddoc-hms",
    agentCategory: "Outpatient Queue Flow & Patient Waiting Time Analysis",
    updatedAt: Date.now() - 1000 * 60 * 140,
    messages: [
      {
        id: "hms-msg-9-u1",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Average patient wait time from token generation to doctor consultation across OP clinics",
          },
        ],
      },
      {
        id: "hms-msg-9-a1",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Today, total waiting time from token generation to physician consultation averaged 44 minutes in Cardiology across 142 tokens, comprising 14 minutes waiting for initial vitals and 30 minutes waiting for doctor entry.

Orthopedics averaged 28 minutes total wait time, Pediatrics averaged 18 minutes, Ophthalmology recorded 32 minutes, and General Medicine averaged 40 minutes across 184 tokens. Peak waiting times occurred between 9:15 AM and 11:30 AM across Block A clinics.`,
          },
        ],
      },
      {
        id: "hms-msg-9-u2",
        role: "user",
        parts: [
          {
            type: "text",
            text: "At which stage of the visit does the longest delay occur in Cardiology?",
          },
        ],
      },
      {
        id: "hms-msg-9-a2",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `The primary bottleneck occurs at initial nursing triage, where a single nursing station handles height, weight, blood pressure, and random glucose checks for three concurrent consultants, creating a 14-minute average queue.

An additional 22-minute delay occurs prior to consultation entry while clinicians review paper records. Adding a parallel vitals station will immediately balance the flow.`,
          },
        ],
      },
      {
        id: "hms-msg-9-u3",
        role: "user",
        parts: [
          {
            type: "text",
            text: "What happens to queue times if we open a second vitals station in Corridor B?",
          },
        ],
      },
      {
        id: "hms-msg-9-a3",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Opening Station B2 will reduce waiting time for vitals from 14 minutes down to 4.5 minutes. 

This will bring overall clinic wait time down from 44 minutes to approximately 24 minutes, representing a 45% improvement in queue velocity. Station B2 has been configured with an automated digital monitor and pulse oximeter for immediate operation.`,
          },
        ],
      },
    ],
  },

  // 10. Operational Efficiency
  {
    id: "hms-demo-operational-efficiency",
    title: "Registration Desk & Billing Counter Throughput",
    platformId: "gooddoc-hms",
    agentCategory: "Front Office Operations & Patient Administration Productivity",
    updatedAt: Date.now() - 1000 * 60 * 160,
    messages: [
      {
        id: "hms-msg-10-u1",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Average registration time per patient at the front desk and billing counter productivity",
          },
        ],
      },
      {
        id: "hms-msg-10-a1",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Across 366 morning arrivals, front desk registration averaged 2.8 minutes per patient. Counter 1 processed 148 patients at 2.2 minutes each, and Counter 2 processed 136 patients at 2.5 minutes each.

Counter 3, which handles corporate empanelled registrations, averaged 4.6 minutes across 82 transactions. At the billing desks, outpatient settlement averaged 1.8 minutes per bill across 192 receipts, while inpatient discharge billing averaged 6.4 minutes per settlement.`,
          },
        ],
      },
      {
        id: "hms-msg-10-u2",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Why does Counter 3 take 1.8 minutes longer per patient than Counter 1?",
          },
        ],
      },
      {
        id: "hms-msg-10-a2",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Counter 3 processes corporate insurance patients requiring manual document scanning of physical corporate identity cards, government IDs, and verification letters. 

The existing flatbed scanner takes roughly 42 seconds per document at high resolution, which compounds with each verification.`,
          },
        ],
      },
      {
        id: "hms-msg-10-u3",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Can we migrate corporate policy scanning to the mobile self-upload pre-registration link?",
          },
        ],
      },
      {
        id: "hms-msg-10-a3",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Pre-registration document upload via mobile QR code is currently operational. 

Forty-two corporate patients utilized mobile upload this morning, allowing the desk staff to verify documentation in 52 seconds rather than 4.6 minutes. Expanding signage in the lobby will help raise adoption further.`,
          },
        ],
      },
    ],
  },

  // 11. Patient Journey
  {
    id: "hms-demo-patient-journey",
    title: "End-to-End OP Journey & Idle Time Mapping",
    platformId: "gooddoc-hms",
    agentCategory: "End-to-End Outpatient Care Journey & Milestone Tracking",
    updatedAt: Date.now() - 1000 * 60 * 180,
    messages: [
      {
        id: "hms-msg-11-u1",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Map end-to-end journey timeline for today's OP patients from entry to pharmacy exit",
          },
        ],
      },
      {
        id: "hms-msg-11-a1",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `For patients requiring diagnostics and pharmacy dispensing, total journey duration averaged 106 minutes today.

On average, registration took 3 minutes, nursing triage took 12 minutes, waiting lounge time averaged 24 minutes, doctor consultation took 15 minutes, laboratory and imaging work took 34 minutes, and pharmacy billing and dispensing took 18 minutes.`,
          },
        ],
      },
      {
        id: "hms-msg-11-u2",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Where do patients experience the most unnecessary idle transition time?",
          },
        ],
      },
      {
        id: "hms-msg-11-a2",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `The largest idle transition occurs after laboratory investigations, where patients spend approximately 16 minutes walking to the second-floor central pharmacy and waiting in a queue before their prescription is even received.

A secondary 12-minute delay occurs waiting for physical prescription printouts and consultant signatures at clinic reception desks.`,
          },
        ],
      },
      {
        id: "hms-msg-11-u3",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Can prescriptions be routed directly to the pharmacy dispenser while the patient is still in consult?",
          },
        ],
      },
      {
        id: "hms-msg-11-a3",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Instant e-prescription routing is now configured. As soon as the physician completes the consultation order in the EHR, a packing slip auto-prints at Pharmacy Dispensing Station 4.

Medications are pre-packaged and verified before the patient arrives at the counter, reducing pharmacy waiting time from 18 minutes down to 3.5 minutes.`,
          },
        ],
      },
    ],
  },

  // 12. Compliance & Audit
  {
    id: "hms-demo-compliance-audit",
    title: "NABH Clinical Documentation & Discharge Summary Audit",
    platformId: "gooddoc-hms",
    agentCategory: "Medical Records Audit & Healthcare Regulatory Compliance",
    updatedAt: Date.now() - 1000 * 60 * 200,
    messages: [
      {
        id: "hms-msg-12-u1",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Highlight patient discharge summaries pending doctor sign-off and clinical documentation gaps",
          },
        ],
      },
      {
        id: "hms-msg-12-a1",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `In our latest NABH clinical documentation review across 120 discharged patient files, 24 summaries lacked senior consultant sign-off within the required 24-hour window, resulting in an 80% on-time compliance rate.

Surgical consent documentation maintained 100% compliance across 46 audited cases. Inpatient antibiotic reviews were compliant in 79 of 88 records (89.7%), fall risk evaluations scored 98.5%, and nursing medication chart sign-offs stood at 97.1%.`,
          },
        ],
      },
      {
        id: "hms-msg-12-u2",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Which clinical unit has the highest volume of unsigned electronic medical records?",
          },
        ],
      },
      {
        id: "hms-msg-12-a2",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `General Surgery Unit 2 currently holds 11 unsigned discharge summaries following weekend emergency admissions. 

Orthopedics Unit 1 has 7 pending summaries, Cardiothoracic Surgery has 4, and Nephrology has 2.`,
          },
        ],
      },
      {
        id: "hms-msg-12-u3",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Generate automated escalation alert to department HOD per NABH Chapter 4 guidelines.",
          },
        ],
      },
      {
        id: "hms-msg-12-a3",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `An escalation notice has been transmitted to Medical Superintendent Dr. S. Rao and unit department heads. 

A high-priority review prompt was also pushed to the attending consultants' mobile clinical portals with single-touch biometric authorization, resulting in 14 pending summaries being reviewed and signed within 45 minutes.`,
          },
        ],
      },
    ],
  },

  // 13. Clinical Workflow Optimization
  {
    id: "hms-demo-ai-recommendations",
    title: "Dynamic Nursing Staff Allocation & Weekend Roster",
    platformId: "gooddoc-hms",
    agentCategory: "Clinical Workflow Optimization & Resource Allocation",
    updatedAt: Date.now() - 1000 * 60 * 220,
    messages: [
      {
        id: "hms-msg-13-u1",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Recommended nurse-to-patient staffing ratio for tomorrow across ICU, Emergency, and Wards",
          },
        ],
      },
      {
        id: "hms-msg-13-a1",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Based on predicted census for tomorrow, the Medical ICU requires 24 nurses to maintain a 1:1 ratio for 24 patients, leaving a 2-nurse deficit against the 22 currently scheduled. The Surgical ICU is balanced with 16 nurses for 16 patients.

Emergency Triage expects an intake surge between 6:00 PM and 10:00 PM, projecting a 2-nurse deficit during the evening hours. In contrast, Day Care surgery expects low afternoon occupancy with an estimated surplus of 2 nurses once scheduled endoscopies conclude. General wards are evenly staffed at 21 nurses for 122 patients.`,
          },
        ],
      },
      {
        id: "hms-msg-13-u2",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Can we reassign float nurses from Day Care surgery to cover the evening Emergency surge?",
          },
        ],
      },
      {
        id: "hms-msg-13-a2",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Reassigning Day Care float nurses is feasible. All 14 day-care procedures finish by 4:30 PM. 

Staff Nurse Priya and Staff Nurse Deepa both hold active emergency resuscitation credentials. Their duty hours have been adjusted to 5:30 PM to 1:30 AM in Emergency Triage, covering the evening surge without overtime expenditure.`,
          },
        ],
      },
      {
        id: "hms-msg-13-u3",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Confirm the revised duty roster broadcast to ward supervisors.",
          },
        ],
      },
      {
        id: "hms-msg-13-a3",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `The updated shift roster has been broadcast through the nursing supervisor portal and SMS confirmations were delivered to both nurses. All critical care units tomorrow operate at full staffing compliance.`,
          },
        ],
      },
    ],
  },

  // 14. Executive Briefing
  {
    id: "hms-demo-executive-briefing",
    title: "Daily Hospital Operations & Revenue Briefing",
    platformId: "gooddoc-hms",
    agentCategory: "Hospital Executive Operations & Administrative Briefing",
    updatedAt: Date.now() - 1000 * 60 * 240,
    messages: [
      {
        id: "hms-msg-14-u1",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Generate executive summary of hospital operations today: revenue, admissions, surgeries, and critical flags",
          },
        ],
      },
      {
        id: "hms-msg-14-a1",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Hospital operations today delivered ₹42.84 Lakhs in total gross revenue, an 8.2% increase over our 30-day moving average. Outpatient collections contributed ₹14.24 Lakhs, inpatient and insurance settlements contributed ₹21.60 Lakhs, and pharmacy sales brought in ₹7.00 Lakhs.

Total inpatient occupancy stands at 88.7% with 190 occupied beds. Forty-eight admissions were processed alongside 42 successful discharges. The surgical suites completed 26 procedures, including 8 cardiac interventions, 11 orthopedic cases, and 7 laparoscopic surgeries. Zero sentinel clinical events were recorded, and patient satisfaction measured 92.4 on post-consult surveys.`,
          },
        ],
      },
      {
        id: "hms-msg-14-u2",
        role: "user",
        parts: [
          {
            type: "text",
            text: "How does today's bed turnover rate compare to the monthly average?",
          },
        ],
      },
      {
        id: "hms-msg-14-a2",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Today's bed turnover rate reached 0.22, outpacing our monthly benchmark of 0.18 and representing a 22% improvement in bed utilization efficiency. 

Average length of stay remained steady at 3.65 days across all multi-specialty inpatient admissions.`,
          },
        ],
      },
      {
        id: "hms-msg-14-u3",
        role: "user",
        parts: [
          {
            type: "text",
            text: "What are the 3 top operational action items for the morning medical board review?",
          },
        ],
      },
      {
        id: "hms-msg-14-a3",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `First, fast-track four step-down HDU transfers from the cardiac ICU to accommodate three scheduled elective bypass cases tomorrow.

Second, have the medical records officer resolve the 22 outstanding Medi Assist implant sticker queries by 11:00 AM to unlock ₹18.4 Lakhs in pending payments. 

Third, verify the arrival of 150 vials of Noradrenaline from Metro Pharma at 2:00 PM to replenish critical care emergency reserves.`,
          },
        ],
      },
    ],
  },

  // =========================================================================
  // GOODDOC KIOSK (Clean ChatGPT-Style Prose)
  // =========================================================================
  {
    id: "kiosk-demo-1",
    title: "Morning Peak Check-in & Queue Metrics",
    platformId: "gooddoc-kiosk",
    agentCategory: "Patient Self-Service Check-in & Intake Flow Analytics",
    updatedAt: Date.now() - 1000 * 60 * 35,
    messages: [
      {
        id: "kiosk-msg-1-u1",
        role: "user",
        parts: [
          {
            type: "text",
            text: "How many patients checked in via kiosk today and what is the average check-in duration?",
          },
        ],
      },
      {
        id: "kiosk-msg-1-a1",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Between 7:00 AM and 11:30 AM today, self-service kiosks handled 842 patient check-ins, representing 68.4% of all outpatient arrivals across the hospital. 

The average transaction time was 42 seconds per patient. Kiosk 2 in the main atrium was the fastest at 36 seconds, while Kiosk 5 near radiology averaged 58 seconds. During the 8:45 AM rush, Kiosk 3 experienced minor queues due to barcode scanning retries on older cards, which was resolved by switching to registered phone number lookup.`,
          },
        ],
      },
      {
        id: "kiosk-msg-1-u2",
        role: "user",
        parts: [
          {
            type: "text",
            text: "What was the failure or abandonment rate on Kiosk-05 at Radiology?",
          },
        ],
      },
      {
        id: "kiosk-msg-1-a2",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Kiosk 5 handled 128 sessions with 9 abandoned interactions, or a 7% drop-off rate compared to the hospital average of 1.4%. 

Seven of the nine drop-offs occurred during appointment slot selection for ultrasound contrast preparation. We have placed an on-screen prompt advising patients with contrast orders to proceed directly to Counter 4 for fasting verification.`,
          },
        ],
      },
      {
        id: "kiosk-msg-1-u3",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Has queue buildup at Main Atrium subsided for the afternoon shift?",
          },
        ],
      },
      {
        id: "kiosk-msg-1-a3",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `All four kiosks in the main atrium are currently clear with zero queue buildup. Average transaction duration is running at 38 seconds, and all terminals are operating normally.`,
          },
        ],
      },
    ],
  },
  {
    id: "kiosk-demo-2",
    title: "Multilingual Adoption & Language Preference",
    platformId: "gooddoc-kiosk",
    agentCategory: "Multilingual Interface Adoption & Regional Localization",
    updatedAt: Date.now() - 1000 * 60 * 95,
    messages: [
      {
        id: "kiosk-msg-2-u1",
        role: "user",
        parts: [
          {
            type: "text",
            text: "What is the language distribution across kiosk sessions this month?",
          },
        ],
      },
      {
        id: "kiosk-msg-2-a1",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `During October, Tamil was the primary language choice, accounting for 54.2% of all completed kiosk interactions (12,480 sessions) and maintaining the lowest drop-off rate at 1.1% with an average session time of 39 seconds.

English accounted for 31% of sessions (7,120 sessions) with a 2.4% drop-off rate, and Malayalam represented 14.8% (3,410 sessions) with a 1.8% drop-off rate. In addition, 68% of elderly patients using Tamil selected voice narration prompts to assist with token dispatch.`,
          },
        ],
      },
      {
        id: "kiosk-msg-2-u2",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Should we add Telugu language support given our cross-border patient inflow?",
          },
        ],
      },
      {
        id: "kiosk-msg-2-a2",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Adding Telugu is supported by recent demographic data. Approximately 8.4% of oncology and cardiology registrations this month came from neighboring border districts. 

We recommend rolling out Telugu language support on Kiosks 1, 2, and 6 in next Tuesday's regular software update.`,
          },
        ],
      },
    ],
  },
  {
    id: "kiosk-demo-3",
    title: "Hardware Telemetry & Thermal Printer Health",
    platformId: "gooddoc-kiosk",
    agentCategory: "Kiosk Hardware Telemetry & Device Health Monitoring",
    updatedAt: Date.now() - 1000 * 60 * 150,
    messages: [
      {
        id: "kiosk-msg-3-u1",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Are all 18 kiosk thermal printers functioning normally and what are the paper roll levels?",
          },
        ],
      },
      {
        id: "kiosk-msg-3-a1",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `All 18 kiosks are online and reporting normal status. 

Fifteen terminals have over 50% paper capacity remaining. However, Kiosk 4 on the second floor is at 12% capacity with about 40 receipts left, and Kiosk 9 in the pediatrics wing is at 8% capacity with roughly 25 receipts remaining. Internal device temperatures are running in safe ranges between 38 and 44 degrees Celsius.`,
          },
        ],
      },
      {
        id: "kiosk-msg-3-u2",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Dispatch facilities staff to reload Kiosk 04 and 09 immediately.",
          },
        ],
      },
      {
        id: "kiosk-msg-3-a2",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Facilities ticket 9021 was assigned to technician Kumar. Both thermal paper rolls have been replaced, test receipts printed successfully, and paper sensor levels are back at 100%.`,
          },
        ],
      },
    ],
  },

  // =========================================================================
  // A STYLE (Clean ChatGPT-Style Prose)
  // =========================================================================
  {
    id: "astyle-demo-1",
    title: "Weekly Omnichannel GMV & Best Sellers",
    platformId: "a-style",
    agentCategory: "Fashion Retail Sales Velocity & Gross Revenue Performance",
    updatedAt: Date.now() - 1000 * 60 * 65,
    messages: [
      {
        id: "astyle-msg-1-u1",
        role: "user",
        parts: [
          {
            type: "text",
            text: "What is our Gross Merchandise Value (GMV) and top selling apparel lines this week?",
          },
        ],
      },
      {
        id: "astyle-msg-1-a1",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `This week gross merchandise value reached $92,450 across 1,370 fulfilled orders, up 16.4% compared to the same week last year. The average order value was $67.48.

Our direct webstore led revenue at $44,800 (48.5%), retail flagship stores generated $32,150 (34.8%), and the mobile app brought in $15,500 (16.7%). Top performers included the Relaxed French Linen Shirt with 480 units sold, the High-Waisted Pleated Trouser with 340 units, and the Structured Ribbed Knit Cardigan with 220 units.`,
          },
        ],
      },
      {
        id: "astyle-msg-1-u2",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Which collection yielded the highest gross profit margin?",
          },
        ],
      },
      {
        id: "astyle-msg-1-a2",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `The linen apparel collection delivered the highest overall margin at 68.4%, benefiting from favorable raw fabric procurement and strong full-price sell-through without markdowns. 

Knitwear recorded a 58.2% margin, while accessories achieved a 72% margin on lower volume.`,
          },
        ],
      },
    ],
  },
  {
    id: "astyle-demo-2",
    title: "Warehouse Stockout & Store Transfer Plan",
    platformId: "a-style",
    agentCategory: "Apparel Warehouse Stock Levels & Size-Curve Inventory Control",
    updatedAt: Date.now() - 1000 * 60 * 135,
    messages: [
      {
        id: "astyle-msg-2-u1",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Identify stockouts and low inventory across our top 5 best sellers",
          },
        ],
      },
      {
        id: "astyle-msg-2-a1",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `The relaxed French linen shirt in Sage, size medium, is currently out of stock at the central fulfillment warehouse. The high-waisted pleated trouser in Charcoal, size small, has only 4 units remaining.

However, our Bandha flagship retail store holds 45 units of the Sage linen shirt in medium that have seen zero local sales over the past ten days. Transferring 30 units from Bandha to the central warehouse will replenish online stock ahead of the weekend promotion.`,
          },
        ],
      },
      {
        id: "astyle-msg-2-u2",
        role: "user",
        parts: [
          {
            type: "text",
            text: "Generate the inter-store inventory transfer request for Bandha Branch.",
          },
        ],
      },
      {
        id: "astyle-msg-2-a2",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: `Transfer request 4402 has been generated to move 30 units of the linen shirt from the Bandha store to the central e-commerce hub. Courier pickup is scheduled for 3:00 PM today, with delivery to the central facility by tomorrow morning.`,
          },
        ],
      },
    ],
  },
];

export function loadThreads(): ChatThread[] {
  try {
    const rawV6 = localStorage.getItem(key);
    if (!rawV6) {
      // Migrate from prior versions if present, while ensuring all updated DEFAULT_DEMO_THREADS exist
      const rawOld =
        localStorage.getItem(legacyV5Key) ??
        localStorage.getItem(legacyV4Key) ??
        localStorage.getItem(legacyV3Key) ??
        localStorage.getItem(legacyV2Key) ??
        localStorage.getItem(legacyV1Key) ??
        localStorage.getItem(legacyKey);

      let existingCustomThreads: ChatThread[] = [];
      if (rawOld) {
        try {
          const parsed = JSON.parse(rawOld);
          if (Array.isArray(parsed)) {
            existingCustomThreads = parsed.filter(
              (t) =>
                typeof t?.id === "string" &&
                !t.id.startsWith("hms-demo-") &&
                !t.id.startsWith("kiosk-demo-") &&
                !t.id.startsWith("astyle-demo-"),
            );
          }
        } catch {
          // ignore parsing error
        }
      }
      const initial = [...DEFAULT_DEMO_THREADS, ...existingCustomThreads];
      saveThreads(initial);
      return initial;
    }

    const value: unknown = JSON.parse(rawV6);
    if (Array.isArray(value)) {
      const parsed = value.filter(
        (t): t is ChatThread =>
          typeof t?.id === "string" && typeof t?.title === "string" && Array.isArray(t?.messages),
      );

      // Verify that all 14 GoodDoc HMS threads and Kiosk / A-Style threads exist
      const existingIds = new Set(parsed.map((t) => t.id));
      const missingDemo = DEFAULT_DEMO_THREADS.filter((d) => !existingIds.has(d.id));

      if (missingDemo.length > 0) {
        const combined = [...parsed, ...missingDemo];
        saveThreads(combined);
        return combined;
      }
      return parsed;
    }
    saveThreads(DEFAULT_DEMO_THREADS);
    return DEFAULT_DEMO_THREADS;
  } catch {
    return DEFAULT_DEMO_THREADS;
  }
}

export function saveThreads(threads: ChatThread[]) {
  try {
    localStorage.setItem(key, JSON.stringify(threads));
  } catch {
    // ignore local storage errors
  }
}

export function createThread(platformId?: string, agentCategory?: string): ChatThread {
  return {
    id: crypto.randomUUID(),
    title: agentCategory ? `${agentCategory}` : "New conversation",
    updatedAt: Date.now(),
    messages: [],
    platformId,
    agentCategory,
  };
}

export const chatMeta = (title: string, description: string) => ({
  meta: [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});
