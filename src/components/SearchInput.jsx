import { useState, useMemo, useRef } from "react";
import { CC } from "../data/compatLevels";
import { score } from "../data/scoring";

export default function SearchInput({ machines, onSelect }) {
  const [query, setQuery] = useState("");
  const [fwHelp, setFwHelp] = useState(false);
  const ref = useRef(null);

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    return machines.map(m => ({ ...m, sc: score(query, m) })).filter(m => m.sc > 25).sort((a, b) => b.sc - a.sc).slice(0, 10);
  }, [query, machines]);

  return (
    <>
      <div style={{ position: "relative", marginBottom: results.length > 0 ? 0 : 16 }}>
        <div style={{ display: "flex", alignItems: "center", border: "2px solid " + (query.length > 0 ? "#6366f1" : "#d1d5db"), borderRadius: results.length > 0 ? "10px 10px 0 0" : "10px", padding: "0 14px", background: "#fff", transition: "border-color .15s" }}>
          <span style={{ fontSize: 18, color: "#9ca3af", marginRight: 10 }}>&#128269;</span>
          <input ref={ref} type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder='e.g. "Shapeoko 5", "X-Carve", "GRBL"' style={{ flex: 1, border: "none", outline: "none", padding: "14px 0", fontSize: 15, color: "#111827", background: "transparent" }} />
          {query && <button onClick={() => { setQuery(""); ref.current?.focus(); }} style={{ background: "none", border: "none", fontSize: 18, color: "#9ca3af", cursor: "pointer", padding: "4px" }}>&times;</button>}
        </div>
      </div>
      {results.length > 0 && (
        <div style={{ border: "2px solid #6366f1", borderTop: "1px solid #e5e7eb", borderRadius: "0 0 10px 10px", background: "#fff", overflow: "hidden", marginBottom: 16, maxHeight: 420, overflowY: "auto" }}>
          {results.map((m, i) => { const cc = CC[m.compatLevel]; return (
            <button key={m.id} onClick={() => { onSelect(m); setQuery(""); }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "12px 16px", background: "transparent", border: "none", borderBottom: i < results.length - 1 ? "1px solid #f3f4f6" : "none", cursor: "pointer", textAlign: "left" }} onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div><div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{m.brand} {m.model}</div><div style={{ fontSize: 12, color: "#6b7280", marginTop: 1 }}>{m.controller}</div></div>
              <span style={{ fontSize: 11, fontWeight: 600, color: cc.color, background: cc.bg, border: `1px solid ${cc.bdr}`, borderRadius: 20, padding: "3px 10px", whiteSpace: "nowrap", flexShrink: 0 }}>{cc.tag}</span>
            </button>
          ); })}
        </div>
      )}
      {query.trim().length >= 2 && results.length === 0 && (
        <div style={{ border: "2px solid #6366f1", borderTop: "1px solid #e5e7eb", borderRadius: "0 0 10px 10px", background: "#fff", padding: "20px 16px", textAlign: "center", marginBottom: 16 }}>
          <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 6px" }}>No match for <strong>"{query}"</strong></p>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>Try brand, model, or firmware name. You can also browse the full database below.</p>
        </div>
      )}
      <button onClick={() => setFwHelp(!fwHelp)} style={{ background: "none", border: "none", color: "#6366f1", fontSize: 14, fontWeight: 500, cursor: "pointer", padding: 0, textDecoration: "underline", textUnderlineOffset: 2, marginBottom: 12, display: "block" }}>{fwHelp ? "Hide firmware info \u2191" : "Don't know your firmware? \u2193"}</button>
      {fwHelp && (
        <div style={{ marginBottom: 16, background: "#f9fafb", borderRadius: 10, padding: "16px 20px", border: "1px solid #e5e7eb" }}>
          <p style={{ fontSize: 13, color: "#374151", margin: "0 0 12px", lineHeight: 1.5 }}>MillMage compatibility depends on your CNC's <strong>firmware / controller</strong>:</p>
          <div style={{ marginBottom: 10 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#059669", marginBottom: 3 }}>{"\u2713"} Full Support</div><div style={{ fontSize: 13, color: "#374151" }}>GRBL {"\u2264"}1.1 {"\u00B7"} grblHAL {"\u00B7"} GRBL-STM {"\u00B7"} FluidNC {"\u00B7"} Smoothieware (Labs)</div></div>
          <div><div style={{ fontSize: 13, fontWeight: 700, color: "#d97706", marginBottom: 3 }}>{"\u25D0"} CAD + CAM</div><div style={{ fontSize: 13, color: "#374151" }}>Mach3/4 {"\u00B7"} LinuxCNC {"\u00B7"} UCCNC {"\u00B7"} Duet/RRF {"\u00B7"} Masso</div></div>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ background: "#ecfdf5", borderRadius: 8, padding: "14px 16px", border: "1px solid #a7f3d0" }}><div style={{ fontSize: 12, fontWeight: 700, color: "#059669", marginBottom: 6 }}>{"\u2713"} FULL CONTROL</div><div style={{ fontSize: 12, color: "#374151", lineHeight: 1.6 }}>GRBL {"\u00B7"} grblHAL {"\u00B7"} FluidNC {"\u00B7"} Smoothieware</div></div>
        <div style={{ background: "#fffbeb", borderRadius: 8, padding: "14px 16px", border: "1px solid #fde68a" }}><div style={{ fontSize: 12, fontWeight: 700, color: "#d97706", marginBottom: 6 }}>{"\u25D0"} CAM ONLY</div><div style={{ fontSize: 12, color: "#374151", lineHeight: 1.6 }}>Mach3/4 {"\u00B7"} LinuxCNC {"\u00B7"} UCCNC {"\u00B7"} Duet {"\u00B7"} Masso</div></div>
      </div>
    </>
  );
}
