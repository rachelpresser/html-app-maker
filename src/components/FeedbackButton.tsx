import { useState } from "react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

const FEATURES = [
  "Drug Calculator",
  "Airway Management",
  "Crisis Checklists",
  "Regional Atlas",
  "Risk Scoring",
  "Fluid Calculator",
  "Procedure Checklists",
  "General / Other",
];

const T = {
  bg: "#070b14",
  card: "#0e1420",
  border: "#1e3a5f",
  text: "#e2e8f0",
  muted: "#64748b",
  accent: "#3b82f6",
};

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feature, setFeature] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ rating, feature, message }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setRating(0);
    setHover(0);
    setFeature("");
    setMessage("");
    setStatus("idle");
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: 90,
          right: 16,
          zIndex: 1000,
          background: T.accent,
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 48,
          height: 48,
          fontSize: 22,
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(59,130,246,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Send feedback"
      >
        💬
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) reset(); }}
        >
          <div
            style={{
              background: T.card,
              border: `1px solid ${T.border}`,
              borderRadius: "16px 16px 0 0",
              padding: "24px 20px 36px",
              width: "100%",
              maxWidth: 520,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div style={{ color: T.text, fontWeight: 800, fontSize: 16 }}>Send Feedback</div>
              <button onClick={reset} style={{ background: "none", border: "none", color: T.muted, fontSize: 20, cursor: "pointer" }}>×</button>
            </div>

            {status === "sent" ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                <div style={{ color: T.text, fontWeight: 700, fontSize: 15 }}>Thanks for your feedback!</div>
                <div style={{ color: T.muted, fontSize: 13, marginTop: 6 }}>It helps improve AnaesthesiaPro.</div>
                <button onClick={reset} style={{ marginTop: 20, background: T.accent, color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 700, cursor: "pointer" }}>Close</button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ color: T.muted, fontSize: 12, marginBottom: 8 }}>Overall rating</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onMouseEnter={() => setHover(s)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => setRating(s)}
                        style={{
                          background: "none",
                          border: "none",
                          fontSize: 28,
                          cursor: "pointer",
                          opacity: s <= (hover || rating) ? 1 : 0.25,
                          filter: s <= (hover || rating) ? "none" : "grayscale(1)",
                          transition: "opacity 0.1s",
                        }}
                      >⭐</button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ color: T.muted, fontSize: 12, marginBottom: 8 }}>Feature (optional)</div>
                  <select
                    value={feature}
                    onChange={(e) => setFeature(e.target.value)}
                    style={{
                      width: "100%",
                      background: T.bg,
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      color: T.text,
                      padding: "9px 12px",
                      fontSize: 13,
                    }}
                  >
                    <option value="">Select a feature…</option>
                    {FEATURES.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <div style={{ color: T.muted, fontSize: 12, marginBottom: 8 }}>Comments (optional)</div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What would you like to see improved?"
                    rows={4}
                    style={{
                      width: "100%",
                      background: T.bg,
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      color: T.text,
                      padding: "9px 12px",
                      fontSize: 13,
                      resize: "none",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                {status === "error" && (
                  <div style={{ color: "#f87171", fontSize: 12, marginBottom: 12 }}>
                    Something went wrong — please try again.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "sending" || rating === 0}
                  style={{
                    width: "100%",
                    padding: "12px 0",
                    borderRadius: 9,
                    border: "none",
                    background: rating === 0 ? T.border : T.accent,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: rating === 0 ? "not-allowed" : "pointer",
                    opacity: status === "sending" ? 0.7 : 1,
                  }}
                >
                  {status === "sending" ? "Sending…" : "Submit Feedback"}
                </button>
                <div style={{ color: T.muted, fontSize: 10, textAlign: "center", marginTop: 8 }}>A star rating is required</div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
