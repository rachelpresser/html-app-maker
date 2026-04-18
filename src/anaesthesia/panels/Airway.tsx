import { useState } from "react";
import { T } from "../theme";
import { AIRWAY_TREE } from "../data";

export function Airway() {
  const [node, setNode] = useState("start");
  const [hist, setHist] = useState<string[]>([]);
  const curr = AIRWAY_TREE[node];
  const go = (n: string) => { setHist((h) => [...h, node]); setNode(n); };
  const back = () => { const h = [...hist]; const p = h.pop(); setHist(h); setNode(p || "start"); };
  const restart = () => { setNode("start"); setHist([]); };
  const bg = curr.type === "danger" ? `${T.red}12` : curr.type === "action" ? `${T.green}12` : `${T.accent}08`;
  const bc = curr.type === "danger" ? `${T.red}55` : curr.type === "action" ? `${T.green}55` : `${T.accent}44`;
  const tc = curr.type === "danger" ? T.red : curr.type === "action" ? T.green : T.accent;
  const tl = curr.type === "danger" ? "⚠️ Emergency" : curr.type === "action" ? "✓ Action" : "❓ Decision";

  return (
    <div>
      <div className="pg-title">Airway Algorithm</div>
      <div className="pg-sub">DAS / ASA Difficult Airway Decision Tool</div>
      {hist.length > 0 && (
        <div className="bgrp" style={{ marginBottom: 13 }}>
          <button className="btn btn-o btn-sm" onClick={back}>{"← Back"}</button>
          <button className="btn btn-g btn-sm" onClick={restart}>Restart</button>
        </div>
      )}
      <div style={{ background: bg, border: `1px solid ${bc}`, borderRadius: 13, padding: 17, marginBottom: 10 }}>
        <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", color: tc, marginBottom: 8 }}>{tl}</div>
        <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.5, marginBottom: curr.items ? 12 : 0 }}>{curr.q}</div>
        {curr.items && (
          <div style={{ marginBottom: 12 }}>
            {curr.items.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 8, padding: "5px 0", borderBottom: i < curr.items!.length - 1 ? `1px solid ${T.border}44` : "none" }}>
                <span style={{ fontFamily: "IBM Plex Mono", fontSize: 9, color: tc, minWidth: 14, marginTop: 2 }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontSize: 12, lineHeight: 1.5, color: item.startsWith("  ") ? T.muted : T.text }}>{item}</span>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          {curr.yes && <button onClick={() => go(curr.yes!)} style={{ flex: 1, padding: 9, borderRadius: 8, border: `1px solid ${T.green}`, color: T.green, background: `${T.green}11`, fontFamily: "Outfit", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>Yes</button>}
          {curr.no && <button onClick={() => go(curr.no!)} style={{ flex: 1, padding: 9, borderRadius: 8, border: `1px solid ${T.red}`, color: T.red, background: `${T.red}11`, fontFamily: "Outfit", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>No</button>}
          {curr.next && <button onClick={() => go(curr.next!)} style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${T.accent}`, color: T.accent, background: `${T.accent}11`, fontFamily: "Outfit", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>{"Continue →"}</button>}
          {!curr.yes && !curr.next && <button onClick={restart} style={{ width: "100%", padding: 9, borderRadius: 8, border: `1px solid ${T.amber}`, color: T.amber, background: `${T.amber}11`, fontFamily: "Outfit", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>Start Over</button>}
        </div>
      </div>
      <div className="card">
        <div className="card-hd">📋 DAS Key Principles</div>
        {["Limit to 3 intubation attempts (+1 expert)", "Declare 'Cannot Intubate' early - do NOT persist", "Oxygenate between every attempt - no desaturation", "Video laryngoscopy for all predicted difficult airways", "CICO: declare aloud, eFONA without delay (Scalpel-Finger-Bougie)", "Awake extubation after any difficult intubation"].map((t, i) => (
          <div key={i} className="cl-item" style={{ cursor: "default" }}>
            <span className="cl-num">{String(i + 1).padStart(2, "0")}</span>
            <span className="cl-txt">{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
