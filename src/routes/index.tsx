// © 2026 Rachel Presser / AnaesthesiaPro. All rights reserved.
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import posthog from "posthog-js";
import { DRUGS } from "@/anaesthesia/data";
import { PROCEDURES } from "@/anaesthesia/procedures";
import { DrugCalc } from "@/anaesthesia/panels/DrugCalc";
import { Airway } from "@/anaesthesia/panels/Airway";
import { Crisis } from "@/anaesthesia/panels/Crisis";
import { NerveAtlas } from "@/anaesthesia/panels/NerveAtlas";
import { Risk } from "@/anaesthesia/panels/Risk";
import { Fluid } from "@/anaesthesia/panels/Fluid";
import { Procedures } from "@/anaesthesia/panels/Procedures";
import { FeedbackButton } from "@/components/FeedbackButton";

export const Route = createFileRoute("/")({
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

const DISCLAIMER_KEY = "anaesthesiapro_disclaimer_v1";

function DisclaimerScreen({ onAccept }: { onAccept: () => void }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#070b14",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{
        maxWidth: 480, width: "100%",
        background: "#0e1420",
        border: "1px solid #1e3a5f",
        borderRadius: 14,
        padding: "28px 24px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "#1a2a44",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, flexShrink: 0,
          }}>⚕️</div>
          <div>
            <div style={{ color: "#e2e8f0", fontWeight: 800, fontSize: 16 }}>Medical Disclaimer</div>
            <div style={{ color: "#64748b", fontSize: 11, marginTop: 1 }}>Please read before continuing</div>
          </div>
        </div>
        <div style={{
          background: "#0a0f1a",
          border: "1px solid #1e3a5f",
          borderRadius: 9,
          padding: "14px 16px",
          marginBottom: 22,
          color: "#94a3b8",
          fontSize: 13,
          lineHeight: 1.7,
        }}>
          This app is for <strong style={{ color: "#e2e8f0" }}>reference purposes only</strong>. Clinical decisions must be made on a case-by-case, patient-by-patient basis by a qualified healthcare professional.
          <br /><br />
          Drug doses must be verified against current local <strong style={{ color: "#e2e8f0" }}>Fachinformation</strong> and <strong style={{ color: "#e2e8f0" }}>DGAI/AWMF guidelines</strong>.
          <br /><br />
          The developer accepts <strong style={{ color: "#e2e8f0" }}>no liability</strong> for errors or adverse outcomes from use of this app.
        </div>
        <button
          onClick={onAccept}
          style={{
            width: "100%",
            padding: "13px 0",
            borderRadius: 9,
            border: "none",
            background: "#1d4ed8",
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            letterSpacing: 0.3,
          }}
        >
          I Understand — Continue
        </button>
      </div>
    </div>
  );
}

function Index() {
  const [accepted, setAccepted] = useState(() => !!localStorage.getItem(DISCLAIMER_KEY));
  const [tab, setTab] = useState("drug");

  if (!accepted) {
    return (
      <DisclaimerScreen
        onAccept={() => {
          localStorage.setItem(DISCLAIMER_KEY, "1");
          posthog.capture("disclaimer_accepted");
          setAccepted(true);
        }}
      />
    );
  }

  const handleTabChange = (id: string) => {
    setTab(id);
    posthog.capture("tab_opened", { tab: id });
  };

  return (
    <div className="app">
      <div className="hdr">
        <div className="hdr-row">
          <div className="hdr-left">
            <div className="pulse" />
            <div>
              <div className="hdr-title">AnaesthesiaPro</div>
              <div className="hdr-sub">DGAI/AWMF Guidelines · {DRUGS.length} drugs · {PROCEDURES.length} protocols</div>
            </div>
          </div>
          {tab === "crisis" && <div className="ebadge">EMERGENCY</div>}
        </div>
      </div>
      <div className="nav">
        {TABS.map((t) => (
          <button key={t.id} className={`nb ${tab === t.id ? "on" : ""} ${t.crisis ? "cr" : ""}`} onClick={() => handleTabChange(t.id)}>
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
      <footer style={{
        textAlign: "center",
        padding: "10px 16px 16px",
        color: "#475569",
        fontSize: 10,
        letterSpacing: 0.3,
        borderTop: "1px solid #0e1a2e",
      }}>
        © 2026 Rachel Presser / AnaesthesiaPro · For qualified healthcare professionals only
      </footer>
      <FeedbackButton />
    </div>
  );
}
