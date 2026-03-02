import { useMemo } from "react";
import { CC } from "../data/compatLevels";
import { score } from "../data/scoring";

export default function PublicTable({ machines, tblFilter, setTblFilter, tblCompat, setTblCompat, onSelect }) {
  const filteredTable = useMemo(() => {
    let list = machines;
    if (tblFilter.trim().length >= 2) list = list.filter(m => score(tblFilter, m) > 20);
    if (tblCompat !== "all") list = list.filter(m => m.compatLevel === tblCompat);
    return list;
  }, [tblFilter, tblCompat, machines]);

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input type="text" value={tblFilter} onChange={e => setTblFilter(e.target.value)} placeholder="Filter by brand, model, or controller..." style={{ flex: 1, minWidth: 180, border: "1px solid #d1d5db", borderRadius: 8, padding: "8px 12px", fontSize: 13, outline: "none" }} />
        <select value={tblCompat} onChange={e => setTblCompat(e.target.value)} style={{ border: "1px solid #d1d5db", borderRadius: 8, padding: "8px 12px", fontSize: 13, outline: "none", background: "#fff", cursor: "pointer" }}>
          <option value="all">All ({machines.length})</option>
          <option value="full">{"\u2713"} Full ({machines.filter(m => m.compatLevel === "full").length})</option>
          <option value="cam">{"\u25D0"} CAM ({machines.filter(m => m.compatLevel === "cam").length})</option>
          <option value="maybe">? Limited ({machines.filter(m => m.compatLevel === "maybe").length})</option>
          <option value="depends">{"\u2699"} Varies ({machines.filter(m => m.compatLevel === "depends").length})</option>
          <option value="unlikely">{"\u2717"} N/C ({machines.filter(m => m.compatLevel === "unlikely").length})</option>
        </select>
      </div>
      <div style={{ overflowX: "auto", border: "1px solid #e5e7eb", borderRadius: 10 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ background: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
            <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Brand</th>
            <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Model</th>
            <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Controller</th>
            <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#374151" }}>Status</th>
          </tr></thead>
          <tbody>
            {filteredTable.length === 0 && <tr><td colSpan={4} style={{ padding: 20, textAlign: "center", color: "#9ca3af" }}>No machines match.</td></tr>}
            {filteredTable.map(m => { const cc = CC[m.compatLevel]; return (
              <tr key={m.id} style={{ borderBottom: "1px solid #f3f4f6", cursor: "pointer" }} onClick={() => onSelect(m)} onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "8px 12px", color: "#374151" }}>{m.brand}</td>
                <td style={{ padding: "8px 12px", color: "#111827", fontWeight: 500 }}>{m.model}</td>
                <td style={{ padding: "8px 12px", color: "#6b7280", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.controller}</td>
                <td style={{ padding: "8px 12px" }}><span style={{ fontSize: 11, fontWeight: 600, color: cc.color, background: cc.bg, border: `1px solid ${cc.bdr}`, borderRadius: 20, padding: "2px 10px", whiteSpace: "nowrap" }}>{cc.tag}</span></td>
              </tr>
            ); })}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 12 }}>Showing {filteredTable.length} of {machines.length} machines. Click any row for details.</p>
    </div>
  );
}
