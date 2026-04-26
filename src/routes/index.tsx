import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DRUGS } from "@/anaesthesia/data";
import { PROCEDURES } from "@/anaesthesia/procedures";
import { DrugCalc } from "@/anaesthesia/panels/DrugCalc";
import { Airway } from "@/anaesthesia/panels/Airway";
import { Crisis } from "@/anaesthesia/panels/Crisis";
import { NerveAtlas } from "@/anaesthesia/panels/NerveAtlas";
import { Risk } from "@/anaesthesia/panels/Risk";
import { Fluid } from "@/anaesthesia/panels/Fluid";
import { Procedures } from "@/anaesthesia/panels/Procedures";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AnaesthesiaPro — Pocket Clinical Reference" },
      { name: "description", content: "Drug doses, airway algorithm, crisis checklists, regional blocks, scoring, fluids and procedure checklists for anaesthetists." },
      { property: "og:title", content: "AnaesthesiaPro — Pocket Clinical Reference" },
      { property: "og:description", content: "Drug doses, airway algorithm, crisis checklists, regional blocks, scoring, fluids and procedure checklists for anaesthetists." },
    ],
  }),
  component: Index,
});

const TABS: { id: string; label: string; crisis?: boolean }[] = [
  { id: "drug", label: "Drugs" },
  { id: "airway", label: "Airway" },
  { id: "crisis", label: "Crisis", crisis: true },
  { id: "nerve", label: "Regional" },
  { id: "risk", label: "Risk" },
  { id: "fluid", label: "Fluid" },
  { id: "procedures", label: "Checklists" },
];

function Disclaimer({ onAccept }: { onAccept: () => void }) {
  return (
    <div className="app" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 20 }}>
      <div style={{ maxWidth: 520, background: "#161b26", border: "1px solid #f59e0b66", borderRadius: 14, padding: 22 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: "#f59e0b", fontWeight: 800, marginBottom: 8 }}>⚠️ IMPORTANT NOTICE</div>
        <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 14, color: "#e2e8f0" }}>Disclaimer</div>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: "#cbd5e1", marginBottom: 20 }}>
          This app is for reference purposes only. Clinical decisions must be made on a case-by-case, patient-by-patient basis by a qualified healthcare professional. The developer accepts no liability for errors or adverse outcomes from use of this app. Content references DGAI and AWMF guidelines — always verify against current local Fachinformation.
        </p>
        <button className="btn btn-a btn-full" onClick={onAccept} style={{ fontWeight: 800 }}>
          I Understand — Continue
        </button>
      </div>
    </div>
  );
}

function Index() {
  const [accepted, setAccepted] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("ap_disclaimer_ok") === "1";
  });
  const [tab, setTab] = useState("drug");

  if (!accepted) return <Disclaimer onAccept={() => { sessionStorage.setItem("ap_disclaimer_ok", "1"); setAccepted(true); }} />;

  return (
    <div className="app">
      <div className="hdr">
        <div className="hdr-row">
          <div className="hdr-left">
            <div className="pulse" />
            <div>
              <div className="hdr-title">AnaesthesiaPro</div>
              <div className="hdr-sub">Pocket Reference · {DRUGS.length} drugs · {PROCEDURES.length} protocols</div>
            </div>
          </div>
          {tab === "crisis" && <div className="ebadge">EMERGENCY</div>}
        </div>
      </div>
      <div className="nav">
        {TABS.map((t) => (
          <button key={t.id} className={`nb ${tab === t.id ? "on" : ""} ${t.crisis ? "cr" : ""}`} onClick={() => setTab(t.id)}>
            {t.crisis ? "🚨 " + t.label : t.label}
          </button>
        ))}
      </div>
      <div className="content">
        {tab === "drug" && <DrugCalc />}
        {tab === "airway" && <Airway />}
        {tab === "crisis" && <Crisis />}
        {tab === "nerve" && <NerveAtlas />}
        {tab === "risk" && <Risk />}
        {tab === "fluid" && <Fluid />}
        {tab === "procedures" && <Procedures />}
      </div>
    </div>
  );
}
