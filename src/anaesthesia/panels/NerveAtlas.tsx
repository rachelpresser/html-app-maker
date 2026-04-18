import { useState } from "react";
import { T } from "../theme";
import { NERVES } from "../data";

export function NerveAtlas() {
  const [sel, setSel] = useState<string | null>(null);
  const nerve = sel ? NERVES.find((n) => n.id === sel) : null;
  return (
    <div>
      <div className="pg-title">Regional Atlas</div>
      <div className="pg-sub">{NERVES.length} blocks · Landmarks · US views · Dosing</div>
      <div className="nerve-grid">
        {NERVES.map((n) => (
          <div key={n.id} className={`nc ${sel === n.id ? "on" : ""}`} onClick={() => setSel(sel === n.id ? null : n.id)}>
            <div className="nc-icon">{n.icon}</div>
            <div className="nc-name">{n.name}</div>
            <div className="nc-region">{n.region}</div>
          </div>
        ))}
      </div>
      {nerve ? (
        <div style={{ background: T.card, border: `1px solid ${T.accent}44`, borderRadius: 13, padding: 17 }}>
          <div style={{ fontSize: 19, fontWeight: 900, color: T.accent, marginBottom: 3 }}>{nerve.icon} {nerve.name}</div>
          <div style={{ fontSize: 10, color: T.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 13 }}>{nerve.region}</div>
          <div className="det-row"><span className="det-k">Indication</span><span className="det-v">{nerve.indication}</span></div>
          <div className="det-row"><span className="det-k">Agent + Vol</span><span className="det-v" style={{ color: T.green }}>{nerve.agent} · {nerve.vol}</span></div>
          <div className="det-row"><span className="det-k">Depth</span><span className="det-v">{nerve.depth}</span></div>
          <div className="det-row"><span className="det-k">Mechanism</span><span className="det-v">{nerve.mechanism}</span></div>
          <div className="det-row"><span className="det-k">Landmark</span><span className="det-v" style={{ fontSize: 11 }}>{nerve.landmark}</span></div>
          <div className="det-row"><span className="det-k">US view</span><span className="det-v" style={{ fontSize: 11 }}>{nerve.us}</span></div>
          <div className="det-row"><span className="det-k">Risks</span><span className="det-v" style={{ color: T.amber, fontSize: 11 }}>{nerve.risk}</span></div>
          {nerve.extra && <div className="info-box">{nerve.extra}</div>}
        </div>
      ) : <div className="info-box">Select a block for landmarks, US views, dosing, mechanism, and risks.</div>}
    </div>
  );
}
