import { useState } from "react";
import { T } from "../theme";
import { PROCEDURES } from "../procedures";

export function Procedures() {
  const [sel, setSel] = useState<string | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [phase, setPhase] = useState(0);
  const [cat, setCat] = useState("All");
  const proc = sel ? PROCEDURES.find((p) => p.id === sel) : null;
  const toggle = (ph: number, i: number) => setChecked((c) => ({ ...c, [`${sel}-${ph}-${i}`]: !c[`${sel}-${ph}-${i}`] }));
  const cats = ["All", ...Array.from(new Set(PROCEDURES.map((p) => p.category)))];
  const filtered = PROCEDURES.filter((p) => cat === "All" || p.category === cat);

  if (proc) {
    const curr = proc.steps[phase];
    const done = curr.items.filter((_, i) => checked[`${sel}-${phase}-${i}`]).length;
    const pct = Math.round((done / curr.items.length) * 100);
    const allDone = proc.steps.every((ph, pi) => ph.items.every((_, ii) => checked[`${sel}-${pi}-${ii}`]));
    return (
      <div>
        <button className="btn btn-o btn-sm" style={{ marginBottom: 13 }} onClick={() => { setSel(null); setChecked({}); setPhase(0); }}>{"← Procedures"}</button>
        <div style={{ color: proc.color, fontSize: 19, fontWeight: 900, marginBottom: 3 }}>{proc.icon} {proc.name}</div>
        <div style={{ fontSize: 10, color: T.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 13 }}>Step-by-step checklist</div>
        <div style={{ display: "flex", gap: 4, marginBottom: 13, overflowX: "auto", scrollbarWidth: "none" }}>
          {proc.steps.map((ph, pi) => {
            const d = ph.items.filter((_, ii) => checked[`${sel}-${pi}-${ii}`]).length;
            const phDone = d === ph.items.length;
            return (
              <button key={pi} onClick={() => setPhase(pi)} style={{ flexShrink: 0, padding: "6px 11px", borderRadius: 7, border: `1px solid ${phase === pi ? proc.color : T.border}`, background: phase === pi ? `${proc.color}22` : phDone ? `${T.green}10` : "transparent", color: phase === pi ? proc.color : phDone ? T.green : T.muted, fontFamily: "Outfit", fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap" }}>
                {phDone ? "✓ " : ""}{ph.phase}
              </button>
            );
          })}
        </div>
        <div className="prog-meta"><span style={{ color: T.muted }}>{curr.phase}: {done}/{curr.items.length}</span><span style={{ color: proc.color }}>{pct}%</span></div>
        <div className="prog-bar"><div className="prog-fill" style={{ width: `${pct}%`, background: proc.color }} /></div>
        <div className="card" style={{ marginTop: 10 }}>
          <div className="card-hd" style={{ color: proc.color }}>{curr.phase}</div>
          {curr.items.map((item, i) => (
            <div key={i} className="cl-item" onClick={() => toggle(phase, i)}>
              <div className={`cl-box ${checked[`${sel}-${phase}-${i}`] ? "on" : ""}`} style={checked[`${sel}-${phase}-${i}`] ? { background: proc.color, borderColor: proc.color } : { borderColor: `${proc.color}66` }}>
                {checked[`${sel}-${phase}-${i}`] && <span style={{ fontSize: 9, color: T.bg, fontWeight: 700 }}>✓</span>}
              </div>
              <div className={`cl-txt ${checked[`${sel}-${phase}-${i}`] ? "done" : ""}`} style={{ fontSize: 12 }}>{item}</div>
            </div>
          ))}
        </div>
        <div className="bgrp">
          {phase > 0 && <button className="btn btn-g btn-sm" onClick={() => setPhase((p) => p - 1)}>{"← Prev"}</button>}
          {phase < proc.steps.length - 1 && <button className="btn btn-o btn-sm" onClick={() => setPhase((p) => p + 1)}>{"Next →"}</button>}
        </div>
        {allDone && <div className="green-box" style={{ marginTop: 13 }}>✅ All steps complete.</div>}
      </div>
    );
  }

  return (
    <div>
      <div className="pg-title">Procedure Checklists</div>
      <div className="pg-sub">{PROCEDURES.length} protocols · Step-by-step phases</div>
      <div className="chips">{cats.map((c) => <button key={c} className={`chip ${cat === c ? "on" : ""}`} onClick={() => setCat(c)}>{c}</button>)}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginBottom: 13 }}>
        {filtered.map((p) => {
          const total = p.steps.reduce((a, ph) => a + ph.items.length, 0);
          return (
            <div key={p.id} className="proc-card" onClick={() => { setSel(p.id); setPhase(0); }}>
              <div className="pc-icon">{p.icon}</div>
              <div className="pc-name" style={{ color: p.color }}>{p.name}</div>
              <div className="pc-steps">{p.steps.length} phases · {total} steps</div>
              <div style={{ marginTop: 7 }}><span className="badge" style={{ background: `${p.color}22`, color: p.color, border: `1px solid ${p.color}44`, fontSize: 9 }}>{p.category}</span></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
