import { CC } from "../data/compatLevels";

export default function DetailCard({ machine, onBack }) {
  const c = CC[machine.compatLevel];
  return (
    <div style={{ animation: "fadeIn .25s ease" }}>
      <div style={{ background: c.bg, border: `2px solid ${c.bdr}`, borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", background: c.color, color: "#fff", fontSize: 20, fontWeight: 700 }}>{c.icon}</span>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>{machine.brand} {machine.model}</div>
            <span style={{ display: "inline-block", fontSize: 12, fontWeight: 600, color: c.color, background: "#fff", border: `1px solid ${c.bdr}`, borderRadius: 20, padding: "2px 10px", marginTop: 2 }}>{c.tag}</span>
          </div>
        </div>
        <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: "0 0 12px" }}>{c.sum}</p>
        <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 8, padding: "12px 14px", fontSize: 13, color: "#4b5563", lineHeight: 1.55 }}>
          <strong style={{ color: "#111827" }}>Controller:</strong> {machine.controller}<br /><span style={{ color: "#6b7280" }}>{machine.notes}</span>
        </div>
      </div>
      {machine.compatLevel === "full" && <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#166534", marginBottom: 16, lineHeight: 1.5 }}><strong>Ready to go!</strong> Download the <a href="https://lightburnsoftware.com/products/millmage-core" target="_blank" rel="noopener" style={{ color: "#059669" }}>30-day free trial</a> to verify with your setup.</div>}
      {machine.compatLevel === "cam" && <div style={{ background: "#fffbeb", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#92400e", marginBottom: 16, lineHeight: 1.5 }}><strong>You can still use MillMage!</strong> Design and export GCode, then transfer to your machine.</div>}
      {(machine.compatLevel === "maybe" || machine.compatLevel === "depends") && <div style={{ background: "#f5f3ff", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#5b21b6", marginBottom: 16, lineHeight: 1.5 }}><strong>Not sure?</strong> Try the <a href="https://lightburnsoftware.com/products/millmage-core" target="_blank" rel="noopener" style={{ color: "#7c3aed" }}>30-day free trial</a>.</div>}
      {machine.compatLevel === "unlikely" && <div style={{ background: "#fef2f2", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#991b1b", marginBottom: 16, lineHeight: 1.5 }}>This machine's proprietary system isn't supported. If you've upgraded the controller, search again by the new controller type.</div>}
      <button onClick={onBack} style={{ display: "block", width: "100%", padding: "12px", background: "#fff", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, fontWeight: 500, color: "#374151", cursor: "pointer" }}>{"\u2190"} Check another machine</button>
    </div>
  );
}
