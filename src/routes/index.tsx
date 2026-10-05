import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, ChevronDown, FileText, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Claim Overview | CLM-94021" },
      { name: "description", content: "Claim overview, flagged anomaly findings, verification checklist and recommended next steps for CLM-94021." },
      { property: "og:title", content: "Claim Overview | CLM-94021" },
      { property: "og:description", content: "Claim overview, flagged anomaly findings, verification checklist and recommended next steps for CLM-94021." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClaimPage,
});

type Section = "findings" | "checklist" | "steps";
const findings = [
  { title: "Procedure & Clinical Pathway Deviation", body: "Prescribed treatment plan includes 3 invasive procedures that deviate from established clinical guidelines for the diagnosis.", impact: "Unwarranted invasive interventions increase claim severity by ₹38,000.", priority: "High Priority" },
  { title: "Unjustified Medication & Specialist Over-Consultation", body: "Atypical prescription of broad-spectrum antibiotic and 4 uncoordinated specialist consults within 48 hours.", impact: "Excessive drug tariff markup: lack of cross-specialty clinical handover notes.", priority: "High Priority" },
  { title: "Duplicate Invoice & Test Repetition Billing", body: "Duplicate invoice matching prior claim and 3x repeated lab tests without clinical indication.", impact: "Identified exact hash collision with prior settled claim #CLM-78391 for ₹28,750.", priority: "Critical Priority" },
  { title: "Proximity Meter Outlier Score Deviation", body: "GD proximity score (10. 8) deviates into the 95th percentile, signaling high fraud probability.", impact: "Patient residential GPS deviates >140km while 6 nearby empanelled network hospitals were bypassed.", priority: "High Priority" },
  { title: "High-Frequency Claim Velocity Pattern", body: "4 claims filed in 90 days with the same provider, with cumulative claims 6.8x above average tier.", impact: "Abnormal velocity cluster triggering automated SIU (Special Investigation Unit) review protocol.", priority: "Medium Priority" },
];
const checks = [
  { question: "Does the claim fall within exclusions?", detail: "Borderline-pre-existing condition clause may apply", status: "Flagged" },
  { question: "Was the policy recently purchased or materially modified?", detail: "Policy modified 12 days before incident", status: "Failed" },
  { question: "Was coverage increased shortly before the incident?", detail: "Sum insured raised from ₹5L to ₹15L, 18 days prior", status: "Failed" },
  { question: "Has the insured made similar claims previously?", detail: "4 claims in last 90 days with same physician", status: "Flagged" },
  { question: "Is the sum insured sufficient for the claim amount?", detail: "Claim is 92% of total sum insured", status: "Flagged" },
  { question: "Does Government PAN card name strictly match member records?", detail: "Name difference: 'Johnathan E. Doe' on PAN vs John Doe on policy registration.", status: "Flagged" },
  { question: "Was treatment active during entire length of hospital stay?", detail: "No active therapeutic notes or vitals monitored during last 22 hours prior to discharge", status: "Flagged" },
  { question: "Does treating physician prescription carry official seal & registration stamp?", detail: "Missing official MCI/NMC medical registration stamp on primary prescription sheet", status: "Failed" },
  { question: "Is formal inpatient discharge summary attached and complete?", detail: "Discharge summary document missing fromuploaded patient packet", status: "Failed" },
];
const steps = [
  { title: "Doctor Seal Not Found", body: "The prescription and referral letter do not carry the physician's official seal or stamp. A valid stamp is mandatory for hospital claim approval.", suggested: "Request Re-upload", docs: [{ title: "Prescription & Referral Letter", file: "prescription-refer 1.4 MB" }] },
  { title: "Discharge Summary Missing", body: "No discharge summary has been attached. This document is required for inpatient treatment and settlement processing.", suggested: "Request Re-upload", docs: [{ title: "Discharge Summary", file: "discharge-summar... 2.8 MB" }] },
  { title: "Duplicate Invoice Detected", body: "Pharmacy Bill appears to be a duplicate of a previously submitted claim (#CLM-78391). Line item totals and invoice numbers match.", suggested: "Flag Duplicate", docs: [{ title: "Pharmacy Bill", file: "pharmacy-bill.png 1.8 MB" }] },
  { title: "Billing Amount Mismatch", body: "The total on the hospital bill (₹1,42,500) does not match the itemised breakdown in the discharge summary (₹1.28.750). A difference of ₹13,750 needs reconciliation.", suggested: "Request Clarification", docs: [{ title: "Hospital Final Bill", file: "bill-final pdf 3.2 MB" }, { title: "Discharge Summary", file: "discharge-summar... 2.8 MB" }] },
];
const scores = [
  { title: "Diagnosis & Procedures", score: 94, match: "Match", description: "High alignment with doctor's plan, minimal differences in diagnostic tests or treatment." },
  { title: "Medication", score: 62, match: "Low Match", description: "Major differences in prescribed vs. AI-suggested medications, including drug dosages and combinations." },
  { title: "Reports & Test Results", score: 48, match: "Match", description: "Variations in test results or excessive repeats may be a sign of data manipulation or efforts to overcharge." },
];

