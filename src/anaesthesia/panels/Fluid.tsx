import { useState } from "react";
import { T } from "../theme";
import { VASOPRESSORS } from "../data";

export function Fluid() {
  const [tab, setTab] = useState<"fluid" | "vaso" | "calc">("fluid");
  const [weight, setWeight] = useState("70");
  const w = parseFloat(weight) || 0;
  const maint = w > 0 ? (w <= 10 ? w * 4 : w <= 20 ? 40 + (w - 10) * 2 : 60 + (w - 20) * 1) : null;
  const deficit = maint ? Math.round(maint * 8) : null;

  const sections = [
    { title: "🚨 Resuscitation / Shock", items: [
      { h: "Step 1: Identify and treat cause", d: "Haemorrhage (surgical control) · Sepsis (source control + abx) · Distributive (anaphylaxis, spinal) · Cardiogenic (inotropes)" },
      { h: "Balanced crystalloid", d: "Ringer's Lactate / Hartmann's 500 mL rapid. Repeat and reassess. Avoid excess 0.9% saline (hyperchloraemic acidosis).", bc: T.green },
      { h: "Colloid (albumin 5%)", d: "If crystalloid-refractory. Consider in cirrhosis/SBP.", bc: T.amber },
      { h: "Massive haemorrhage", d: "pRBC:FFP:Platelets 1:1:1. TXA within 3h. Target Hb >=70. Monitor Ca2+ (citrate)." }
    ] },
    { title: "🔄 Intraoperative Maintenance", items: [
      { h: "4-2-1 Rule", d: "First 10 kg: 4 mL/kg/h. Next 10 kg: +2 mL/kg/h. Each kg >20 kg: +1 mL/kg/h." },
      { h: "Goal-directed therapy (GDT)", d: "Dynamic parameters: SVV, PPV >13% = fluid responsive. Target MAP >=65, ScvO2 >=65%." }
    ] },
    { title: "🏥 Perioperative Strategy", items: [
      { h: "ERAS / Restrictive", d: "Minor surgery: 1-3 mL/kg/h. No routine fasting deficit replacement. Oral fluids until 2h pre-op." },
      { h: "Major surgery (GDT)", d: "Individualised. SV monitoring. Fluid only if SVR responsive. No blanket liberal strategy." }
    ] },
  ];

  return (
    <div>
      <div className="pg-title">Fluid & Vasopressors</div>
      <div className="pg-sub">Haemodynamic decision support</div>
      <div className="tabs">
        <button className={`tab ${tab === "fluid" ? "on" : ""}`} onClick={() => setTab("fluid")}>Fluid</button>
        <button className={`tab ${tab === "vaso" ? "on" : ""}`} onClick={() => setTab("vaso")}>Vasopressors</button>
        <button className={`tab ${tab === "calc" ? "on" : ""}`} onClick={() => setTab("calc")}>Calculator</button>
      </div>
      {tab === "fluid" && (
        <div>
          {sections.map((section, si) => (
            <div key={si}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.accent, letterSpacing: 1, textTransform: "uppercase", marginBottom: 7, marginTop: si > 0 ? 14 : 0 }}>{section.title}</div>
              {section.items.map((item, ii) => (
                <div key={ii} className="card" style={{ borderColor: (item as any).bc ? `${(item as any).bc}44` : T.border, padding: 13, marginBottom: 7 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{item.h}</div>
                  <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>{item.d}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {tab === "vaso" && (
        <div>
          <div className="card">
            <div className="card-hd">💊 Vasopressor & Inotrope Reference</div>
            <table className="vt">
              <thead><tr><th>Agent</th><th>Dose</th><th>Use</th></tr></thead>
              <tbody>
                {VASOPRESSORS.map((v, i) => (
                  <tr key={i}>
                    <td><div className="vt-name">{v.name}</div><div className="vt-moa">{v.moa}</div></td>
                    <td style={{ color: T.accent, fontFamily: "IBM Plex Mono", fontSize: 10 }}>{v.dose}</td>
                    <td style={{ color: T.muted, fontSize: 11 }}>{v.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="amber-box">⚖️ Target MAP &gt;=65 mmHg (&gt;=80 in chronic hypertension). Always treat underlying cause alongside vasopressors.</div>
          <div className="card" style={{ marginTop: 10 }}>
            <div className="card-hd">🩸 Shock Classification</div>
            {[["Distributive (septic/anaphylaxis)", "decreased SVR, increased CO -> Norepinephrine +/- vasopressin"], ["Hypovolaemic", "Fluid resuscitation -> vasopressors only if refractory"], ["Cardiogenic", "decreased CO, increased SVR -> Dobutamine +/- milrinone +/- vasopressors"], ["Obstructive (PE/tamponade)", "Treat cause -> fluids + vasopressors as bridge"]].map(([t, d], i) => (
              <div key={i} className="det-row"><span className="det-k" style={{ fontSize: 10, minWidth: 120 }}>{t}</span><span className="det-v" style={{ fontSize: 11 }}>{d}</span></div>
            ))}
          </div>
        </div>
      )}
      {tab === "calc" && (
        <div>
          <div className="card">
            <div className="card-hd">⚖️ Fluid Calculator</div>
            <div className="ig">
              <div className="lbl">Patient weight (kg)</div>
              <input className="inp" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70" />
            </div>
          </div>
          {w > 0 && deficit !== null && maint !== null && (
            <div>
              <div className="res-box">
                <div className="res-row"><span className="res-lbl">Maintenance (4-2-1)</span><span className="res-val">{maint} mL/h</span></div>
                <div className="res-row"><span className="res-lbl">8h fasting deficit</span><span className="res-val a">{deficit} mL</span></div>
                <div className="res-row"><span className="res-lbl">Resus bolus (20 mL/kg)</span><span className="res-val">{Math.round(w * 20)} mL</span></div>
                <div className="res-row"><span className="res-lbl">Cautious bolus (10 mL/kg)</span><span className="res-val g">{Math.round(w * 10)} mL</span></div>
                <div className="res-row"><span className="res-lbl">Deficit 1st hour (50%)</span><span className="res-val">{Math.round(deficit * 0.5)} mL</span></div>
              </div>
              <div className="card" style={{ marginTop: 10 }}>
                <div className="card-hd">🩸 Transfusion Thresholds</div>
                <div className="det-row"><span className="det-k">Hb trigger (general)</span><span className="det-v" style={{ color: T.amber }}>70 g/L (7 g/dL)</span></div>
                <div className="det-row"><span className="det-k">Hb trigger (cardiac)</span><span className="det-v" style={{ color: T.amber }}>80 g/L (8 g/dL)</span></div>
                <div className="det-row"><span className="det-k">pRBC dose</span><span className="det-v">{Math.round(w * 4)} mL (4 mL/kg approx +10 g/L Hb)</span></div>
                <div className="det-row"><span className="det-k">Platelets trigger</span><span className="det-v">&lt;=50x10^9/L (surgery)</span></div>
                <div className="det-row"><span className="det-k">FFP dose</span><span className="det-v">{Math.round(w * 12)} mL (10-15 mL/kg)</span></div>
                <div className="det-row"><span className="det-k">TXA dose</span><span className="det-v">{Math.min(Math.round(w * 15), 1000)} mg (15 mg/kg, max 1g)</span></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
