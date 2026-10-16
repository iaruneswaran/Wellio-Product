export interface AgentCategoryItem {
  id: string;
  category: string;
  whatUsersCanAsk: string;
  sampleQueries: string[];
  iconName: string;
}

export interface PlatformItem {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  badge: string;
  agents: AgentCategoryItem[];
}

export const PLATFORMS_DATA: PlatformItem[] = [
  {
    id: "gooddoc-hms",
    name: "GoodDoc HMS",
    shortName: "HMS",
    tagline: "Hospital Management System",
    badge: "Healthcare HMS",
    agents: [
      {
        id: "patient-insights",
        category: "Patient Demographics & Cohort Retention Analytics",
        whatUsersCanAsk: "New patient registrations, recurring chronic care visits, patient age demographics, geographic catchment distribution, and return frequency patterns",
        sampleQueries: [
          "Show new vs returning patient trends this month across clinical specialties",
          "What are our primary patient demographics by age bracket and geographic location?",
          "Analyze chronic care patient return intervals across outpatient clinics",
        ],
        iconName: "Users",
      },
      {
        id: "appointment-management",
        category: "Outpatient Appointment & Scheduling Operations",
        whatUsersCanAsk: "Daily booking trends, cancellation lead times, unnotified no-show patterns, peak consultation hours, and automated follow-up scheduling",
        sampleQueries: [
          "What is our appointment no-show rate this week and what are peak cancellation hours?",
          "Break down no-shows by booking source — web portal, WhatsApp bot, or reception desk",
          "List pending follow-up appointments requiring automated patient reminders",
        ],
        iconName: "Calendar",
      },
      {
        id: "doctor-insights",
        category: "Specialist Consultation & Clinical Workload Performance",
        whatUsersCanAsk: "Physician consultation volume, OPD and IPD rounds distribution, average encounter duration, clinical productivity, and patient feedback ratings",
        sampleQueries: [
          "Compare consultation volume and clinical workload across specialists this quarter",
          "Which doctors have highest patient satisfaction ratings and repeat visit compliance?",
          "Analyze clinic waiting queues and consultation duration for senior consultants",
        ],
        iconName: "UserCheck",
      },
      {
        id: "department-insights",
        category: "Clinical Department Performance & Specialty Utilization",
        whatUsersCanAsk: "Outpatient versus inpatient case distribution, radiology reporting throughput, pathology workload, pharmacy turnaround, and OT utilization",
        sampleQueries: [
          "Compare OP vs IP revenue and patient volume across major clinical departments",
          "Evaluate diagnostic report turnaround time in Radiology and Pathology",
          "Which clinical department has the highest bed utilization and OT block efficiency?",
        ],
        iconName: "Building2",
      },
      {
        id: "financial-insights",
        category: "Hospital Billing, Revenue & Insurance Claims Management",
        whatUsersCanAsk: "Daily cash and digital collections, TPA insurance claim settlement aging past 45 days, query resolution, and inpatient discharge ledger clearance",
        sampleQueries: [
          "Summary of outstanding insurance claims, denial rates, and aging past 45 days",
          "Total collections today split by cash, digital UPI, and credit card payments",
          "Identify unbilled inpatient accounts and discharge billing reconciliation discrepancies",
        ],
        iconName: "DollarSign",
      },
      {
        id: "pharmacy-intelligence",
        category: "Hospital Pharmacy Inventory & Formulary Management",
        whatUsersCanAsk: "Prescription dispensing volumes, critical medication buffer stock alerts, near-expiry batch monitoring, and vendor consignment replenishment",
        sampleQueries: [
          "List critical formulary medicines running below emergency buffer stock",
          "Identify drug batches expiring within the next 30 days across all floor dispensaries",
          "Top-moving prescription drugs this month and inventory turnover velocity",
        ],
        iconName: "Pill",
      },
      {
        id: "laboratory-intelligence",
        category: "Diagnostic Laboratory & Pathology Operations Analytics",
        whatUsersCanAsk: "Diagnostic specimen volume, STAT test turnaround time benchmarks, critical value escalation logs, and daily analyzer processing throughput",
        sampleQueries: [
          "Identify lab test panels with turnaround time delays exceeding target benchmarks",
          "Most requested diagnostic investigations and clinical laboratory throughput",
          "Compliance rate for critical value verbal notifications delivered to ICU consultants",
        ],
        iconName: "FlaskConical",
      },
      {
        id: "bed-admission-analytics",
        category: "Inpatient Bed Census & Ward Admission Analytics",
        whatUsersCanAsk: "ICU and general ward bed occupancy rates, scheduled morning discharges, average length of stay (ALOS), and emergency admission capacity",
        sampleQueries: [
          "Current ICU, step-down HDU, and general ward bed census and occupancy rates",
          "Average length of stay (ALOS) across multi-specialty clinical departments",
          "Scheduled morning discharges and vacant beds available for emergency admissions",
        ],
        iconName: "Bed",
      },
      {
        id: "queue-waiting-analysis",
        category: "Outpatient Queue Flow & Patient Waiting Time Analysis",
        whatUsersCanAsk: "End-to-end token flow, reception to triage wait times, clinic consultation queues, peak congestion windows, and counter processing velocity",
        sampleQueries: [
          "Average patient wait time from token generation to doctor consultation across OP clinics",
          "Pinpoint outpatient clinic bottlenecks during peak morning arrival hours",
          "Compare token processing speed and service duration across billing and registration counters",
        ],
        iconName: "Clock",
      },
      {
        id: "operational-efficiency",
        category: "Front Office Operations & Patient Administration Productivity",
        whatUsersCanAsk: "Front desk registration turnaround, corporate insurance verification speed, billing counter transaction times, and lobby congestion tracking",
        sampleQueries: [
          "Average registration time per patient at the front desk and corporate desks",
          "Billing counter productivity, invoice generation rates, and counter idle time",
          "Operational bottlenecks slowing patient discharge and settlement workflows",
        ],
        iconName: "Gauge",
      },
      {
        id: "patient-journey",
        category: "End-to-End Outpatient Care Journey & Milestone Tracking",
        whatUsersCanAsk: "Complete patient transition timeline across registration, nursing triage, doctor consultation, diagnostic testing, and pharmacy checkout",
        sampleQueries: [
          "Map end-to-end journey timeline and dwell duration for today's outpatient visits",
          "Identify non-clinical transition delays between diagnostics and pharmacy dispensing",
          "Average transit duration between consultation completion and final prescription pickup",
        ],
        iconName: "Milestone",
      },
      {
        id: "compliance-audit",
        category: "Medical Records Audit & Healthcare Regulatory Compliance",
        whatUsersCanAsk: "Physician discharge summary sign-off tracking, inpatient antibiotic documentation audits, EHR access logs, and NABH accreditation compliance",
        sampleQueries: [
          "Highlight patient discharge summaries pending consultant sign-off past 24 hours",
          "NABH 5th edition clinical documentation audit for inpatient medication charts",
          "Audit trail logs for sensitive patient medical record access and privacy compliance",
        ],
        iconName: "ShieldCheck",
      },
      {
        id: "ai-recommendations",
        category: "Clinical Workflow Optimization & Resource Allocation",
        whatUsersCanAsk: "Nurse-to-patient staffing ratios across ICU and emergency wards, clinic scheduling adjustments, surgery theater leveling, and inventory reorder planning",
        sampleQueries: [
          "Recommended nurse-to-patient staffing ratio for tomorrow based on census forecast",
          "Suggest scheduling adjustments to reduce evening outpatient clinic queue peaks",
          "Automated supply chain replenishment points for fast-moving critical formulary",
        ],
        iconName: "Sparkles",
      },
      {
        id: "executive-briefing",
        category: "Hospital Executive Operations & Administrative Briefing",
        whatUsersCanAsk: "Consolidated daily hospital business overview, total revenue realization, emergency and elective admissions, surgical caseloads, and governance alerts",
        sampleQueries: [
          "Generate daily executive summary of hospital operations, revenue, and bed census",
          "Key financial collections, inpatient admissions, surgical volumes, and quality indicators",
          "Weekly hospital administrative briefing for executive management board review",
        ],
        iconName: "Briefcase",
      },
    ],
  },
  {
    id: "gooddoc-kiosk",
    name: "GoodDoc Kiosk",
    shortName: "Kiosk",
    tagline: "Patient Self-Service Kiosk",
    badge: "Smart Kiosk",
    agents: [
      {
        id: "checkin-analytics",
        category: "Patient Self-Service Check-in & Intake Flow Analytics",
        whatUsersCanAsk: "Total kiosk check-in volumes, average check-in completion velocity, digital intake vs front desk registration ratios, and peak morning queue reduction rates",
        sampleQueries: [
          "How many outpatient visits were checked in through kiosks today vs front desk?",
          "What is the average check-in duration from barcode scan to token printing?",
          "Compare self-service adoption rates across morning and afternoon clinic hours",
        ],
        iconName: "CheckCircle2",
      },
      {
        id: "queue-insights",
        category: "Kiosk Queue Throughput & Waiting Time Intelligence",
        whatUsersCanAsk: "Real-time lobby waiting times, peak terminal congestion intervals, token generation velocity, and department queue distribution",
        sampleQueries: [
          "What are our peak terminal queue hours across the main lobby and specialty blocks?",
          "Average token wait time from kiosk registration to nursing triage call",
          "Queue volume breakdown across Cardiology, Orthopedics, and General Medicine",
        ],
        iconName: "Clock",
      },
      {
        id: "feature-usage",
        category: "Self-Service Kiosk Feature Adoption & Module Utilization",
        whatUsersCanAsk: "Outpatient appointment booking, contactless bill payments, diagnostic lab report printing, and digital floor navigation wayfinding",
        sampleQueries: [
          "Which self-service features have highest adoption — bill pay, check-in, or lab prints?",
          "Volume of printed diagnostic test reports and pharmacy tokens issued at kiosks",
          "How many patients utilized interactive wayfinding to locate diagnostic suites?",
        ],
        iconName: "LayoutGrid",
      },
      {
        id: "device-health",
        category: "Kiosk Hardware Telemetry & Device Health Monitoring",
        whatUsersCanAsk: "Real-time terminal online status, thermal receipt paper roll buffers, optical barcode and QR scanner responsiveness, and hardware diagnostics",
        sampleQueries: [
          "Are any self-service kiosk terminals currently offline or unreachable?",
          "Check thermal paper roll levels and alert on terminals below 15% capacity",
          "Report optical barcode and camera QR scanner error rates across all floor kiosks",
        ],
        iconName: "HardDrive",
      },
      {
        id: "user-experience",
        category: "Patient Self-Service UX Friction & Drop-off Analysis",
        whatUsersCanAsk: "Step-by-step workflow abandonment rates, failed phone number verification retries, session timeout frequencies, and on-screen help triggers",
        sampleQueries: [
          "Where do patients abandon their self-service check-in workflow most frequently?",
          "Track session timeout rates during insurance policy verification screens",
          "Frequency of staff assistance requests triggered by senior citizen patients",
        ],
        iconName: "HeartHandshake",
      },
      {
        id: "language-insights",
        category: "Multilingual Interface Adoption & Regional Localization",
        whatUsersCanAsk: "Patient language selection trends across Tamil, English, and Malayalam, workflow drop-off comparisons by dialect, and audio prompt engagement",
        sampleQueries: [
          "Breakdown of completed kiosk check-ins by selected language: Tamil, English, Malayalam",
          "Which regional language interface has the lowest user abandonment and error rate?",
          "Evaluate audio-assisted localization usage among elder outpatient visitors",
        ],
        iconName: "Languages",
      },
      {
        id: "payment-analytics",
        category: "Kiosk Digital Billing Collections & Payment Reconciliation",
        whatUsersCanAsk: "Daily outpatient revenue collected via kiosks, payment mode distribution across UPI QR, debit/credit cards, and POS transaction settlement logs",
        sampleQueries: [
          "Total consultation and diagnostic revenue collected through kiosks today",
          "Payment method split between dynamic UPI QR codes, debit cards, and credit cards",
          "Failed transaction rate and automatic payment gateway refund reconciliations",
        ],
        iconName: "CreditCard",
      },
      {
        id: "kiosk-patient-journey",
        category: "Self-Service Milestone Velocity & Step-by-Step Dwell Times",
        whatUsersCanAsk: "Time spent entering patient identification, doctor slot selection duration, payment authorization speed, and printed token dispatch latency",
        sampleQueries: [
          "Average time patients spend on MRN lookup vs mobile number OTP verification",
          "How many seconds do users take on the specialist doctor and slot selection screen?",
          "Total dwell time from screen touch to physical token and receipt printing",
        ],
        iconName: "Route",
      },
      {
        id: "location-performance",
        category: "Multi-Facility Terminal Utilization & Campus Foot-Traffic Performance",
        whatUsersCanAsk: "Terminal throughput comparisons across hospital blocks, city branches, outpatient clinics, and low-traffic kiosk redeployment recommendations",
        sampleQueries: [
          "Compare kiosk check-in share between Main Campus and Regional Satellite Clinics",
          "Which hospital lobby has the highest self-service ratio per available terminal?",
          "Identify underutilized kiosk terminals that require prominent floor directional signage",
        ],
        iconName: "MapPin",
      },
      {
        id: "usage-trends",
        category: "Self-Service Adoption Trajectory & Long-Term Growth Analytics",
        whatUsersCanAsk: "Day-of-week self-check-in adoption patterns, monthly patient migration from manual counters, and seasonal holiday lobby volume surges",
        sampleQueries: [
          "Show kiosk adoption trajectory and patient self-service growth over the last 90 days",
          "Day-of-week adoption patterns and weekend outpatient check-in volumes",
          "Percentage shift of recurring follow-up patients from reception to kiosks",
        ],
        iconName: "TrendingUp",
      },
      {
        id: "service-optimization",
        category: "Lobby Service Optimization & Terminal Workflow Engineering",
        whatUsersCanAsk: "Touchscreen intake streamlining, peak morning queue buffer configurations, UI screen reduction, and lobby staff allocation during surge hours",
        sampleQueries: [
          "Identify redundant UI input steps that can be eliminated to accelerate check-in",
          "Recommended terminal distribution adjustments to balance morning lobby foot traffic",
          "Front office volunteer allocation strategies during projected 09:00 AM peak arrivals",
        ],
        iconName: "Sliders",
      },
      {
        id: "maintenance-alerts",
        category: "Predictive Device Maintenance & Kiosk Servicing Alerts",
        whatUsersCanAsk: "Printer thermal cutter lifecycle monitoring, touchscreen recalibration cycles, component overheating alerts, and scheduled vendor SLA tickets",
        sampleQueries: [
          "List kiosk terminals scheduled for vendor maintenance and component inspection",
          "Identify thermal printers with over 5,000 cut cycles requiring preventative blade cleaning",
          "Hardware health log for touch responsiveness and internal operating temperatures",
        ],
        iconName: "AlertTriangle",
      },
    ],
  },
  {
    id: "a-style",
    name: "A Style (Garment Platform)",
    shortName: "A Style",
    tagline: "Garment & Fashion Retail Platform",
    badge: "Apparel Platform",
    agents: [
      {
        id: "sales-insights",
        category: "Fashion Retail Sales Velocity & Gross Revenue Performance",
        whatUsersCanAsk: "Daily and weekly gross merchandise value (GMV), average order value (AOV) across channels, sales conversion margins, and repeat customer basket size",
        sampleQueries: [
          "What is our gross merchandise value (GMV) and net sales this week across all channels?",
          "Average order value (AOV) comparison between brand webstore and flagship retail stores",
          "Identify sales velocity spikes and promotional campaign revenue realization",
        ],
        iconName: "BarChart3",
      },
      {
        id: "product-performance",
        category: "Garment SKU Sell-Through Velocity & Assortment Performance",
        whatUsersCanAsk: "Top-selling fashion silhouettes, slow-moving SKU aging reports, seasonal launch sell-through percentages, and margin contribution by style",
        sampleQueries: [
          "Which apparel styles and cuts have the highest sell-through rate this season?",
          "Identify slow-moving garment SKUs with inventory aging exceeding 60 days",
          "Gross margin contribution analysis for the newly launched summer linen collection",
        ],
        iconName: "PackageCheck",
      },
      {
        id: "inventory-intelligence",
        category: "Apparel Warehouse Stock Levels & Size-Curve Inventory Control",
        whatUsersCanAsk: "Critical size stockout alerts across central and store warehouses, broken size-curve replenishment, dead stock audits, and inventory turnover ratios",
        sampleQueries: [
          "Which core sizes (M, L) are running below safety stock buffer across regional hubs?",
          "Dead stock audit report for garment styles with zero customer orders in 45 days",
          "Inventory turnover velocity across central fulfillment center vs retail branches",
        ],
        iconName: "Boxes",
      },
      {
        id: "return-intelligence",
        category: "Apparel Return Diagnostics & Sizing Discrepancy Intelligence",
        whatUsersCanAsk: "Detailed customer return reason breakdowns across fit, fabric feel, tailoring defects, SKU return percentages, and reverse logistics transit costs",
        sampleQueries: [
          "Primary customer return reasons: sizing inaccuracies vs fabric quality vs transit damage",
          "Return percentage benchmarks by apparel department — dresses, trousers, formal shirts",
          "Which garment manufacturers and vendor batches generate the highest defect rates?",
        ],
        iconName: "RotateCcw",
      },
      {
        id: "customer-insights",
        category: "Customer Cohort Retention & Fashion Lifetime Value Analytics",
        whatUsersCanAsk: "New versus returning shopper ratios, loyalty tier purchase frequency, customer lifetime value (LTV), and seasonal repeat purchase cycles",
        sampleQueries: [
          "Repeat buyer retention rates and average customer lifetime value across cohorts",
          "VIP loyalty tier spending distribution, preferred categories, and redemption habits",
          "First-time shopper conversion rates across digital storefronts and boutique outlets",
        ],
        iconName: "Users",
      },
      {
        id: "order-management",
        category: "Multi-Channel Order Fulfillment & Dispatch Pipeline Operations",
        whatUsersCanAsk: "Live warehouse packing backlog, courier partner delivery turnaround times (SLA), pre-dispatch cancellations, and out-of-delivery tracking",
        sampleQueries: [
          "Current order fulfillment pipeline: pending picking, packing, and courier dispatch",
          "Order cancellation rates prior to warehouse dispatch and primary customer reasons",
          "Average last-mile delivery turnaround time across primary third-party logistics partners",
        ],
        iconName: "ShoppingBag",
      },
      {
        id: "store-performance",
        category: "Omnichannel Retail & Digital Marketplace Channel Performance",
        whatUsersCanAsk: "Sales and profit margin comparisons across direct-to-consumer website, retail flagship stores, pop-up outlets, and third-party fashion marketplaces",
        sampleQueries: [
          "Sales volume and operating margin comparison: DTC Website vs Myntra vs Flagship Retail",
          "Conversion rate benchmarks by marketing campaign source and influencer traffic",
          "Boutique retail foot-traffic conversion and sales revenue per square foot",
        ],
        iconName: "Store",
      },
      {
        id: "category-analysis",
        category: "Apparel Department Performance & Collection Revenue Contribution",
        whatUsersCanAsk: "Men's, Women's, and Kids' fashion revenue shares, ethnic wear versus western casual growth rates, and average selling price (ASP) trends",
        sampleQueries: [
          "Revenue contribution and volume distribution: Women's Wear vs Men's vs Children's",
          "Category growth rate in premium linen and ethnic occasion wear over the past quarter",
          "Average selling price (ASP) evolution across seasonal autumn and winter collections",
        ],
        iconName: "Layers",
      },
      {
        id: "demand-forecasting",
        category: "Seasonal Demand Projections & Fabric Sourcing Requirements",
        whatUsersCanAsk: "Upcoming festive and wedding season demand modeling, mill fabric procurement lead times, factory cut-to-order volumes, and stockout risk mitigation",
        sampleQueries: [
          "Demand projection and required cut quantities for upcoming festive wedding season",
          "Raw fabric procurement lead times and yardage planning for winter outerwear lines",
          "Identify high-velocity fashion styles facing imminent stockout risk within 14 days",
        ],
        iconName: "Activity",
      },
      {
        id: "trend-analysis",
        category: "Fashion Trend Velocity, Color Palette & Silhouette Analytics",
        whatUsersCanAsk: "Trending garment colorways, seasonal print adoption, popular size-curve distributions, and rising apparel silhouettes in consumer searches",
        sampleQueries: [
          "Top performing seasonal color palettes, fabric textures, and print patterns this month",
          "Size-curve demand breakdown across XS, S, M, L, XL, and XXL by product category",
          "Emerging contemporary silhouettes gaining traction in women's formal apparel",
        ],
        iconName: "Palette",
      },
      {
        id: "merchandising",
        category: "Assortment Merchandising & Store Allocation Optimization",
        whatUsersCanAsk: "Store-level assortment planning, core stock replenishment triggers, end-of-season markdown cadence, and visual merchandising bundle pairings",
        sampleQueries: [
          "Assortment mix plan and floor capacity allocation for metropolitan flagship stores",
          "Recommended replenishment quantities for core replenishment styles across stores",
          "Optimal promotional bundle pairings and markdown schedules for end-of-season clearance",
        ],
        iconName: "Sparkles",
      },
    ],
  },
];

export function findPlatform(platformId?: string): PlatformItem | undefined {
  if (!platformId) return undefined;
  return PLATFORMS_DATA.find((p) => p.id === platformId);
}

export function findAgent(
  platformId?: string,
  categoryName?: string,
): AgentCategoryItem | undefined {
  if (!platformId || !categoryName) return undefined;
  const platform = findPlatform(platformId);
  return platform?.agents.find(
    (a) =>
      a.category.toLowerCase() === categoryName.toLowerCase() ||
      a.id === categoryName.toLowerCase(),
  );
}
