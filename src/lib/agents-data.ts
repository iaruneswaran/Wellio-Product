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
        category: "Patient Insights",
        whatUsersCanAsk: "New patients, returning patients, demographics, visit frequency",
        sampleQueries: [
          "Show new vs returning patient trends this month",
          "What are our primary patient demographics by age & location?",
          "Analyze patient visit frequency across all departments",
        ],
        iconName: "Users",
      },
      {
        id: "appointment-management",
        category: "Appointment Management",
        whatUsersCanAsk: "Appointment trends, cancellations, no-shows, follow-ups",
        sampleQueries: [
          "What is our appointment no-show rate this week?",
          "Show cancellation reasons and peak booking hours",
          "List pending follow-up appointments requiring reminders",
        ],
        iconName: "Calendar",
      },
      {
        id: "doctor-insights",
        category: "Doctor Insights",
        whatUsersCanAsk: "Consultation count, revenue, workload",
        sampleQueries: [
          "Compare consultation volume and workload across specialists",
          "Which doctors have highest patient satisfaction and repeat visits?",
          "Generate doctor revenue contribution report for current quarter",
        ],
        iconName: "UserCheck",
      },
      {
        id: "department-insights",
        category: "Department Insights",
        whatUsersCanAsk: "OP, IP, Lab, Pharmacy, Radiology performance",
        sampleQueries: [
          "Compare OP vs IP revenue and patient volume",
          "Evaluate turnaround time in Radiology and Pathology",
          "Which hospital department has the highest bed utilization?",
        ],
        iconName: "Building2",
      },
      {
        id: "financial-insights",
        category: "Financial Insights",
        whatUsersCanAsk: "Revenue, billing, insurance, outstanding payments",
        sampleQueries: [
          "Summary of outstanding insurance claims and aging",
          "Total revenue collected today split by cash and digital payment",
          "Identify unbilled patient accounts and discharge discrepancies",
        ],
        iconName: "DollarSign",
      },
      {
        id: "pharmacy-intelligence",
        category: "Pharmacy Intelligence",
        whatUsersCanAsk: "Medicine sales, low stock, expiry alerts",
        sampleQueries: [
          "List critical medicines running low on stock",
          "Identify batches expiring within the next 30 days",
          "Top-selling prescription drugs this month and inventory turnover",
        ],
        iconName: "Pill",
      },
      {
        id: "laboratory-intelligence",
        category: "Laboratory Intelligence",
        whatUsersCanAsk: "Test volumes, report delays, revenue",
        sampleQueries: [
          "Identify lab tests with turnaround time delays over 4 hours",
          "Most requested diagnostic test panels and revenue",
          "Daily sample processing capacity and technician throughput",
        ],
        iconName: "FlaskConical",
      },
      {
        id: "bed-admission-analytics",
        category: "Bed & Admission Analytics",
        whatUsersCanAsk: "Occupancy, admissions, discharges, average stay",
        sampleQueries: [
          "Current ICU and general ward bed occupancy rate",
          "Average length of stay (ALOS) by clinical specialty",
          "Scheduled discharges and available beds for emergency admissions",
        ],
        iconName: "Bed",
      },
      {
        id: "queue-waiting-analysis",
        category: "Queue & Waiting Analysis",
        whatUsersCanAsk: "Waiting time, bottlenecks, token analysis",
        sampleQueries: [
          "Average patient wait time from token generation to consultation",
          "Pinpoint OP clinic bottlenecks during peak morning hours",
          "Compare token processing speed across billing counters",
        ],
        iconName: "Clock",
      },
      {
        id: "operational-efficiency",
        category: "Operational Efficiency",
        whatUsersCanAsk: "Front office, registration, billing productivity",
        sampleQueries: [
          "Average registration time per patient at the front desk",
          "Billing counter productivity and invoice generation rate",
          "Operational bottlenecks slowing patient discharge workflow",
        ],
        iconName: "Gauge",
      },
      {
        id: "patient-journey",
        category: "Patient Journey",
        whatUsersCanAsk: "Registration, Consultation, Billing timeline",
        sampleQueries: [
          "Map end-to-end journey timeline for today's OP patients",
          "Where do patients spend the most idle waiting time?",
          "Average transition duration between consultation and pharmacy checkout",
        ],
        iconName: "Milestone",
      },
      {
        id: "compliance-audit",
        category: "Compliance & Audit",
        whatUsersCanAsk: "Missing records, pending documentation, audit logs",
        sampleQueries: [
          "Highlight patient discharge summaries pending doctor sign-off",
          "Check medical audit compliance for prescription documentation",
          "Show access logs for sensitive patient health records",
        ],
        iconName: "ShieldCheck",
      },
      {
        id: "ai-recommendations",
        category: "AI Recommendations",
        whatUsersCanAsk: "Staffing, scheduling, workflow improvements",
        sampleQueries: [
          "Recommended nurse-to-patient staffing ratio for tomorrow",
          "Suggest scheduling adjustments to reduce evening OP wait times",
          "Automated suggestions to optimize medicine reorder points",
        ],
        iconName: "Sparkles",
      },
      {
        id: "executive-briefing",
        category: "Executive Briefing",
        whatUsersCanAsk: "AI-generated daily business summary",
        sampleQueries: [
          "Generate executive summary of hospital operations today",
          "Key revenue metrics, patient admissions, and critical incidents",
          "Weekly operational briefing for hospital management board",
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
        category: "Check-in Analytics",
        whatUsersCanAsk: "Total check-ins, average check-in time",
        sampleQueries: [
          "How many patients checked in via kiosk today?",
          "What is the average check-in duration per patient?",
          "Compare self-check-in speed vs front desk registration",
        ],
        iconName: "CheckCircle2",
      },
      {
        id: "queue-insights",
        category: "Queue Insights",
        whatUsersCanAsk: "Waiting times, busiest hours",
        sampleQueries: [
          "What are the peak kiosk queue hours today?",
          "Average token wait time after kiosk check-in",
          "Queue volume breakdown by clinic department",
        ],
        iconName: "Clock",
      },
      {
        id: "feature-usage",
        category: "Feature Usage",
        whatUsersCanAsk: "Appointment booking, payments, reports, navigation",
        sampleQueries: [
          "Which kiosk features are most frequently used by patients?",
          "Number of bills paid and lab reports printed directly at kiosk",
          "How many users navigate hospital maps using kiosk wayfinding?",
        ],
        iconName: "LayoutGrid",
      },
      {
        id: "device-health",
        category: "Device Health",
        whatUsersCanAsk: "Offline kiosks, printer status, scanner issues",
        sampleQueries: [
          "Are any kiosks currently offline or unreachable?",
          "Check thermal paper roll levels across all kiosk printers",
          "Report barcode and QR scanner error rates by kiosk terminal",
        ],
        iconName: "HardDrive",
      },
      {
        id: "user-experience",
        category: "User Experience",
        whatUsersCanAsk: "Drop-offs, failed sessions, retry rates",
        sampleQueries: [
          "Where do patients abandon their kiosk workflow most often?",
          "Failed payment attempts and transaction retry rates",
          "Senior citizen assistance requests triggered at kiosk",
        ],
        iconName: "HeartHandshake",
      },
      {
        id: "language-insights",
        category: "Language Insights",
        whatUsersCanAsk: "Tamil, English, Malayalam usage",
        sampleQueries: [
          "Breakdown of session volume: Tamil vs English vs Malayalam",
          "Which language option has the lowest session abandonment rate?",
          "Regional language preference by hospital branch location",
        ],
        iconName: "Languages",
      },
      {
        id: "payment-analytics",
        category: "Payment Analytics",
        whatUsersCanAsk: "Kiosk collections, payment methods",
        sampleQueries: [
          "Total revenue collected via kiosks today",
          "Payment method split: UPI QR vs Credit Card vs NetBanking",
          "Average transaction amount processed per kiosk terminal",
        ],
        iconName: "CreditCard",
      },
      {
        id: "kiosk-patient-journey",
        category: "Patient Journey",
        whatUsersCanAsk: "Time spent at every kiosk step",
        sampleQueries: [
          "How much time do patients spend entering their phone or MRN?",
          "Average time taken on the doctor/slot selection screen",
          "Time spent completing card/UPI checkout step",
        ],
        iconName: "Route",
      },
      {
        id: "location-performance",
        category: "Location Performance",
        whatUsersCanAsk: "Compare kiosk performance by hospital",
        sampleQueries: [
          "Compare kiosk adoption rate across Main Hospital vs City Branch",
          "Which hospital branch has the highest patient self-service share?",
          "Identify kiosks with lowest utilization that need better signage",
        ],
        iconName: "MapPin",
      },
      {
        id: "usage-trends",
        category: "Usage Trends",
        whatUsersCanAsk: "Daily, weekly, monthly adoption",
        sampleQueries: [
          "Show kiosk adoption trajectory over the last 90 days",
          "Day-of-week usage trends and weekend check-in volume",
          "Monthly growth in patients opting for digital self-service",
        ],
        iconName: "TrendingUp",
      },
      {
        id: "service-optimization",
        category: "Service Optimization",
        whatUsersCanAsk: "AI recommendations for kiosk improvements",
        sampleQueries: [
          "Which UI steps should be simplified to speed up check-in?",
          "Optimal kiosk terminal placement based on lobby foot traffic",
          "Recommendations to reduce kiosk payment timeout rates",
        ],
        iconName: "Sliders",
      },
      {
        id: "maintenance-alerts",
        category: "Maintenance Alerts",
        whatUsersCanAsk: "Devices needing maintenance",
        sampleQueries: [
          "List kiosk units flagged for scheduled hardware checkup",
          "Printers that have generated over 5,000 receipts without cleaning",
          "Touchscreen calibration alerts and hardware diagnostics status",
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
        category: "Sales Insights",
        whatUsersCanAsk: "Revenue, orders, trends",
        sampleQueries: [
          "What is our gross merchandise value (GMV) this week?",
          "Average order value (AOV) across website and retail outlets",
          "Sales trajectory compared to same period last month",
        ],
        iconName: "BarChart3",
      },
      {
        id: "product-performance",
        category: "Product Performance",
        whatUsersCanAsk: "Best sellers, poor performers",
        sampleQueries: [
          "Which garment styles are top sellers this season?",
          "Identify slow-moving SKUs with high inventory aging",
          "Sell-through rates for newly launched summer collection",
        ],
        iconName: "PackageCheck",
      },
      {
        id: "inventory-intelligence",
        category: "Inventory Intelligence",
        whatUsersCanAsk: "Fast moving, dead stock, low inventory",
        sampleQueries: [
          "Which popular garment sizes are currently out of stock?",
          "Dead stock report for styles with zero sales in 60 days",
          "Inventory turnover ratio across central warehouse and stores",
        ],
        iconName: "Boxes",
      },
      {
        id: "return-intelligence",
        category: "Return Intelligence",
        whatUsersCanAsk: "Return reasons, return trends",
        sampleQueries: [
          "Top return reasons: sizing issues vs fabric vs defect",
          "Return rate percentage by garment category (dresses, shirts, pants)",
          "Which vendor styles experience the highest return frequency?",
        ],
        iconName: "RotateCcw",
      },
      {
        id: "customer-insights",
        category: "Customer Insights",
        whatUsersCanAsk: "New, repeat, loyal customers",
        sampleQueries: [
          "Repeat purchase rate and customer lifetime value (LTV)",
          "Customer acquisition trends across paid and organic channels",
          "VIP loyalty tier spending habits and favorite categories",
        ],
        iconName: "Users",
      },
      {
        id: "order-management",
        category: "Order Management",
        whatUsersCanAsk: "Pending shipped, cancelled orders",
        sampleQueries: [
          "Current order fulfillment status and pending shipments",
          "Cancellation rate and reasons before warehouse dispatch",
          "Average delivery turnaround time by courier partner",
        ],
        iconName: "ShoppingBag",
      },
      {
        id: "store-performance",
        category: "Store Performance",
        whatUsersCanAsk: "Compare online channels",
        sampleQueries: [
          "Compare sales: Brand Website vs Marketplace vs Retail Stores",
          "Gross margin comparison across different sales channels",
          "Conversion rates by online traffic source and marketing campaign",
        ],
        iconName: "Store",
      },
      {
        id: "category-analysis",
        category: "Category Analysis",
        whatUsersCanAsk: "Men's, Women's, Kids performance",
        sampleQueries: [
          "Sales and revenue distribution: Men's vs Women's vs Kids",
          "Growth rate in ethnic wear vs casual wear categories",
          "Average selling price (ASP) comparison across departments",
        ],
        iconName: "Layers",
      },
      {
        id: "demand-forecasting",
        category: "Demand Forecasting",
        whatUsersCanAsk: "Predict product demand",
        sampleQueries: [
          "Forecast demand for festive and wedding season collections",
          "Anticipated fabric requirement and lead times for winter jackets",
          "Predicted stockout risk for high-velocity styles",
        ],
        iconName: "Activity",
      },
      {
        id: "trend-analysis",
        category: "Trend Analysis",
        whatUsersCanAsk: "Popular colours, sizes, styles",
        sampleQueries: [
          "Top performing color palettes and print patterns this month",
          "Size curve demand distribution (S, M, L, XL, XXL)",
          "Trending silhouettes gaining traction in women's apparel",
        ],
        iconName: "Palette",
      },
      {
        id: "merchandising",
        category: "Merchandising",
        whatUsersCanAsk: "Stock recommendations, assortment optimization",
        sampleQueries: [
          "Optimal store assortment plan for flagship retail branches",
          "Recommended replenishment quantities for warehouse buffer",
          "Markdown and promotional bundle strategies for end-of-season sale",
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
