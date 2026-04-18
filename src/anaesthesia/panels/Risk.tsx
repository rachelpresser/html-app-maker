import { useState } from "react";
import { T } from "../theme";

export function Risk() {
  const [scorer, setScorer] = useState<"asa" | "rcri" | "stopbang" | "apfel">("asa");
  const [asa, setAsa] = useState<number | null>(null);
  const [rcri, setRcri] = useState<Record<string, boolean>>({});
  const [sb, setSb] = useState<Record<string, boolean>>({});
  const [apfel, setApfel] = useState<Record<string, boolean>>({});
  const rcriScore = Object.values(rcri).filter(Boolean).length;
  const sbScore = Object.values(sb).filter(Boolean).length;
  const apfelScore = Object.values(apfel).filter(Boolean).length;
  const rcriR = [{ risk: "<1%", lbl: "Very Low", c: T.green }, { risk: "~1%", lbl: "Low", c: T.green }, { risk: "~7%", lbl: "Moderate", c: T.amber }, { risk: "~11%", lbl: "High", c: T.red }, { risk: ">11%", lbl: "Very High", c: T.red }][Math.min(rcriScore, 4)];
  const sbR = sbScore <= 2 ? { risk: "Low", lbl: "Low OSA risk", c: T.green } : sbScore <= 4 ? { risk: "Moderate", lbl: "Moderate - sleep study", c: T.amber } : { risk: "High", lbl: "High risk OSA - plan airway", c: T.red };
  const apfelR = [{ risk: "10%", lbl: "Low - no prophylaxis needed", c: T.green }, { risk: "21%", lbl: "Low-moderate", c: T.green }, { risk: "39%", lbl: "Moderate - 1 agent", c: T.amber }, { risk: "61%", lbl: "High - 2 agents", c: T.red }, { risk: "79%", lbl: "Very high - 3 agents", c: T.red }][Math.min(apfelScore, 4)];
  const asaMeta: Record<number, [string, string]> = { 1: ["Normal healthy", T.green], 2: ["Mild systemic disease", T.green], 3: ["Severe systemic disease", T.amber], 4: ["Life-threatening disease", T.red], 5: ["Moribund - not expected to survive 24h", T.red], 6: ["Brain-dead, organ donation", T.muted] };
  return (
    <div>
      <div className="pg-title">Preop Scoring</div>
      <div className="pg-sub">ASA · RCRI · STOP-BANG · Apfel PONV</div>
      <div className="tabs">
        {([["asa", "ASA"], ["rcri", "RCRI"], ["stopbang", "STOP-BANG"], ["apfel", "Apfel"]] as const).map(([k, l]) => (
          <button key={k} className={`tab ${scorer === k ? "on" : ""}`} onClick={() => setScorer(k)}>{l}</button>
        ))}
      </div>
      {scorer === "asa" && (
        <div>
          <div className="card">
            <div className="card-hd">🩺 ASA Physical Status</div>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="cl-item" onClick={() => setAsa(n)}>
                <div className="cl-box" style={{ background: asa === n ? asaMeta[n][1] : "transparent", borderColor: asa === n ? asaMeta[n][1] : T.border }}>
                  {asa === n && <span style={{ fontSize: 10, color: T.bg, fontWeight: 700 }}>✓</span>}
                </div>
                <div><span style={{ fontWeight: 700, color: asaMeta[n][1] }}>ASA {n}</span><span style={{ fontSize: 12, color: T.muted, marginLeft: 8 }}>{asaMeta[n][0]}</span></div>
              </div>
            ))}
          </div>
          {asa && <div className="score-display">
            <div className="sc-num" style={{ color: asaMeta[asa][1] }}>ASA {asa}</div>
            <div className="sc-lbl">{asaMeta[asa][0]}</div>
            <span className="badge" style={{ background: `${asaMeta[asa][1]}22`, color: asaMeta[asa][1], border: `1px solid ${asaMeta[asa][1]}44` }}>{asa <= 2 ? "Low periop risk" : asa === 3 ? "Moderate - optimise" : asa <= 5 ? "High risk - senior involvement" : "Organ donation"}</span>
          </div>}
          <div className="info-box">Add 'E' suffix for emergency surgery (e.g. ASA 3E). Increases perioperative risk by ~1 class.</div>
        </div>
      )}
      {scorer === "rcri" && (
        <div>
          <div className="card">
            <div className="card-hd">❤️ Revised Cardiac Risk Index</div>
            {[["hd", "High-risk surgery (intrathoracic/suprainguinal/intracranial)"], ["chf", "History of congestive heart failure"], ["cvd", "History of cerebrovascular disease (TIA or stroke)"], ["ihd", "History of ischaemic heart disease"], ["dm", "Insulin-dependent diabetes mellitus"], ["renal", "Preoperative creatinine >177 micromol/L"]].map(([k, l]) => (
              <div key={k} className="cl-item" onClick={() => setRcri((r) => ({ ...r, [k]: !r[k] }))}>
                <div className="cl-box" style={{ background: rcri[k] ? T.accent : "transparent", borderColor: rcri[k] ? T.accent : T.border }}>
                  {rcri[k] && <span style={{ fontSize: 10, color: T.bg, fontWeight: 700 }}>✓</span>}
                </div>
                <div className="cl-txt">{l}</div>
              </div>
            ))}
          </div>
          <div className="score-display">
            <div className="sc-num" style={{ color: rcriR.c }}>{rcriScore}</div>
            <div className="sc-lbl">RCRI Score</div>
            <div style={{ marginBottom: 7 }}><span className="badge" style={{ background: `${rcriR.c}22`, color: rcriR.c, border: `1px solid ${rcriR.c}44` }}>{rcriR.lbl}</span></div>
            <div style={{ fontSize: 14, color: rcriR.c, fontFamily: "IBM Plex Mono", fontWeight: 700 }}>MACE risk: {rcriR.risk}</div>
          </div>
          <div className="info-box">Consider cardiology review if RCRI &gt;=3 or new cardiac symptoms.</div>
        </div>
      )}
      {scorer === "stopbang" && (
        <div>
          <div className="card">
            <div className="card-hd">😴 STOP-BANG (OSA Screening)</div>
            {[["snore", "S - Snore loudly"], ["tired", "T - Often tired / daytime sleepy"], ["observed", "O - Observed stopping breathing during sleep"], ["pressure", "P - High blood pressure or treated for it"], ["bmi", "B - BMI >35 kg/m2"], ["age", "A - Age >50 years"], ["neck", "N - Neck circumference >40 cm"], ["gender", "G - Male gender"]].map(([k, l]) => (
              <div key={k} className="cl-item" onClick={() => setSb((s) => ({ ...s, [k]: !s[k] }))}>
                <div className="cl-box" style={{ background: sb[k] ? T.accent : "transparent", borderColor: sb[k] ? T.accent : T.border }}>
                  {sb[k] && <span style={{ fontSize: 10, color: T.bg, fontWeight: 700 }}>✓</span>}
                </div>
                <div className="cl-txt" style={{ fontFamily: "IBM Plex Mono", fontSize: 12 }}>{l}</div>
              </div>
            ))}
          </div>
          <div className="score-display">
            <div className="sc-num" style={{ color: sbR.c }}>{sbScore}/8</div>
            <div className="sc-lbl">STOP-BANG Score</div>
            <div style={{ marginBottom: 7 }}><span className="badge" style={{ background: `${sbR.c}22`, color: sbR.c, border: `1px solid ${sbR.c}44` }}>{sbR.risk}</span></div>
            <div style={{ fontSize: 12, color: T.muted }}>{sbR.lbl}</div>
          </div>
          <div className="info-box">High risk OSA: plan difficult airway. CPAP if known OSA. Post-op SpO2 monitoring. Opioid-sparing analgesia preferred.</div>
        </div>
      )}
      {scorer === "apfel" && (
        <div>
          <div className="card">
            <div className="card-hd">🤢 Apfel Score - PONV Risk</div>
            {[["female", "Female sex"], ["nonsmoker", "Non-smoker"], ["ponv", "History of PONV or motion sickness"], ["opioid", "Postoperative opioid planned"]].map(([k, l]) => (
              <div key={k} className="cl-item" onClick={() => setApfel((a) => ({ ...a, [k]: !a[k] }))}>
                <div className="cl-box" style={{ background: apfel[k] ? T.accent : "transparent", borderColor: apfel[k] ? T.accent : T.border }}>
                  {apfel[k] && <span style={{ fontSize: 10, color: T.bg, fontWeight: 700 }}>✓</span>}
                </div>
                <div className="cl-txt">{l}</div>
              </div>
            ))}
          </div>
          <div className="score-display">
            <div className="sc-num" style={{ color: apfelR.c }}>{apfelScore}/4</div>
            <div className="sc-lbl">Apfel Score</div>
            <div style={{ marginBottom: 7 }}><span className="badge" style={{ background: `${apfelR.c}22`, color: apfelR.c, border: `1px solid ${apfelR.c}44` }}>{apfelR.lbl}</span></div>
            <div style={{ fontSize: 14, fontFamily: "IBM Plex Mono", color: apfelR.c }}>PONV risk: {apfelR.risk}</div>
          </div>
          <div className="info-box">Apfel &gt;=2: dual prophylaxis (ondansetron + dexamethasone). Apfel &gt;=3: triple therapy (add droperidol). TIVA reduces PONV by ~25%.</div>
        </div>
      )}
    </div>
  );
}
