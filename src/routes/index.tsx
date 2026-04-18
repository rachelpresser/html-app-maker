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

function Index() {
  const [tab, setTab] = useState("drug");
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
