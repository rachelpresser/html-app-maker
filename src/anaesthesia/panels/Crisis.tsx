import { useState } from "react";
import { T } from "../theme";
import { CRISES } from "../data";

export function Crisis() {
  const [active, setActive] = useState<string | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const toggle = (k: string, i: number) => setChecked((c) => ({ ...c, [`${k}-${i}`]: !c[`${k}-${i}`] }));

  if (active) {
    const c = CRISES[active];
    const done = c.steps.filter((_, i) => checked[`${active}-${i}`]).length;
    const pct = Math.round((done / c.steps.length) * 100);
    return (
      <div>
        <button className="btn btn-o btn-sm" style={{ marginBottom: 14 }} onClick={() => { setActive(null); setChecked({}); }}>{"← Crises"}</button>
        <div style={{ color: c.col, fontSize: 20, fontWeight: 900, marginBottom: 3 }}>{c.title}</div>
        <div style={{ fontSize: 10, color: T.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 13 }}>Emergency Checklist</div>
        <div style={{ background: `${c.col}15`, border: `1px solid ${c.col}44`, borderRadius: 9, padding: 11, marginBottom: 9, fontSize: 12, color: c.col, lineHeight: 1.6 }}><strong>Trigger:</strong> {c.trigger}</div>
        <div style={{ background: `${c.col}25`, border: `1px solid ${c.col}55`, borderRadius: 9, padding: 11, marginBottom: 9, fontSize: 13, fontWeight: 700, color: c.col }}>💊 {c.drugs}</div>
        {c.signs && <div style={{ background: `${c.col}10`, border: `1px solid ${c.col}30`, borderRadius: 9, padding: 10, marginBottom: 12, fontSize: 11, color: T.text, lineHeight: 1.6 }}><span style={{ color: c.col, fontWeight: 700 }}>Signs: </span>{c.signs}</div>}
        <div className="prog-meta"><span>{done}/{c.steps.length} complete</span><span style={{ color: c.col }}>{pct}%</span></div>
        <div className="prog-bar"><div className="prog-fill" style={{ width: `${pct}%`, background: c.col }} /></div>
        <div className="card" style={{ marginTop: 10 }}>
          {c.steps.map((step, i) => (
            <div key={i} className="cl-item" onClick={() => toggle(active, i)}>
              <div className={`cl-box ${checked[`${active}-${i}`] ? "on" : ""}`} style={checked[`${active}-${i}`] ? {} : { borderColor: `${c.col}66` }}>
                {checked[`${active}-${i}`] && <span style={{ fontSize: 10, color: T.bg, fontWeight: 700 }}>✓</span>}
              </div>
              <div className={`cl-txt ${checked[`${active}-${i}`] ? "done" : ""}`}>
                <span style={{ color: step.startsWith("  ") ? T.muted : undefined }}>{step}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const LIST = [
    { k: "mh", title: "Malignant Hyperthermia", sub: "Volatile agents · Suxamethonium" },
    { k: "anaphylaxis", title: "Anaphylaxis", sub: "NMBA · Antibiotics · Latex · Chlorhexidine" },
    { k: "last", title: "LAST - Local Anaesthetic Toxicity", sub: "Intralipid rescue" },
    { k: "cpr", title: "Perioperative Cardiac Arrest", sub: "4H + 4T · ALS algorithm" },
    { k: "highspinal", title: "High / Total Spinal", sub: "Ascending block · Respiratory failure" },
    { k: "msfailure", title: "Equipment Failure", sub: "Ventilator · Circuit · Gas supply" },
  ];

  return (
    <div>
      <div className="pg-title">Crisis Checklists</div>
      <div className="pg-sub">Tap to activate emergency protocol</div>
      <div className="warn-box" style={{ marginBottom: 12 }}>⚠️ These checklists support decision-making. Always involve senior help early.</div>
      {LIST.map(({ k, title, sub }) => {
        const c = CRISES[k];
        return (
          <div key={k} className="crisis-hero" style={{ background: `${c.col}10`, border: `1px solid ${c.col}44` }} onClick={() => setActive(k)}>
            <div className="ch-title" style={{ color: c.col }}>{title}</div>
            <div className="ch-sub" style={{ color: c.col }}>{sub}</div>
            <div style={{ marginTop: 7, display: "flex", gap: 5 }}>
              <span className="badge" style={{ background: `${c.col}22`, color: c.col, border: `1px solid ${c.col}44` }}>{c.steps.length} steps</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
