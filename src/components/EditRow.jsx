import { useState } from "react";
import { CC, COMPAT_OPTS } from "../data/compatLevels";

const cellSt = { border: "1px solid #d1d5db", borderRadius: 4, padding: "4px 6px", fontSize: 12, width: "100%", boxSizing: "border-box" };

export default function EditRow({ machine, onSave, onCancel }) {
  const [d, setD] = useState({
    brand: machine.brand,
    model: machine.model,
    firmware: machine.firmware,
    controller: machine.controller,
    compatLevel: machine.compatLevel,
    notes: machine.notes,
  });
  const up = (f, v) => setD(p => ({ ...p, [f]: v }));
  return (
    <tr style={{ borderBottom: "1px solid #f3f4f6", background: "#fefce8", verticalAlign: "top" }}>
      <td style={{ padding: "6px 4px" }}><input type="text" value={d.brand} onChange={e => up("brand", e.target.value)} style={cellSt} /></td>
      <td style={{ padding: "6px 4px" }}><input type="text" value={d.model} onChange={e => up("model", e.target.value)} style={cellSt} /></td>
      <td style={{ padding: "6px 4px" }}><input type="text" value={d.firmware} onChange={e => up("firmware", e.target.value)} style={cellSt} /></td>
      <td style={{ padding: "6px 4px" }}><input type="text" value={d.controller} onChange={e => up("controller", e.target.value)} style={cellSt} /></td>
      <td style={{ padding: "6px 4px" }}>
        <select value={d.compatLevel} onChange={e => up("compatLevel", e.target.value)} style={{ ...cellSt, padding: "4px 2px" }}>
          {COMPAT_OPTS.map(o => <option key={o} value={o}>{CC[o].tag}</option>)}
        </select>
      </td>
      <td style={{ padding: "6px 4px" }}><textarea value={d.notes} onChange={e => up("notes", e.target.value)} rows={2} style={{ ...cellSt, resize: "vertical", minHeight: 40 }} /></td>
      <td style={{ padding: "6px 4px", textAlign: "center" }}>
        <div style={{ display: "flex", gap: 4, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => onSave(d)} style={{ border: "none", borderRadius: 5, padding: "5px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", background: "#059669", color: "#fff", whiteSpace: "nowrap" }}>Save</button>
          <button onClick={onCancel} style={{ border: "none", borderRadius: 5, padding: "5px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", background: "#f3f4f6", color: "#374151", whiteSpace: "nowrap" }}>Cancel</button>
        </div>
      </td>
    </tr>
  );
}
