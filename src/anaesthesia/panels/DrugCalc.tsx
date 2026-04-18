import { useCallback, useState } from "react";
import { T } from "../theme";
import { DRUGS, type Drug } from "../data";

type Result = { lo: number; hi: number; over: boolean; max: number; unit: string; maint: { lo: number; hi: number; unit: string | null } | null };

export function DrugCalc() {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [sel, setSel] = useState<Drug | null>(null);
  const [weight, setWeight] = useState("70");
  const [mode, setMode] = useState<"adult" | "pedi">("adult");
  const [result, setResult] = useState<Result | null>(null);

  const cats = ["All", ...Array.from(new Set(DRUGS.map((d) => d.cat)))];
  const filtered = DRUGS.filter((d) => {
    const mc = cat === "All" || d.cat === cat;
    const q = search.toLowerCase();
    const ms = !q || d.name.toLowerCase().includes(q) || d.class.toLowerCase().includes(q);
    return mc && ms;
  });

  const calc = useCallback((drug: Drug) => {
    const w = parseFloat(weight);
    if (!w || w <= 0) return;
    const pf = mode === "pedi" ? drug.pf : 1.0;
    const lo = +(drug.ind[0] * pf * w).toFixed(2);
    const hi = +(drug.ind[1] * pf * w).toFixed(2);
    const cappedHi = Math.min(hi, drug.max);
    let maint: Result["maint"] = null;
    if (drug.maint) maint = { lo: +(drug.maint[0] * pf * w).toFixed(2), hi: +(drug.maint[1] * pf * w).toFixed(2), unit: drug.munit };
    setResult({ lo, hi: cappedHi, over: hi > drug.max, max: drug.max, unit: drug.unit, maint });
  }, [weight, mode]);

  if (sel) return (
    <div>
      <button className="btn btn-o btn-sm" style={{ marginBottom: 14 }} onClick={() => { setSel(null); setResult(null); }}>{"← Drug List"}</button>
      <div style={{ background: T.card, border: `1px solid ${T.accent}44`, borderRadius: 13, padding: 17 }}>
        <div style={{ fontSize: 19, fontWeight: 900, color: T.accent, marginBottom: 3 }}>{sel.name}</div>
        <div style={{ fontSize: 10, color: T.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>{sel.class}</div>
        <div className="row2">
          <div className="ig">
            <div className="lbl">Weight (kg)</div>
            <input className="inp" type="number" value={weight} onChange={(e) => { setWeight(e.target.value); setResult(null); }} />
          </div>
          <div className="ig">
            <div className="lbl">Patient</div>
            <div className="tabs" style={{ marginBottom: 0 }}>
              <button className={`tab ${mode === "adult" ? "on" : ""}`} onClick={() => { setMode("adult"); setResult(null); }}>Adult</button>
              <button className={`tab ${mode === "pedi" ? "on" : ""}`} onClick={() => { setMode("pedi"); setResult(null); }}>Pedi</button>
            </div>
          </div>
        </div>
        <button className="btn btn-a btn-full" style={{ marginBottom: 14 }} onClick={() => calc(sel)}>Calculate Dose</button>
        {result && (
          <div className="res-box">
            <div className="res-row"><span className="res-lbl">Induction</span><span className={`res-val ${result.over ? "a" : ""}`}>{result.lo}-{result.hi} {result.unit}</span></div>
            {result.maint && <div className="res-row"><span className="res-lbl">Maintenance</span><span className="res-val g">{result.maint.lo}-{result.maint.hi} {result.maint.unit}</span></div>}
            <div className="res-row"><span className="res-lbl">Max / ceiling</span><span className="res-val a">{result.max} {result.unit}</span></div>
            {result.over && <div className="warn-box">⚠️ Exceeds ceiling. Use max {result.max} {result.unit}.</div>}
          </div>
        )}
        <div className="div" />
        <div className="det-row"><span className="det-k">Onset</span><span className="det-v" style={{ color: T.green }}>{sel.onset}</span></div>
        <div className="det-row"><span className="det-k">Duration</span><span className="det-v">{sel.duration}</span></div>
        <div className="det-row"><span className="det-k">Elimination</span><span className="det-v">{sel.elimination}</span></div>
        <div className="det-row"><span className="det-k">Protein binding</span><span className="det-v">{sel.protein}%</span></div>
        <div className="det-row"><span className="det-k">MOA</span><span className="det-v">{sel.moa}</span></div>
        {sel.ci && <div className="det-row"><span className="det-k">Contra-indications</span><span className="det-v" style={{ color: T.red }}>{sel.ci}</span></div>}
        {sel.caution && <div className="det-row"><span className="det-k">Cautions</span><span className="det-v" style={{ color: T.amber }}>{sel.caution}</span></div>}
        {sel.side && <div className="det-row"><span className="det-k">Side effects</span><span className="det-v">{sel.side}</span></div>}
        <div className="info-box">📋 {sel.note}</div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="pg-title">Drug Reference</div>
      <div className="pg-sub">{DRUGS.length} agents · tap for full detail + dosing</div>
      <div className="srch">
        <span className="srch-ico">🔍</span>
        <input className="srch-inp" placeholder="Search drug or class..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="row2">
        <div className="ig">
          <div className="lbl">Weight (kg)</div>
          <input className="inp" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70" />
        </div>
        <div className="ig">
          <div className="lbl">Patient</div>
          <div className="tabs" style={{ marginBottom: 0 }}>
            <button className={`tab ${mode === "adult" ? "on" : ""}`} onClick={() => setMode("adult")}>Adult</button>
            <button className={`tab ${mode === "pedi" ? "on" : ""}`} onClick={() => setMode("pedi")}>Pedi</button>
          </div>
        </div>
      </div>
      <div className="chips">{cats.map((c) => <button key={c} className={`chip ${cat === c ? "on" : ""}`} onClick={() => setCat(c)}>{c}</button>)}</div>
      <div className="card">
        <div className="card-hd">📋 {filtered.length} drugs</div>
        {filtered.map((d) => (
          <div key={d.name} className="drug-row" onClick={() => { setSel(d); setResult(null); }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div><div className="drug-name">{d.name}</div><div className="drug-class">{d.class}</div></div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "IBM Plex Mono", fontSize: 10, color: T.accent }}>{d.ind[0]}-{d.ind[1]} {d.unit}</div>
                <div style={{ fontSize: 9, color: T.muted }}>{d.onset}</div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ padding: 20, textAlign: "center", color: T.muted, fontSize: 13 }}>No drugs found.</div>}
      </div>
    </div>
  );
}