function ClaimPage() {
  const [section, setSection] = useState<Section>("findings");
  const [openFinding, setOpenFinding] = useState<number | null>(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Flags & Warnings");
  const [queryStep, setQueryStep] = useState<number | null>(null);
  const visibleChecks = useMemo(() => checks.filter((item) => {
    const matchesFilter = filter === "Flags & Warnings" || item.status === filter;
    return matchesFilter && `${item.question} ${item.detail}`.toLowerCase().includes(search.toLowerCase());
  }), [filter, search]);
  const selectedStep = queryStep === null ? undefined : steps[queryStep];

  return (
    <main className="min-h-screen bg-canvas pb-24 text-foreground">
      <div className="mx-auto max-w-[1440px] px-5 pt-6 sm:px-8 lg:px-14 lg:pt-9">
        <div className="mb-5 flex items-center justify-between border-b border-foreground/20 pb-3 text-[10px] font-bold uppercase tracking-widest sm:text-xs">
          <span>Claim Overview</span><span>Claim Reference: CLM-94021</span>
        </div>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,.65fr)]">
          <section className="flex min-h-[350px] flex-col justify-between bg-card p-7 sm:p-10 lg:p-12" aria-label="Patient Information">
            <div className="flex items-center justify-between border-b border-border pb-5"><h2 className="font-display text-2xl">Patient Information</h2></div>
            <div className="py-8 lg:py-12"><p className="text-xs uppercase text-ink-soft">Patient Information</p><p className="mt-3 font-display text-5xl leading-tight sm:text-6xl">Elena Smith</p><p className="mt-2 text-sm text-ink-soft">(28y, Female)</p></div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-5 border-t border-border pt-6 text-sm">
              <div><p className="mb-2 text-xs text-ink-soft">Policy Number</p><p className="font-semibold">#INS-2026-00389</p></div>
              <div><p className="mb-2 text-xs text-ink-soft">Total Claimed</p><p className="font-display text-xl">₹1,42,500</p></div>
              <div><p className="mb-2 text-xs text-ink-soft">Hospital / Center</p><p className="font-semibold">Apex Multi-Specialty Medical Center</p></div>
              <div><p className="mb-2 text-xs text-ink-soft">Hospitalization Stay</p><p className="font-semibold">14 Feb 2026 – 18 Feb 2026<br />(4 days)</p></div>
            </div>
            <div className="mt-7 flex items-center justify-between border-t border-border pt-4 text-xs"><span className="text-ink-soft">Adjudication Tier</span><span className="font-bold">High Risk Dossier</span></div>
          </section>
          <section className="flex min-h-[350px] flex-col justify-between bg-primary p-7 sm:p-10">
            <div className="flex items-start justify-between gap-4">
              <span className="text-xs font-bold uppercase tracking-widest">Claim Overview</span>
              <span className="rounded-full border border-foreground px-3 py-1 text-[11px] font-bold uppercase">Overall Risk: High</span>
            </div>
            <h1 className="font-display text-4xl leading-[.95] sm:text-5xl">Claim<br />Overview<span className="inline-block align-top text-xl">↗</span></h1>
            <div className="flex items-end justify-between gap-4">
              <p className="max-w-[230px] text-sm leading-relaxed">High overall risk detected with 87% confidence, requiring immediate human investigation.</p>
              <div className="shrink-0 text-right"><div className="font-display text-6xl leading-none sm:text-7xl">87<span className="text-3xl">%</span></div><div className="mt-2 text-xs font-bold uppercase tracking-widest">Risk Probability</div></div>
            </div>
          </section>
        </div>

        <section className="mt-5 bg-card px-7 py-8 sm:px-10 sm:py-10" aria-label="Protocol match">
          <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-border pb-5"><h2 className="font-display text-2xl sm:text-3xl">Protocol match</h2><span className="text-xs text-ink-soft">Ideal score: 70+ • Protocol match</span></div>
          <div className="grid gap-7 md:grid-cols-3 md:gap-0">{scores.map((item, i) => (
            <div key={item.title} className={`flex flex-col ${i > 0 ? "md:border-l md:border-border md:pl-8" : ""} ${i < 2 ? "md:pr-8" : ""}`}>
              <div className="flex min-h-24 items-start justify-between gap-3"><h3 className="max-w-44 font-display text-xl leading-tight">{item.title}</h3><div className="font-display text-4xl leading-none">{item.score}<span className="text-lg">%</span></div></div>
              <div className="mb-5 h-2 w-full bg-surface-soft"><div className={`h-full ${item.score >= 70 ? "bg-primary" : "bg-foreground"}`} style={{ width: `${item.score}%` }} /></div>
              <span className="mb-3 text-[11px] font-bold uppercase tracking-widest">{item.match}</span>
              <p className="max-w-xs text-sm leading-relaxed text-ink-soft">{item.description}</p>
            </div>
          ))}</div>
        </section>

        <section id="dossier-content" className="scroll-mt-5 pt-14 sm:pt-20">
          <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-3 text-xs font-bold uppercase tracking-widest">High Risk Dossier</p><h2 className="font-display text-4xl leading-none sm:text-5xl">{section === "findings" ? "Flagged anomaly findings" : section === "checklist" ? "Verification checklist" : "Recommended next steps"}</h2></div><div className="font-display text-6xl leading-none">{section === "findings" ? "05" : section === "checklist" ? "53" : "08"}</div></div>
          <div className="mb-5 flex overflow-x-auto border-b border-foreground/30">
            {([ ["findings", "Flagged anomaly findings", "5"], ["checklist", "Verification checklist", "53"], ["steps", "Recommended next steps", "8"] ] as const).map(([key, label, count]) => <Button key={key} type="button" variant="editorialGhost" onClick={() => setSection(key)} className={`h-auto shrink-0 rounded-none border-b-2 px-4 py-4 text-xs font-semibold sm:px-6 sm:text-sm ${section === key ? "border-foreground bg-primary" : "border-transparent"}`}>{label}<span className="ml-1 text-ink-soft">{count}</span></Button>)}
          </div>

          {section === "findings" && <div className="bg-card">
            {findings.map((item, i) => <article key={item.title} className="border-b border-border last:border-b-0">
              <Button type="button" variant="editorialGhost" aria-expanded={openFinding === i} onClick={() => setOpenFinding(openFinding === i ? null : i)} className="flex h-auto min-h-28 w-full items-center justify-between gap-4 rounded-none px-5 py-6 text-left whitespace-normal hover:bg-surface-soft sm:px-9">
                <span className="flex min-w-0 items-start gap-4 sm:gap-8"><span className="pt-1 font-display text-sm text-ink-soft">0{i + 1}</span><span className="font-display text-lg font-medium leading-tight sm:text-2xl">{item.title}</span></span>
                <span className="flex shrink-0 items-center gap-4"><span className={`hidden text-[10px] font-bold uppercase tracking-wider sm:block ${item.priority === "Critical Priority" ? "text-alert" : "text-ink-soft"}`}>{item.priority}</span><ChevronDown className={`size-5 transition-transform ${openFinding === i ? "rotate-180" : ""}`} /></span>
              </Button>
              {openFinding === i && <div className="grid gap-8 px-5 pb-9 pl-12 sm:grid-cols-2 sm:px-9 sm:pl-[84px]"><p className="max-w-md text-sm leading-relaxed text-ink-soft">{item.body}</p><div className="border-l-2 border-primary pl-5"><p className="mb-2 text-[11px] font-bold uppercase tracking-wider">Clinical/Financial Impact:</p><p className="max-w-md text-sm leading-relaxed">{item.impact}</p><span className={`mt-4 inline-block text-xs font-bold ${item.priority === "Critical Priority" ? "text-alert" : "text-ink-soft"}`}>{item.priority}</span></div></div>}
            </article>)}
          </div>}

          {section === "checklist" && <div className="bg-card">
            <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:px-9"><div className="relative w-full sm:max-w-sm"><Search className="absolute left-0 top-1/2 size-4 -translate-y-1/2 text-ink-soft" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search policy rules or findings" aria-label="Search policy rules or findings" className="h-11 w-full border-b border-border bg-transparent pl-7 pr-2 text-sm outline-none focus:border-foreground" /></div><div className="flex gap-1">{["Flags & Warnings", "Passed", "Flagged", "Failed"].map((name) => <Button key={name} variant={filter === name ? "editorial" : "editorialGhost"} size="sm" className="rounded-none px-2 text-[11px] sm:px-3" onClick={() => setFilter(name)}>{name}</Button>)}</div></div>
            {visibleChecks.map((item, i) => <div key={item.question} className="grid gap-3 border-b border-border p-5 last:border-0 sm:grid-cols-[36px_1fr_100px] sm:gap-6 sm:px-9 sm:py-6"><span className="font-display text-xs text-ink-soft">{String(i + 1).padStart(2, "0")}</span><div><h3 className="font-display text-lg leading-tight">{item.question}</h3><p className="mt-2 text-sm text-ink-soft">{item.detail}</p></div><span className={`flex items-start gap-1.5 text-xs font-bold ${item.status === "Failed" ? "text-alert" : "text-foreground"}`}><span className={`mt-1 size-1.5 rounded-full ${item.status === "Failed" ? "bg-alert" : "bg-primary"}`} />{item.status}</span></div>)}
            {visibleChecks.length === 0 && <div className="p-9 text-sm text-ink-soft">{filter === "Passed" ? "Passed" : "Flags & Warnings"}</div>}
          </div>}

          {section === "steps" && <div className="grid gap-5 lg:grid-cols-2">{steps.map((item, i) => <article key={item.title} className="flex min-h-80 flex-col bg-card p-6 sm:p-9"><div className="mb-7 flex items-start justify-between gap-4"><span className="font-display text-sm text-ink-soft">0{i + 1}</span><ArrowUpRight className="size-5" /></div><h3 className="font-display text-2xl leading-tight sm:text-3xl">{item.title}</h3><p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-soft">{item.body}</p><div className="mt-auto pt-8"><p className="mb-4 text-xs"><span className="font-bold">Suggested: </span>{item.suggested}</p><div className="border-t border-border pt-4"><p className="mb-3 text-[11px] font-bold uppercase tracking-widest">Supporting Documents</p>{item.docs.map((doc) => <div key={doc.title} className="mb-2 flex items-center justify-between gap-3 text-xs"><span className="flex items-center gap-2 font-semibold"><FileText className="size-4" />{doc.title}</span><span className="text-right text-ink-soft">{doc.file}</span></div>)}</div><Button variant="editorialOutline" className="mt-6 h-11 w-full rounded-none" onClick={() => setQueryStep(i)}>Raise Query <ArrowRight /></Button></div></article>)}</div>}
        </section>
        <div className="mt-10 flex items-center justify-between border-t border-foreground/25 pt-5 text-xs font-bold"><span>Claim Reference: CLM-94021</span><Button variant="editorialGhost" className="rounded-none text-xs" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Claim Overview <ArrowDown className="rotate-180" /></Button></div>
      </div>
      {selectedStep && <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 p-4 sm:items-center" onMouseDown={(event) => { if (event.target === event.currentTarget) setQueryStep(null); }}><div role="dialog" aria-modal="true" aria-labelledby="query-title" className="w-full max-w-lg bg-card p-7 shadow-xl sm:p-9"><div className="flex items-start justify-between gap-4"><span className="text-[11px] font-bold uppercase tracking-widest">Recommended next steps</span><Button variant="editorialGhost" size="icon" aria-label="Close" className="-mt-2 -mr-2 rounded-none" onClick={() => setQueryStep(null)}><X /></Button></div><h2 id="query-title" className="mt-7 font-display text-3xl">{selectedStep.title}</h2><p className="mt-4 text-sm leading-relaxed text-ink-soft">{selectedStep.body}</p><div className="mt-8 border-t border-border pt-5 text-sm"><span className="font-bold">Suggested: </span>{selectedStep.suggested}</div></div></div>}
    </main>
  );
}
