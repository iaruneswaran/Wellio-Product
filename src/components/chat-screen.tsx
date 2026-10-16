import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import type { UIMessage } from "ai";
import {
  ArrowLeft,
  ArrowUp,
  Check,
  ChevronLeft,
  Copy,
  Download,
  MessageSquare,
  Mic,
  PanelLeft,
  Paperclip,
  PenLine,
  Search,
  Share2,
  Square,
  Trash2,
  Volume2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { createThread, loadThreads, saveThreads, type ChatThread } from "@/lib/chat-store";
import {
  PLATFORMS_DATA,
  findPlatform,
  type AgentCategoryItem,
  type PlatformItem,
} from "@/lib/agents-data";
import { AgentPlatformSelector } from "@/components/agent-platform-selector";

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

function Brand({ small = false }: { small?: boolean }) {
  return (
    <span className={`font-display font-semibold ${small ? "text-xl" : "text-3xl"}`}>
      wellio<span className="text-ink-soft">.</span>
    </span>
  );
}

function PurpleNoiseOrb({
  convState,
  waveBars,
}: {
  convState: "listening" | "thinking" | "speaking";
  waveBars: number[];
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      // Very smooth, slow organic drift
      time += 0.006;
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      // Gentle audio energy modulation
      let energy = 0;
      if (waveBars.length > 0) {
        const sum = waveBars.reduce((acc, v) => acc + v, 0);
        energy = Math.min(0.8, (sum / waveBars.length) / 16);
      }
      if (convState === "speaking") energy = 0.3 + Math.sin(time * 1.5) * 0.15;
      if (convState === "thinking") energy = 0.18 + Math.sin(time * 1.0) * 0.1;

      // 1. Base vertical gradient: top deeper violet, bottom slightly bright
      const baseGrad = ctx.createLinearGradient(0, 0, 0, height);
      baseGrad.addColorStop(0, "#4830CB"); // Top: deep electric violet
      baseGrad.addColorStop(0.45, "#5B42E4"); // Mid: rich purple
      baseGrad.addColorStop(1, "#836CFB"); // Bottom: slightly bright luminous violet
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Bottom-focused luminous glow (light bottom slightly bright)
      const sx1 = cx + Math.sin(time * 0.7) * (18 + energy * 6);
      const sy1 = height - 8 + Math.cos(time * 0.5) * 3; // Centered near the bottom
      const bottomGrad = ctx.createRadialGradient(sx1, sy1, 4, cx, height - 6, 85 + energy * 8);
      bottomGrad.addColorStop(0, "#9A85FE"); // Soft bright lilac-violet along bottom
      bottomGrad.addColorStop(0.35, "#826DF6"); // Luminous purple
      bottomGrad.addColorStop(0.7, "#6047E8"); // Electric violet
      bottomGrad.addColorStop(1, "rgba(72, 48, 203, 0)"); // Fades towards the top
      ctx.fillStyle = bottomGrad;
      ctx.fillRect(0, 0, width, height);

      // 3. Subtle bottom inner rim contour glow
      const rimGrad = ctx.createLinearGradient(0, height - 16, 0, height);
      rimGrad.addColorStop(0, "rgba(165, 148, 254, 0)");
      rimGrad.addColorStop(1, "rgba(180, 165, 255, 0.45)");
      ctx.fillStyle = rimGrad;
      ctx.fillRect(0, height - 16, width, 16);

      // 4. Subtle secondary horizontal sheen drift
      const sx2 = cx + Math.cos(time * 0.6) * 22;
      const sy2 = height * 0.65 + Math.sin(time * 0.75) * 4;
      const grad2 = ctx.createRadialGradient(sx2, sy2, 2, sx2, sy2, 44);
      grad2.addColorStop(0, "rgba(152, 137, 253, 0.35)");
      grad2.addColorStop(0.55, "rgba(118, 95, 246, 0.15)");
      grad2.addColorStop(1, "rgba(91, 67, 236, 0)");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // 5. Authentic fine stardust noise grain matching reference image
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      const len = data.length;
      const noiseLevel = 18; // Clean, uniform stardust noise grain

      for (let i = 0; i < len; i += 4) {
        const grain = (Math.random() - 0.5) * noiseLevel;
        const r = data[i] ?? 0;
        const g = data[i + 1] ?? 0;
        const b = data[i + 2] ?? 0;
        data[i] = Math.max(0, Math.min(255, r + grain * 0.85));
        data[i + 1] = Math.max(0, Math.min(255, g + grain * 0.85));
        data[i + 2] = Math.max(0, Math.min(255, b + grain * 1.15));
      }
      ctx.putImageData(imgData, 0, 0);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [convState, waveBars]);

  return (
    <canvas
      ref={canvasRef}
      width={160}
      height={72}
      className="size-full rounded-full object-cover pointer-events-none"
    />
  );
}

function generateAnswer(query: string, agentCategory?: string, _platformId?: string): string {
  const q = query.trim().toLowerCase();

  // Greeting & basic queries
  if (/^(hi|hello|hey|sup|good morning|good afternoon|good evening)\b/i.test(q)) {
    if (agentCategory) {
      return `Hello! How can I help you analyze data, review trends, or generate insights for ${agentCategory} today?`;
    }
    return "Hello! How can I help you explore your ideas or review your operations today?";
  }

  // GoodDoc HMS domain responses
  if (
    agentCategory === "Patient Demographics & Cohort Retention Analytics" ||
    agentCategory === "Patient Insights" ||
    /patient|demographics|visit frequency/i.test(q)
  ) {
    return "Over the past 30 days, outpatient visits split into 42% new patient registrations (318 patients) and 58% returning visits (439 patients).\n\nThe primary age group is 28 to 45 years, accounting for 46% of total visits, followed by 46 to 60 years at 31%. Geographically, 68% of patients reside in the local metro cluster and 32% come from regional referrals.\n\nFor chronic care clinics, the average visit interval is 4.2 weeks, while general outpatient clinics see an average recurrence of 2.1 visits annually. Let me know if you would like to explore a department-level cohort breakdown.";
  }
  if (
    agentCategory === "Outpatient Appointment & Scheduling Operations" ||
    agentCategory === "Appointment Management" ||
    /appointment|no-show|cancellation/i.test(q)
  ) {
    return "This week we recorded 1,280 scheduled appointments across all outpatient clinics. 88.4% of consultations were completed successfully, while cancellations stood at 7.0%, mainly concentrated in weekday evening slots.\n\nOur unnotified no-show rate is down to 4.6% following automated WhatsApp reminders. Additionally, 83% of patients completed their recommended follow-up appointments within the advised 14-day window. We can also turn on standby slot reallocation to backfill last-minute cancellations.";
  }
  if (
    agentCategory === "Specialist Consultation & Clinical Workload Performance" ||
    agentCategory === "Doctor Insights" ||
    /doctor|consultation count|workload/i.test(q)
  ) {
    return "Across our 24 active clinical specialists, 842 consultations were completed this week with an average consult duration of 16.4 minutes per patient.\n\nCardiology and Orthopedics are operating near peak capacity at 94% slot utilization, while Pediatrics is running at 78%. Interventional Cardiology and General Surgery generated the highest outpatient contribution this cycle. We recommend adjusting morning scheduling buffers to relieve peak queue pressure on senior consultants.";
  }
  if (
    agentCategory === "Clinical Department Performance & Specialty Utilization" ||
    agentCategory === "Department Insights" ||
    /department|radiology|lab performance|op vs ip/i.test(q)
  ) {
    return "Outpatient clinic volume increased 8% week-over-week while inpatient admissions remained stable with an overall bed utilization of 84%.\n\nRadiology completed 312 MRI and CT scans with an average report turnaround time of 2.4 hours. The clinical laboratory processed 2,840 diagnostic panels with 99.1% on-time delivery. At the pharmacy, the average prescription dispensing time is currently 4.8 minutes per patient.";
  }
  if (
    agentCategory === "Hospital Billing, Revenue & Insurance Claims Management" ||
    agentCategory === "Financial Insights" ||
    /financial|revenue|billing|insurance/i.test(q)
  ) {
    return "Gross collections reached ₹14.2 Lakhs today, with ₹9.8 Lakhs processed through digital UPI and card gateways and ₹4.4 Lakhs in cash receipts.\n\nInsurance claims pending insurer adjudication total ₹4.8 Lakhs, with an average reimbursement cycle of 11 days. Accounts receivable aging past 30 days dropped by 14% this month, and inpatient discharge billing clearance is currently averaging 38 minutes per case.";
  }
  if (
    agentCategory === "Hospital Pharmacy Inventory & Formulary Management" ||
    agentCategory === "Pharmacy Intelligence" ||
    /pharmacy|medicine|low stock|expiry/i.test(q)
  ) {
    return "The pharmacy dispensed 1,140 prescriptions today with daily medicine revenue reaching ₹2.89 Lakhs.\n\nSix essential formulations are currently below buffer reorder points, including Amoxicillin 500mg and Atorvastatin 20mg. In addition, 4 batches expiring within the next 30 days have been flagged for priority inventory rotation or supplier return. Our top 20 fast-moving drugs continue to maintain an 18-day turnover velocity.";
  }
  if (
    agentCategory === "Diagnostic Laboratory & Pathology Operations Analytics" ||
    agentCategory === "Laboratory Intelligence" ||
    /laboratory|test volume|delay/i.test(q)
  ) {
    return "The pathology laboratory processed 1,480 samples over the past 24 hours, with 95.8% of tests verified and reported within the standard turnaround time benchmark.\n\nHistopathology cultures are currently experiencing an average delay of 3.2 hours due to specialized tissue staining procedures. Overall diagnostics revenue rose 6.4% month-over-month, primarily driven by annual preventive executive health checkups.";
  }
  if (
    agentCategory === "Inpatient Bed Census & Ward Admission Analytics" ||
    agentCategory === "Bed & Admission Analytics" ||
    /bed|occupancy|admission|discharge/i.test(q)
  ) {
    return "Overall inpatient bed occupancy is at 83.5%, with the Medical ICU at 91.2%, Semi-Private rooms at 85.0%, and General Medical Wards at 78.4%.\n\nCurrently, 214 beds are occupied and 42 beds remain available for emergency admissions. We have recorded 28 admissions and 31 planned discharges today, with an average length of stay steady at 3.7 days across specialties.";
  }
  if (
    agentCategory === "Outpatient Queue Flow & Patient Waiting Time Analysis" ||
    agentCategory === "Queue & Waiting Analysis" ||
    /queue|waiting time|bottleneck|token/i.test(q)
  ) {
    return "Patients currently wait an average of 14.8 minutes from token generation to initial nursing triage assessment, followed by an 18.2-minute queue before entering doctor consultation.\n\nThe highest patient volume occurs between 09:30 AM and 11:15 AM in Outpatient Blocks B and C. Across all 8 active consultation suites, our average token processing velocity is 118 tokens per hour.";
  }
  if (
    agentCategory === "Front Office Operations & Patient Administration Productivity" ||
    agentCategory === "Operational Efficiency" ||
    /operational|registration|productivity/i.test(q)
  ) {
    return "Front desk registration currently averages 2.6 minutes per patient, while inpatient insurance billing takes approximately 4.1 minutes per settlement.\n\nFront office staff utilization is running at an optimal 86% index. Recent rollout of digital mobile pre-registration has helped reduce lobby congestion by approximately 22%.";
  }
  if (
    agentCategory === "End-to-End Outpatient Care Journey & Milestone Tracking" ||
    agentCategory === "Patient Journey" ||
    /patient journey|timeline/i.test(q)
  ) {
    return "For standard outpatient visits, the total journey duration averages around 60 minutes from arrival to departure.\n\nRegistration takes about 3 minutes, vitals check takes 7 minutes, lounge waiting averages 14 minutes, doctor consultation runs 17 minutes, diagnostic tests take 11 minutes, and pharmacy settlement concludes in under 8 minutes.";
  }
  if (
    agentCategory === "Medical Records Audit & Healthcare Regulatory Compliance" ||
    agentCategory === "Compliance & Audit" ||
    /compliance|audit|records/i.test(q)
  ) {
    return "Clinical documentation compliance is currently at 97.4% across all inpatient medical records. Eight discharge summaries are awaiting final physician sign-off.\n\nZero unauthorized record access attempts have been logged over the past 30 days, and our current NABH protocol adherence score stands at 96.8%.";
  }
  if (
    agentCategory === "Clinical Workflow Optimization & Resource Allocation" ||
    agentCategory === "AI Recommendations" ||
    /recommendation|staffing|workflow/i.test(q)
  ) {
    return "Based on census forecasts, we recommend reassigning 2 staff nurses from Ward D to Emergency Care during the projected 18:00 to 22:00 surge.\n\nAdditionally, implementing 15-minute staggered buffers for Cardiology clinics will help flatten morning queue peaks, and auto-reorders should be initiated for four seasonal antibiotics.";
  }
  if (
    agentCategory === "Hospital Executive Operations & Administrative Briefing" ||
    agentCategory === "Executive Briefing" ||
    /executive|briefing|summary/i.test(q)
  ) {
    return "Hospital operations today generated ₹42.8 Lakhs in gross revenue with 912 total patients served across outpatient and inpatient departments. Inpatient bed occupancy closed at 84% with zero sentinel safety incidents.\n\nPatient satisfaction stands strong at a 91.4 net promoter score, and 38 surgical procedures are scheduled across our 6 operating suites for tomorrow.";
  }

  // GoodDoc Kiosk domain responses
  if (
    agentCategory === "Patient Self-Service Check-in & Intake Flow Analytics" ||
    agentCategory === "Check-in Analytics" ||
    /check-in|checkin time/i.test(q)
  ) {
    return "Self-service kiosks processed 1,420 patient check-ins today, accounting for 68% of all hospital outpatient arrivals. The average check-in time was 44 seconds per patient, with an error redirection rate of just 1.2%.";
  }
  if (
    agentCategory === "Kiosk Queue Throughput & Waiting Time Intelligence" ||
    agentCategory === "Queue Insights" ||
    /kiosk.*queue|busiest hours/i.test(q)
  ) {
    return "Kiosk traffic peaked between 08:30 AM and 10:15 AM in the morning and 02:00 PM to 03:30 PM in the afternoon. Average queue length remained at 1.3 patients per terminal, with all tokens syncing instantly to the overhead LED displays.";
  }
  if (
    agentCategory === "Self-Service Kiosk Feature Adoption & Module Utilization" ||
    agentCategory === "Feature Usage" ||
    /feature usage|reports|booking/i.test(q)
  ) {
    return "Out of all kiosk interactions, 56% were check-in and token generation, 19% were bill payments via UPI or card, 14% were diagnostic report printouts, 7% were appointment bookings, and 4% used hospital wayfinding.";
  }
  if (
    agentCategory === "Kiosk Hardware Telemetry & Device Health Monitoring" ||
    agentCategory === "Device Health" ||
    /device health|printer status|scanner/i.test(q)
  ) {
    return "All 18 kiosks are online and fully operational. Thermal printer paper levels are healthy on 16 machines, with two units in Lobby B and Floor 2 flagged for paper roll replenishment. All scanners and hardware temperatures are within normal thresholds.";
  }
  if (
    agentCategory === "Patient Self-Service UX Friction & Drop-off Analysis" ||
    agentCategory === "User Experience" ||
    /drop-off|failed sessions|friction/i.test(q)
  ) {
    return "Overall self-service completion rate is 94.6%. The primary abandonment point was identified at the secondary insurance card upload screen (3.8% drop-off), where camera glare caused verification timeouts. A simplified numeric policy entry has reduced retries by 42%.";
  }
  if (
    agentCategory === "Multilingual Interface Adoption & Regional Localization" ||
    agentCategory === "Language Insights" ||
    /language|tamil|malayalam|english/i.test(q)
  ) {
    return "Tamil accounted for 54% of completed kiosk sessions, followed by English at 31% and Malayalam at 15%. Sessions conducted in Tamil had the lowest drop-off rate at 1.1%, and audio prompts were well received by senior patients.";
  }
  if (
    agentCategory === "Kiosk Digital Billing Collections & Payment Reconciliation" ||
    agentCategory === "Payment Analytics" ||
    /kiosk.*collection|kiosk.*payment/i.test(q)
  ) {
    return "Kiosks processed ₹3.42 Lakhs in outpatient collections today across 428 transactions. UPI QR was the preferred method at 67%, debit cards at 24%, and credit cards at 9%. Zero payment gateway reconciliation failures were logged today.";
  }
  if (
    agentCategory === "Self-Service Milestone Velocity & Step-by-Step Dwell Times" ||
    agentCategory === "Patient Journey" ||
    /dwell time|milestone/i.test(q)
  ) {
    return "Average time spent per milestone: patient identification via mobile number takes 11 seconds, specialist doctor and slot selection takes 18 seconds, payment takes 14 seconds, and token printing takes 3 seconds.";
  }
  if (
    agentCategory === "Multi-Facility Terminal Utilization & Campus Foot-Traffic Performance" ||
    agentCategory === "Location Performance" ||
    /location performance|campus foot/i.test(q)
  ) {
    return "Main Campus Lobby A kiosks achieved the highest utilization at 88% capacity with 620 check-ins, while OPD Block C terminals ran at 52%. We recommend relocating one terminal from Block C to the Emergency entrance to balance peak morning intake.";
  }
  if (
    agentCategory === "Self-Service Adoption Trajectory & Long-Term Growth Analytics" ||
    agentCategory === "Usage Trends" ||
    /usage trends|adoption trajectory/i.test(q)
  ) {
    return "Patient self-service adoption has grown from 44% to 68% over the past quarter. Repeat visitors show an 82% preference for kiosk intake, saving an estimated 8.4 minutes per patient compared to traditional reception desks.";
  }
  if (
    agentCategory === "Lobby Service Optimization & Terminal Workflow Engineering" ||
    agentCategory === "Service Optimization" ||
    /service optimization|terminal workflow/i.test(q)
  ) {
    return "By pre-populating doctor appointments based on registered patient mobile numbers, we reduced slot selection screen time from 26 seconds to 11 seconds, increasing morning terminal throughput by 28%.";
  }
  if (
    agentCategory === "Predictive Device Maintenance & Kiosk Servicing Alerts" ||
    agentCategory === "Maintenance Alerts" ||
    /maintenance alert|hardware diagnostics/i.test(q)
  ) {
    return "All touchscreens and barcode scanners are fully operational. Terminal K-04 in Lobby B has reached 4,890 receipt cuts and is scheduled for preventative blade cleaning tonight. No hardware faults or network packet drops are present.";
  }

  // A Style domain responses
  if (
    agentCategory === "Fashion Retail Sales Velocity & Gross Revenue Performance" ||
    agentCategory === "Sales Insights" ||
    /sales|revenue|orders|gmv/i.test(q)
  ) {
    return "Weekly gross merchandise value reached $86,400 across 1,280 fulfilled orders, representing a 14.2% increase year-over-year. Average order value is $67.50, led by online webstore sales at 48% and retail flagship stores at 36%.";
  }
  if (
    agentCategory === "Garment SKU Sell-Through Velocity & Assortment Performance" ||
    agentCategory === "Product Performance" ||
    /product performance|sell-through|best sellers/i.test(q)
  ) {
    return "Our relaxed linen button-down shirt is the top performing silhouette this month with an 88% sell-through rate across neutral and indigo colorways. Conversely, 4 tailored polyester blazer SKUs have experienced zero sales in 45 days and are marked for markdown clearance.";
  }
  if (
    agentCategory === "Apparel Warehouse Stock Levels & Size-Curve Inventory Control" ||
    agentCategory === "Inventory Intelligence" ||
    /inventory|dead stock|stockout/i.test(q)
  ) {
    return "Sizes M and L in our relaxed linen shirt line are currently below safety buffer stock in the central warehouse. We recommend transferring 30 surplus units from the Bandha retail branch to prevent online stockouts ahead of the weekend.";
  }
  if (
    agentCategory === "Apparel Return Diagnostics & Sizing Discrepancy Intelligence" ||
    agentCategory === "Return Intelligence" ||
    /return.*reason|return rate/i.test(q)
  ) {
    return "The overall return rate currently stands at 16.4%, down 2.8% following the implementation of updated sleeve length and chest fit guides. 58% of returns cite chest tightness on slim-cut shirts, while fabric defect returns remain under 0.8%.";
  }
  if (
    agentCategory === "Customer Cohort Retention & Fashion Lifetime Value Analytics" ||
    agentCategory === "Customer Insights" ||
    /customer insights|repeat buyer|ltv/i.test(q)
  ) {
    return "Our 60-day repeat purchase rate reached 34.2%, with Gold Tier VIP members spending an average of $210 per transaction. Top cross-category purchases combine casual trousers with organic cotton tees.";
  }
  if (
    agentCategory === "Multi-Channel Order Fulfillment & Dispatch Pipeline Operations" ||
    agentCategory === "Order Management" ||
    /order management|fulfillment status|cancellation/i.test(q)
  ) {
    return "98.2% of orders placed before 14:00 were dispatched same-day. The warehouse picking backlog is currently 42 orders, well within the 2-hour target buffer. Average national transit duration is 2.8 days.";
  }
  if (
    agentCategory === "Omnichannel Retail & Digital Marketplace Channel Performance" ||
    agentCategory === "Store Performance" ||
    /store performance|channel performance/i.test(q)
  ) {
    return "Direct-to-consumer website sales generated 52% of total retail margin, followed by the Mumbai flagship boutique at 31% and third-party marketplaces at 17%. The flagship store achieved $420 in sales per square foot this month.";
  }
  if (
    agentCategory === "Apparel Department Performance & Collection Revenue Contribution" ||
    agentCategory === "Category Analysis" ||
    /category analysis|department performance/i.test(q)
  ) {
    return "Women's Contemporary Apparel led revenue at 56%, Men's Casual Wear contributed 32%, and Children's Essentials made up 12%. Casual linen trousers saw the fastest week-over-week acceleration (+24%).";
  }
  if (
    agentCategory === "Seasonal Demand Projections & Fabric Sourcing Requirements" ||
    agentCategory === "Demand Forecasting" ||
    /demand forecasting|fabric sourcing/i.test(q)
  ) {
    return "Projected demand for the upcoming festive capsule requires 4,200 meters of premium slub cotton and 1,800 meters of raw mulberry silk. Mill fabric orders have been placed with an estimated delivery window of 18 days.";
  }
  if (
    agentCategory === "Fashion Trend Velocity, Color Palette & Silhouette Analytics" ||
    agentCategory === "Trend Analysis" ||
    /trend analysis|color palette|silhouette/i.test(q)
  ) {
    return "Earth tones (Sage Green, Sandstone, Terracotta) represent 44% of total customer search queries. Boxy crop shirts and pleated relaxed trousers are our fastest trending silhouette combinations.";
  }
  if (
    agentCategory === "Assortment Merchandising & Store Allocation Optimization" ||
    agentCategory === "Merchandising" ||
    /merchandising|assortment mix/i.test(q)
  ) {
    return "We recommend a 60/40 core-to-fashion assortment mix for our urban retail stores. Reallocating 50 units of summer lightweight cardigans to southern outlets will optimize full-price sell-through before monsoon clearance.";
  }

  return `Here is the operational overview for ${agentCategory || "your department"}. All systems are performing normally, workflows are on schedule, and no critical incidents are currently flagged. Let me know what specific metric or report you would like to explore.`;
}

function getThreadPlatformId(t: ChatThread): string {
  if (t.platformId) return t.platformId;
  const cat = t.agentCategory || "";
  const title = t.title || "";
  for (const p of PLATFORMS_DATA) {
    if (p.agents.some((a) => a.category === cat || title.includes(a.category))) {
      return p.id;
    }
  }
  return "gooddoc-hms";
}

export function ChatScreen({ threadId }: { threadId?: string }) {
  const navigate = useNavigate();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [ready, setReady] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [isShared, setIsShared] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const thinkingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  // Two voice action modes:
  // "idle": normal composer
  // "dictation": Speech-to-text dictation that transcribes voice and auto-sends
  // "conversation": Continuous hands-free Voice-to-Voice AI conversation (with soundwave animation, in place)
  const [voiceMode, setVoiceMode] = useState<"idle" | "dictation" | "conversation">("idle");
  const [convState, setConvState] = useState<"listening" | "thinking" | "speaking">("listening");
  const [liveVoiceTranscript, setLiveVoiceTranscript] = useState("");
  const [aiSpeakingSnippet, setAiSpeakingSnippet] = useState("");
  const [dictationText, setDictationText] = useState("");
  const voiceModeRef = useRef<"idle" | "dictation" | "conversation">("idle");
  const convStateRef = useRef<"listening" | "thinking" | "speaking">("listening");
  const autoSendTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const [waveBars, setWaveBars] = useState<number[]>(() => new Array(68).fill(3));

  // Keep refs in sync with state
  useEffect(() => {
    voiceModeRef.current = voiceMode;
  }, [voiceMode]);

  useEffect(() => {
    convStateRef.current = convState;
  }, [convState]);

  // In-place question editing state
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Platform selection state
  const [activePlatformId, setActivePlatformId] = useState<string>("gooddoc-hms");

  useEffect(() => {
    return () => {
      if (thinkingTimer.current) clearTimeout(thinkingTimer.current);
      if (autoSendTimerRef.current) clearTimeout(autoSendTimerRef.current);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
        } catch {
          // ignore
        }
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore error on stop
        }
      }
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        try {
          audioContextRef.current.close();
        } catch {
          // ignore error on close
        }
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Audio wave visualizer effect: active whenever voiceMode is NOT idle
  useEffect(() => {
    if (voiceMode === "idle") {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
        micStreamRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        try {
          audioContextRef.current.close();
        } catch {
          // ignore error on close
        }
        audioContextRef.current = null;
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      setWaveBars(new Array(68).fill(3));
      return;
    }

    let isCancelled = false;
    let fallbackInterval: ReturnType<typeof setInterval> | null = null;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          if (isCancelled) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          micStreamRef.current = stream;
          const AudioCtx =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
          if (!AudioCtx) return;

          const ctx = new AudioCtx();
          audioContextRef.current = ctx;
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 64;
          analyser.smoothingTimeConstant = 0.5;

          const source = ctx.createMediaStreamSource(stream);
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          const updateWave = () => {
            if (isCancelled) return;

            // When AI is speaking, drive visualizer with fluid speech rhythm
            if (convStateRef.current === "speaking") {
              const time = Date.now() / 90;
              const nextBars = new Array(68).fill(3);
              for (let i = 0; i < 68; i++) {
                const wave1 = Math.sin((i / 68) * Math.PI * 4 + time * 1.4);
                const wave2 = Math.cos((i / 68) * Math.PI * 2.5 - time * 0.9);
                const packet = Math.max(0, wave1 * wave2);
                const barHeight = 4 + packet * 24;
                nextBars[i] = Math.max(3, Math.min(26, Math.round(barHeight)));
              }
              setWaveBars(nextBars);
              animFrameRef.current = requestAnimationFrame(updateWave);
              return;
            }

            // When AI is thinking, show gentle breathing pulse
            if (convStateRef.current === "thinking") {
              const time = Date.now() / 250;
              const nextBars = new Array(68).fill(3);
              for (let i = 0; i < 68; i++) {
                const val = 4 + (Math.sin(time + i * 0.15) + 1) * 3;
                nextBars[i] = Math.round(val);
              }
              setWaveBars(nextBars);
              animFrameRef.current = requestAnimationFrame(updateWave);
              return;
            }

            // Normal microphone frequency data
            analyser.getByteFrequencyData(dataArray);

            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i] ?? 0;
            }
            const avg = sum / dataArray.length;
            const norm = Math.min(1, avg / 35);

            const nextBars = new Array(68).fill(3);
            if (norm > 0.05) {
              const time = Date.now() / 120;
              for (let i = 0; i < 68; i++) {
                const wave1 = Math.sin((i / 68) * Math.PI * 3 + time);
                const wave2 = Math.cos((i / 68) * Math.PI * 4 - time * 0.7);
                const packet = Math.max(0, wave1 * wave2);
                const barHeight = 3 + packet * norm * 26;
                nextBars[i] = Math.max(3, Math.min(26, Math.round(barHeight)));
              }
            }
            setWaveBars(nextBars);
            animFrameRef.current = requestAnimationFrame(updateWave);
          };

          updateWave();
        })
        .catch(() => {
          runSimulation();
        });
    } else {
      runSimulation();
    }

    function runSimulation() {
      let step = 0;
      fallbackInterval = setInterval(() => {
        if (isCancelled) return;
        step += 1;
        const isSpeaking = step % 9 < 6;
        const nextBars = new Array(68).fill(3);
        if (isSpeaking) {
          const center1 = (Math.sin(step * 0.35) * 0.3 + 0.38) * 68;
          const center2 = (Math.cos(step * 0.28) * 0.2 + 0.72) * 68;
          for (let i = 0; i < 68; i++) {
            const d1 = Math.abs(i - center1);
            const d2 = Math.abs(i - center2);
            const g1 = Math.exp(-(d1 * d1) / 16) * 24;
            const g2 = Math.exp(-(d2 * d2) / 14) * 20;
            const val = 3 + Math.max(g1, g2) * (0.65 + Math.random() * 0.35);
            nextBars[i] = Math.max(3, Math.min(26, Math.round(val)));
          }
        }
        setWaveBars(nextBars);
      }, 85);
    }

    return () => {
      isCancelled = true;
      if (fallbackInterval) clearInterval(fallbackInterval);
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
        micStreamRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        try {
          audioContextRef.current.close();
        } catch {
          // ignore error on close
        }
        audioContextRef.current = null;
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [voiceMode]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...files]);
    }
  }

  function removeAttachment(index: number) {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }

  // Speak AI response using native browser SpeechSynthesis
  function speakVoiceResponse(text: string, onEnd: () => void) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setTimeout(onEnd, 3000);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const cleanText = text
        .replace(/[*_#`~>]/g, "")
        .replace(/\[Attached:[^\]]+\]/g, "")
        .replace(/\[.*?\]\(.*?\)/g, "")
        .replace(/₹/g, "rupees ")
        .replace(/%/g, " percent ")
        .trim();

      const sentences = cleanText.split(/(?<=[.?!])\s+/);
      const spokenPart = sentences.slice(0, 3).join(" ") || cleanText;

      const utterance = new SpeechSynthesisUtterance(spokenPart);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.lang = "en-US";

      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(
        (v) =>
          (v.lang.startsWith("en") &&
            (v.name.includes("Natural") ||
              v.name.includes("Google") ||
              v.name.includes("Samantha") ||
              v.name.includes("Jenny") ||
              v.name.includes("Aria"))) ||
          v.lang === "en-US",
      );
      if (naturalVoice) utterance.voice = naturalVoice;

      utterance.onend = () => {
        onEnd();
      };
      utterance.onerror = () => {
        onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      onEnd();
    }
  }

  // Action 1: Voice to text format and send
  function startDictation() {
    stopVoiceSession();
    setVoiceMode("dictation");
    voiceModeRef.current = "dictation";
    setDictationText("");

    const win = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionInstance;
      webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
    };
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: SpeechRecognitionEventLike) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i]?.[0]?.transcript ?? "";
          }
          if (transcript.trim()) {
            setDictationText(transcript.trim());

            // Auto-send debounce: if user finishes speaking and pauses for 1.8s, automatically send!
            if (autoSendTimerRef.current) clearTimeout(autoSendTimerRef.current);
            autoSendTimerRef.current = setTimeout(() => {
              handleStopDictation(true, transcript.trim());
            }, 1800);
          }
        };

        recognition.onerror = () => {
          // ignore or retry
        };

        recognition.onend = () => {
          if (voiceModeRef.current === "dictation") {
            try {
              recognition.start();
            } catch {
              // ignore
            }
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch {
        runDictationFallback();
      }
    } else {
      runDictationFallback();
    }
  }

  function runDictationFallback() {
    setTimeout(() => {
      const sample = active?.agentCategory
        ? `Analyze latest operational insights for ${active.agentCategory}`
        : "Show today's operational summary";
      setDictationText(sample);
      if (autoSendTimerRef.current) clearTimeout(autoSendTimerRef.current);
      autoSendTimerRef.current = setTimeout(() => {
        handleStopDictation(true, sample);
      }, 2000);
    }, 1200);
  }

  function handleStopDictation(shouldSend: boolean, fallbackText?: string) {
    if (autoSendTimerRef.current) clearTimeout(autoSendTimerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    const textToSend = (fallbackText || dictationText).trim();
    setVoiceMode("idle");
    voiceModeRef.current = "idle";
    setDictationText("");

    if (shouldSend && textToSend) {
      send(textToSend);
    }
  }

  // Action 2: Voice-to-voice AI Conversation Mode (In-place, animated, hands-free)
  function startVoiceToVoice() {
    stopVoiceSession();
    setVoiceMode("conversation");
    voiceModeRef.current = "conversation";
    setConvState("listening");
    convStateRef.current = "listening";
    setLiveVoiceTranscript("");
    setAiSpeakingSnippet("");

    startConversationRecognition();
  }

  function startConversationRecognition() {
    const win = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionInstance;
      webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
    };
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: SpeechRecognitionEventLike) => {
          if (convStateRef.current !== "listening") return;
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i]?.[0]?.transcript ?? "";
          }
          if (transcript.trim()) {
            setLiveVoiceTranscript(transcript.trim());

            // User pause detection: if user finishes speaking sentence, trigger AI response!
            if (autoSendTimerRef.current) clearTimeout(autoSendTimerRef.current);
            autoSendTimerRef.current = setTimeout(() => {
              if (voiceModeRef.current === "conversation" && convStateRef.current === "listening") {
                handleConversationQuery(transcript.trim());
              }
            }, 1600);
          }
        };

        recognition.onerror = () => {
          // ignore or retry
        };

        recognition.onend = () => {
          if (voiceModeRef.current === "conversation" && convStateRef.current === "listening") {
            try {
              recognition.start();
            } catch {
              // ignore
            }
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch {
        runConversationSimulation();
      }
    } else {
      runConversationSimulation();
    }
  }

  function runConversationSimulation() {
    setTimeout(() => {
      if (voiceModeRef.current === "conversation" && convStateRef.current === "listening") {
        const sampleQuery = active?.agentCategory
          ? `Show me key trends and insights for ${active.agentCategory}`
          : "What is our current performance today?";
        setLiveVoiceTranscript(sampleQuery);
        setTimeout(() => {
          if (voiceModeRef.current === "conversation" && convStateRef.current === "listening") {
            handleConversationQuery(sampleQuery);
          }
        }, 1200);
      }
    }, 2000);
  }

  function handleConversationQuery(query: string) {
    if (!query.trim()) return;
    if (autoSendTimerRef.current) clearTimeout(autoSendTimerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }

    setConvState("thinking");
    convStateRef.current = "thinking";

    // 1. Append user message to thread
    const current = active ?? createThread(activePlatform?.id, undefined);
    const userMsg: UIMessage = {
      id: crypto.randomUUID(),
      role: "user",
      parts: [{ type: "text", text: query }],
    };
    const threadWithUser = {
      ...current,
      title: current.messages.length
        ? current.title
        : current.agentCategory
          ? `${current.agentCategory}`
          : query.slice(0, 48),
      updatedAt: Date.now(),
      messages: [...current.messages, userMsg],
    };
    update([threadWithUser, ...threads.filter((t) => t.id !== current.id)]);
    if (!active) void navigate({ to: "/chat/$threadId", params: { threadId: current.id } });

    // 2. Generate answer
    const answer = generateAnswer(query, current.agentCategory, current.platformId);

    // Natural conversation thinking beat
    setTimeout(() => {
      if (voiceModeRef.current !== "conversation") return;

      const assistantMsg: UIMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        parts: [{ type: "text", text: answer }],
      };
      const threadWithAssistant = {
        ...threadWithUser,
        updatedAt: Date.now(),
        messages: [...threadWithUser.messages, assistantMsg],
      };
      update([threadWithAssistant, ...threads.filter((t) => t.id !== current.id)]);

      // 3. Speak answer aloud
      setConvState("speaking");
      convStateRef.current = "speaking";

      const firstSentences = answer.split(/(?<=[.?!])\s+/).slice(0, 2).join(" ");
      setAiSpeakingSnippet(firstSentences || answer);

      speakVoiceResponse(answer, () => {
        // When AI finishes speaking, seamlessly resume listening for next user question!
        if (voiceModeRef.current === "conversation") {
          setConvState("listening");
          convStateRef.current = "listening";
          setLiveVoiceTranscript("");
          setAiSpeakingSnippet("");
          startConversationRecognition();
        }
      });
    }, 850);
  }

  function stopVoiceSession() {
    if (autoSendTimerRef.current) clearTimeout(autoSendTimerRef.current);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    setVoiceMode("idle");
    voiceModeRef.current = "idle";
    setConvState("listening");
    convStateRef.current = "listening";
    setLiveVoiceTranscript("");
    setDictationText("");
    setAiSpeakingSnippet("");
  }

  useEffect(() => {
    let stored = loadThreads();
    if (threadId && !stored.some((t) => t.id === threadId)) {
      stored = [{ ...createThread(), id: threadId }, ...stored];
      try {
        saveThreads(stored);
      } catch {
        setStorageError(true);
      }
    }
    setThreads(stored);
    setReady(true);
  }, [threadId]);

  const active = threads.find((t) => t.id === threadId);
  const messages = active?.messages || [];

  // Active agent and platform metadata if attached to current thread
  const currentPlatformId = active?.platformId || activePlatformId;
  const currentPlatform: PlatformItem =
    findPlatform(currentPlatformId) || (PLATFORMS_DATA[0] as PlatformItem);
  const activePlatform = currentPlatform;

  useEffect(() => {
    if (active?.platformId && active.platformId !== activePlatformId) {
      setActivePlatformId(active.platformId);
    }
  }, [active?.platformId, activePlatformId]);

  const platformThreads = threads.filter(
    (t) => getThreadPlatformId(t) === currentPlatformId,
  );

  const visibleThreads = platformThreads.filter((t) =>
    !search ? true : t.title.toLowerCase().includes(search.toLowerCase()),
  );

  // Focus textarea when in chat mode
  useEffect(() => {
    if (active?.agentCategory || messages.length > 0) {
      textarea.current?.focus();
    }
  }, [ready, threadId, messages.length, active?.agentCategory]);

  function update(next: ChatThread[]) {
    try {
      saveThreads(next);
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
    setThreads(next);
  }

  // When clicking "New conversation", reset to platform/agents directory
  function newChat() {
    setSidebar(false);
    setDraft("");
    setAttachments([]);
    stopVoiceSession();
    void navigate({ to: "/" });
  }

  // When user clicks ANY agent in the agents list
  function handleSelectAgent(
    platform: PlatformItem,
    agent: AgentCategoryItem,
    initialQuestion?: string,
  ) {
    const thread = createThread(platform.id, agent.category);
    thread.title = agent.category;

    let initialMessages: UIMessage[] = [];
    if (initialQuestion) {
      const userMsg: UIMessage = {
        id: crypto.randomUUID(),
        role: "user",
        parts: [{ type: "text", text: initialQuestion }],
      };
      initialMessages = [userMsg];
      thread.messages = initialMessages;
    }

    const nextThreads = [thread, ...threads.filter((t) => t.id !== thread.id)];
    update(nextThreads);

    void navigate({ to: "/chat/$threadId", params: { threadId: thread.id } });

    if (initialQuestion) {
      setIsThinking(true);
      if (thinkingTimer.current) clearTimeout(thinkingTimer.current);

      thinkingTimer.current = setTimeout(() => {
        const assistantMsg: UIMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          parts: [
            {
              type: "text",
              text: generateAnswer(initialQuestion, agent.category, platform.name),
            },
          ],
        };
        const threadWithAssistant = {
          ...thread,
          updatedAt: Date.now(),
          messages: [...initialMessages, assistantMsg],
        };
        update([threadWithAssistant, ...threads.filter((t) => t.id !== thread.id)]);
        setIsThinking(false);
      }, 1000);
    }
  }

  function handleBackToAgents() {
    void navigate({ to: "/" });
  }

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed && attachments.length === 0) return;
    stopVoiceSession();
    const attachmentNote = attachments.length
      ? `\n\n[Attached: ${attachments.map((f) => f.name).join(", ")}]`
      : "";
    const fullText = (trimmed || "Uploaded attachment(s)") + attachmentNote;
    const current = active ?? createThread(activePlatform?.id, undefined);
    const user: UIMessage = {
      id: crypto.randomUUID(),
      role: "user",
      parts: [{ type: "text", text: fullText }],
    };
    const threadWithUser = {
      ...current,
      title: current.messages.length
        ? current.title
        : current.agentCategory
          ? `${current.agentCategory}`
          : (trimmed || "Attachment").slice(0, 48),
      updatedAt: Date.now(),
      messages: [...current.messages, user],
    };
    update([threadWithUser, ...threads.filter((t) => t.id !== current.id)]);
    setDraft("");
    setAttachments([]);
    if (!active) void navigate({ to: "/chat/$threadId", params: { threadId: current.id } });

    setIsThinking(true);
    if (thinkingTimer.current) clearTimeout(thinkingTimer.current);

    thinkingTimer.current = setTimeout(() => {
      const assistant: UIMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        parts: [
          {
            type: "text",
            text: generateAnswer(trimmed, current.agentCategory, current.platformId),
          },
        ],
      };
      const threadWithAssistant = {
        ...threadWithUser,
        updatedAt: Date.now(),
        messages: [...threadWithUser.messages, assistant],
      };
      update([threadWithAssistant, ...threads.filter((t) => t.id !== current.id)]);
      setIsThinking(false);
    }, 1100);

    requestAnimationFrame(() => textarea.current?.focus());
  }

  function remove(id: string) {
    update(threads.filter((t) => t.id !== id));
    if (id === threadId) void navigate({ to: "/" });
  }

  // Handle in-place question editing
  function handleStartEdit(m: UIMessage) {
    const text = m.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("\n");
    setEditingMessageId(m.id);
    setEditText(text);
  }

  function handleCancelEdit() {
    setEditingMessageId(null);
    setEditText("");
  }

  function handleSaveEdit(messageId: string) {
    const newText = editText.trim();
    if (!newText) return;

    const current = active ?? threads.find((t) => t.id === threadId);
    if (!current) return;

    const msgIndex = current.messages.findIndex((msg) => msg.id === messageId);
    const targetMsg = current.messages[msgIndex];
    if (!targetMsg) return;

    // Truncate messages after this edited question to regenerate from here
    const updatedUserMsg: UIMessage = {
      id: targetMsg.id,
      role: targetMsg.role,
      parts: [{ type: "text" as const, text: newText }],
    };

    const updatedMessages = [
      ...current.messages.slice(0, msgIndex),
      updatedUserMsg,
    ];

    const updatedThread = {
      ...current,
      updatedAt: Date.now(),
      messages: updatedMessages,
    };

    update([updatedThread, ...threads.filter((t) => t.id !== current.id)]);
    setEditingMessageId(null);
    setEditText("");

    // Generate fresh response for the edited question
    setIsThinking(true);
    if (thinkingTimer.current) clearTimeout(thinkingTimer.current);

    thinkingTimer.current = setTimeout(() => {
      const assistant: UIMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        parts: [
          {
            type: "text",
            text: generateAnswer(newText, current.agentCategory, current.platformId),
          },
        ],
      };
      const threadWithAssistant = {
        ...updatedThread,
        updatedAt: Date.now(),
        messages: [...updatedMessages, assistant],
      };
      update([threadWithAssistant, ...threads.filter((t) => t.id !== current.id)]);
      setIsThinking(false);
    }, 1000);
  }

  useEffect(() => {
    setEditingMessageId(null);
    setEditText("");
  }, [threadId]);

  useEffect(() => {
    if (editingMessageId && editTextareaRef.current) {
      const el = editTextareaRef.current;
      el.focus();
      const len = el.value.length;
      el.setSelectionRange(len, len);
      el.style.height = "auto";
      el.style.height = `${Math.max(el.scrollHeight, 64)}px`;
    }
  }, [editingMessageId]);

  function download() {
    if (!active) return;
    const text = active.messages
      .map(
        (m) =>
          `${m.role}: ${m.parts
            .filter((p) => p.type === "text")
            .map((p) => p.text)
            .join("\n")}`,
      )
      .join("\n\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${active.title.replace(/[^a-z0-9]/gi, "-").slice(0, 48)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleShare() {
    const url = window.location.href;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: active?.title || "Wellio Agent",
          text: `Conversation with ${active?.agentCategory || active?.title || "Agent"}`,
          url,
        });
        return;
      } catch {
        // Fallback to clipboard if share was dismissed or unsupported
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      } catch {
        // ignore clipboard error
      }
    }
  }

  const canSend = Boolean(draft.trim() || attachments.length > 0);

  // Determine whether to show the Agent Platform Selector or Chat UI
  const isChatView = Boolean(
    threadId && active && (active.agentCategory || active.messages.length > 0),
  );

  const renderComposer = () => (
    <div className="w-full">
      <motion.div
        initial={false}
        animate={{
          height: voiceMode === "dictation" ? 50 : 120,
          borderRadius: voiceMode === "dictation" ? 25 : 4,
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="chat-card relative w-full overflow-hidden border border-border bg-card shadow-xs"
        style={{ willChange: "height, border-radius" }}
      >
        {/* Action 1: Voice Dictation listening view (Full width wave animation) */}
        <motion.div
          key="dictation-bar-view"
          initial={false}
          animate={{
            opacity: voiceMode === "dictation" ? 1 : 0,
            scale: voiceMode === "dictation" ? 1 : 0.98,
            pointerEvents: voiceMode === "dictation" ? "auto" : "none",
          }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
          className="absolute inset-0 flex h-full w-full items-center justify-between px-4 sm:px-5"
          aria-hidden={voiceMode !== "dictation"}
        >
          <div className="flex h-full flex-1 items-center justify-center overflow-hidden pr-2">
            <div className="flex w-full items-center justify-between gap-[3px]">
              {waveBars.map((height, idx) => (
                <span
                  key={idx}
                  className={`w-[2.5px] rounded-full transition-all duration-75 ${
                    height > 4 ? "bg-foreground" : "bg-ink-soft/30"
                  }`}
                  style={{ height: `${height}px` }}
                />
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleStopDictation(true)}
            aria-label="Stop recording and send"
            title="Stop recording and send"
            className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-foreground text-background transition-transform active:scale-90"
          >
            <span className="size-2 rounded-xs bg-background" />
          </button>
        </motion.div>

        {/* Standard Text/Input Composer view */}
        <motion.div
          key="text-composer-view"
          initial={false}
          animate={{
            opacity: voiceMode === "dictation" ? 0 : 1,
            pointerEvents: voiceMode === "dictation" ? "none" : "auto",
          }}
          transition={{ duration: 0.2 }}
          className="chat-composer flex h-full flex-col justify-between"
        >
          <PromptInput
            onSubmit={() => send(draft)}
            className="flex h-full flex-col justify-between border-0 bg-transparent p-0 shadow-none"
          >
            <PromptInputTextarea
              ref={textarea}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={
                voiceMode === "conversation"
                  ? convState === "speaking"
                    ? "Wellio is responding…"
                    : convState === "thinking"
                      ? "Thinking…"
                      : liveVoiceTranscript
                        ? `"${liveVoiceTranscript}"`
                        : "Listening to you… speak anytime"
                  : active?.agentCategory
                    ? `Ask ${active.agentCategory} intelligence…`
                    : "Ask anything or describe your task…"
              }
              aria-label="Message prompt"
              className="min-h-[44px] flex-1 resize-none border-0 bg-transparent px-3.5 pt-3 text-sm text-foreground placeholder:text-ink-soft focus-visible:ring-0"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(draft);
                }
              }}
            />

            {/* Display attached files if any */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-1.5 px-3.5 pb-1">
                {attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded border border-border bg-surface-soft px-2 py-0.5 text-xs text-foreground"
                  >
                    <span className="max-w-[140px] truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(idx)}
                      className="cursor-pointer text-ink-soft hover:text-foreground"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <PromptInputFooter className="mt-auto flex items-center justify-between border-0 bg-transparent px-3 pb-2 pt-0">
              {/* Left side: Attach option */}
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex size-9 cursor-pointer items-center justify-center rounded-[4px] text-ink-soft transition-colors hover:bg-surface-soft hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  title="Attach file"
                  aria-label="Attach file"
                >
                  <Paperclip className="size-4.5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Right side: 60px yellow noise animation + stop icon in conversation mode, or send/voice buttons */}
              <div className="flex items-center">
                <AnimatePresence mode="wait">
                  {voiceMode === "conversation" ? (
                    <motion.div
                      key="conv-voice-controls"
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.85, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="flex items-center gap-2"
                    >
                      {/* Left side: Stop icon button */}
                      <button
                        type="button"
                        onClick={stopVoiceSession}
                        title="Stop voice conversation"
                        aria-label="Stop voice conversation"
                        className="group inline-flex size-9 cursor-pointer items-center justify-center rounded-[4px] border border-border bg-card text-foreground transition-all hover:border-foreground/40 hover:bg-surface-soft active:scale-95"
                      >
                        <Square className="size-3.5 fill-foreground text-foreground transition-transform group-hover:scale-90" />
                      </button>

                      {/* Same position: 36px height & 80px width, full radius curved capsule (effect strictly inside only, no outer shadow) */}
                      <div
                        className="relative h-[36px] w-[80px] shrink-0 overflow-hidden rounded-full border border-[#836CFB]/80"
                        title="Voice conversation active"
                        aria-label="Voice conversation active"
                      >
                        <PurpleNoiseOrb convState={convState} waveBars={waveBars} />
                      </div>
                    </motion.div>
                  ) : canSend ? (
                    <motion.div
                      key="send-option-btn"
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.85, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <PromptInputSubmit
                        status={isThinking ? "submitted" : "ready"}
                        disabled={!canSend || !ready}
                        aria-label="Send message"
                        className="size-10 shrink-0 rounded-[4px] shadow-none"
                      >
                        <ArrowUp className="size-5" />
                      </PromptInputSubmit>
                    </motion.div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      {/* Action 1: Voice to Text (Dictate & Send) */}
                      <motion.button
                        key="dictate-btn"
                        type="button"
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.85, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={startDictation}
                        title="Voice to text (dictate and send)"
                        aria-label="Voice to text"
                        className="inline-flex size-9 cursor-pointer items-center justify-center rounded-[4px] text-ink-soft transition-colors hover:bg-surface-soft hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <Mic className="size-4.5" />
                      </motion.button>

                      {/* Action 2: Voice-to-Voice AI Conversation */}
                      <motion.button
                        key="start-voice-btn"
                        type="button"
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.85, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={startVoiceToVoice}
                        title="Voice conversation"
                        aria-label="Voice conversation"
                        className="group inline-flex size-9 cursor-pointer items-center justify-center rounded-[4px] text-ink-soft transition-colors hover:bg-surface-soft hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <div
                          className="flex h-5 items-center justify-center gap-[2.5px]"
                          aria-hidden="true"
                        >
                          <span className="h-[6px] w-[2.5px] rounded-full bg-ink-soft transition-colors group-hover:bg-foreground" />
                          <span className="h-[12px] w-[2.5px] rounded-full bg-ink-soft transition-colors group-hover:bg-foreground" />
                          <span className="h-[18px] w-[2.5px] rounded-full bg-ink-soft transition-colors group-hover:bg-foreground" />
                          <span className="h-[12px] w-[2.5px] rounded-full bg-ink-soft transition-colors group-hover:bg-foreground" />
                          <span className="h-[6px] w-[2.5px] rounded-full bg-ink-soft transition-colors group-hover:bg-foreground" />
                        </div>
                      </motion.button>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </PromptInputFooter>
          </PromptInput>
        </motion.div>
      </motion.div>
      {storageError && (
        <p role="alert" className="mt-3 px-1 text-xs text-alert">
          Unable to save. Check your browser storage.
        </p>
      )}
    </div>
  );

  return (
    <main className="chat-shell flex h-dvh min-h-0 bg-canvas text-foreground">
      {sidebar && (
        <div
          className="fixed inset-0 z-30 bg-foreground/30 md:hidden"
          onClick={() => setSidebar(false)}
        />
      )}
      <aside
        className={`chat-sidebar fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 flex-col border-r border-border bg-surface-soft p-5 md:static md:w-64 lg:w-72 ${sidebar ? "flex" : "hidden md:flex"}`}
      >
        <div className="mb-[18px] flex items-center justify-between px-2">
          <Link to="/" aria-label="Wellio home" onClick={newChat}>
            <Brand />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            title="Close sidebar"
            aria-label="Close sidebar"
            className="md:hidden"
            onClick={() => setSidebar(false)}
          >
            <X />
          </Button>
        </div>
        <Button
          variant="editorial"
          onClick={newChat}
          className="h-12 justify-between rounded-[4px] px-4"
        >
          New conversation
          <PenLine />
        </Button>
        {!searching ? (
          <Button
            variant="ghost"
            onClick={() => setSearching(true)}
            className="mt-2 h-10 w-full justify-start rounded-[4px] px-3 text-ink-soft hover:bg-card/60 hover:text-foreground"
          >
            <Search className="size-4" />
            <span>Search chats</span>
          </Button>
        ) : (
          <div className="relative mt-2 w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
            <input
              autoFocus
              type="text"
              aria-label="Search conversations"
              placeholder="Search chats…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onBlur={() => {
                if (!search.trim()) setSearching(false);
              }}
              className="h-10 w-full rounded-[4px] border border-border bg-card pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-ink-soft/70 focus:border-foreground"
            />
          </div>
        )}
        <div className="mt-8 flex items-center justify-between px-3 text-xs font-medium text-ink-soft">
          <span>Recent chats</span>
          <span className="text-[11px] text-ink-soft/70">{currentPlatform.shortName}</span>
        </div>
        <nav aria-label="Conversations" className="mt-3 flex-1 space-y-1 overflow-y-auto">
          {visibleThreads.map((t) => (
            <div
              key={t.id}
              className={`group flex items-center rounded-[4px] ${t.id === threadId ? "bg-card" : "hover:bg-card/60"}`}
            >
              <Button
                asChild
                variant="ghost"
                className="h-11 min-w-0 flex-1 justify-start px-3 hover:bg-transparent"
              >
                <Link
                  to="/chat/$threadId"
                  params={{ threadId: t.id }}
                  onClick={() => {
                    setSidebar(false);
                    setDraft("");
                  }}
                >
                  <MessageSquare className="size-4 shrink-0 text-ink-soft" />
                  <span className="truncate text-xs">{t.title}</span>
                </Link>
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                aria-label={`Delete ${t.title}`}
                title="Delete conversation"
                className="mr-1 shrink-0 text-ink-soft md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
                onClick={() => remove(t.id)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}
          {ready && !platformThreads.length && (
            <p className="px-3 py-4 text-xs text-ink-soft">No {currentPlatform.name} chats yet</p>
          )}
          {ready && platformThreads.length > 0 && !visibleThreads.length && (
            <p className="px-3 py-4 text-xs text-ink-soft">No matching chats found</p>
          )}
        </nav>
      </aside>

      <section className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-white">
        <header
          className={`flex h-14 items-center justify-between gap-3 px-5 sm:px-9 transition-colors ${
            isChatView
              ? "pointer-events-none absolute inset-x-0 top-0 z-20 bg-transparent"
              : "shrink-0 border-b border-border/60 bg-white"
          }`}
        >
          <div className="flex min-w-0 items-center gap-3 pointer-events-auto">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open sidebar"
              title="Open sidebar"
              className="md:hidden"
              onClick={() => setSidebar(true)}
            >
              <PanelLeft />
            </Button>
            <span className="md:hidden">
              <Brand small />
            </span>

            {isChatView ? (
              <button
                type="button"
                onClick={handleBackToAgents}
                className="group inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-foreground"
              >
                <ChevronLeft className="size-4.5 transition-transform group-hover:-translate-x-0.5" />
                <span>Back</span>
              </button>
            ) : (
              <span className="hidden truncate text-sm font-medium text-foreground md:block">
                Agents Directory
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 pointer-events-auto">
            {isChatView && (
              <button
                type="button"
                onClick={handleShare}
                className="group inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-foreground"
                title="Share conversation link"
                aria-label="Share conversation"
              >
                {isShared ? (
                  <>
                    <Check className="size-4 text-foreground" />
                    <span className="text-foreground">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="size-4 transition-transform group-hover:scale-105" />
                    <span>Share</span>
                  </>
                )}
              </button>
            )}
            {messages.length > 0 && (
              <Button
                size="icon"
                variant="ghost"
                title="Download conversation"
                aria-label="Download conversation"
                onClick={download}
              >
                <Download />
              </Button>
            )}
          </div>
        </header>

        {/* View Mode Switching: Agent Platform Selector vs Chat UI */}
        {!isChatView ? (
          <AgentPlatformSelector
            activePlatformId={activePlatformId}
            onSelectPlatform={setActivePlatformId}
            onSelectAgent={handleSelectAgent}
          />
        ) : messages.length === 0 ? (
          /* Chat UI: New agent conversation empty state - Clean, Beautiful, Uncluttered */
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-0 pb-8 pt-16">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full max-w-[766px] -translate-y-4 sm:-translate-y-6"
            >
              <div className="mb-7">
                <h1 className="font-display text-[48px] font-medium leading-[1.15] tracking-tight text-foreground">
                  {active?.agentCategory || "Patient Insights"}
                </h1>
              </div>

              {renderComposer()}
            </motion.div>
          </div>
        ) : (
          /* Chat UI: Active Conversation with messages */
          <>
            <Conversation className="min-h-0 flex-1" key={threadId}>
              <ConversationContent className="mx-auto w-full max-w-[766px] gap-8 px-0 pb-10 pt-16">
                {messages.map((m) => (
                  <Message key={m.id} from={m.role} className="max-w-full">
                    {editingMessageId === m.id ? (
                      <div className="w-full rounded-[4px] border border-border bg-card p-3.5 shadow-2xs transition-all focus-within:border-foreground">
                        <textarea
                          ref={editTextareaRef}
                          value={editText}
                          onChange={(e) => {
                            setEditText(e.target.value);
                            e.target.style.height = "auto";
                            e.target.style.height = `${Math.max(e.target.scrollHeight, 64)}px`;
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSaveEdit(m.id);
                            } else if (e.key === "Escape") {
                              e.preventDefault();
                              handleCancelEdit();
                            }
                          }}
                          rows={2}
                          aria-label="Edit question"
                          placeholder="Edit your question…"
                          className="w-full resize-none border-0 bg-transparent p-0 text-base leading-relaxed text-foreground outline-none placeholder:text-ink-soft/70 focus:outline-none focus:ring-0"
                        />
                        <div className="mt-3 flex items-center justify-end gap-2 border-t border-border/50 pt-2.5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleCancelEdit}
                            className="h-8 cursor-pointer rounded-[4px] px-3 text-xs text-ink-soft hover:text-foreground"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            variant="editorial"
                            size="sm"
                            disabled={!editText.trim()}
                            onClick={() => handleSaveEdit(m.id)}
                            className="h-8 cursor-pointer rounded-[4px] px-3.5 text-xs font-medium"
                          >
                            Send
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <MessageContent className="text-base leading-7 group-[.is-user]:rounded-[4px] group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground">
                          {m.parts.map((p, i) =>
                            p.type === "text" ? (
                              <MessageResponse key={i}>{p.text}</MessageResponse>
                            ) : null,
                          )}
                        </MessageContent>
                        <MessageActions className="justify-end gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-within:opacity-100">
                          {m.role === "user" && (
                            <MessageAction
                              tooltip="Edit question"
                              label="Edit question"
                              onClick={() => handleStartEdit(m)}
                            >
                              <PenLine />
                            </MessageAction>
                          )}
                          <MessageAction
                            tooltip="Copy message"
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(
                                  m.parts
                                    .filter((p) => p.type === "text")
                                    .map((p) => p.text)
                                    .join("\n"),
                                );
                                setCopied(m.id);
                                setTimeout(() => setCopied(null), 1500);
                              } catch {
                                setCopied(null);
                              }
                            }}
                          >
                            {copied === m.id ? <Check /> : <Copy />}
                          </MessageAction>
                        </MessageActions>
                      </>
                    )}
                  </Message>
                ))}
                {isThinking && (
                  <div className="flex flex-col gap-2 max-w-full">
                    <div
                      className="flex items-center gap-1.5 py-2 px-1"
                      role="status"
                      aria-label="Loading response"
                    >
                      <motion.span
                        className="size-2 rounded-full bg-foreground/60"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.span
                        className="size-2 rounded-full bg-foreground/60"
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0.15,
                          ease: "easeInOut",
                        }}
                      />
                      <motion.span
                        className="size-2 rounded-full bg-foreground/60"
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0.3,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  </div>
                )}
              </ConversationContent>
              <ConversationScrollButton aria-label="Scroll to latest message" />
            </Conversation>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="shrink-0 px-0 pb-5 pt-3 sm:pb-7"
            >
              <div className="mx-auto w-full max-w-[766px]">{renderComposer()}</div>
            </motion.div>
          </>
        )}
      </section>
    </main>
  );
}
