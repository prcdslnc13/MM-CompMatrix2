import { useState, useMemo } from "react";
import { CC } from "../data/compatLevels";
import { score } from "../data/scoring";
import EditRow from "./EditRow";

const Btn = ({ children, bg = "#f3f4f6", color = "#374151", onClick }) => (
  <button onClick={onClick} style={{ border: "none", borderRadius: 5, padding: "5px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", background: bg, color, whiteSpace: "nowrap" }}>{children}</button>
);

export default function AdminTable({ machines, tblFilter, setTblFilter, tblCompat, setTblCompat, saveStatus, onAddRow, onSaveEdit, onDeleteRow, onResetDB, onExportCSV, onImportCSV }) {
  const [editId, setEditId] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const filteredTable = useMemo(() => {
    let list = machines;
    if (tblFilter.trim().length >= 2) list = list.filter(m => score(tblFilter, m) > 20);
    if (tblCompat !== "all") list = list.filter(m => m.compatLevel === tblCompat);
    return list;
  }, [tblFilter, tblCompat, machines]);

  const startEdit = (m) => setEditId(m.id);
  const cancelEdit = () => {
    const m = machines.find(x => x.id === editId);
    if (m && !m.brand && !m.model && !m.controller) onDeleteRow(m.id);
    setEditId(null);
  };
  const handleSave = (data) => {
    onSaveEdit(editId, data);
    setEditId(null);
  };
  const addRow = () => {
    const nw = onAddRow();
    setEditId(nw.id);
  };
  const deleteRow = (id) => {
    onDeleteRow(id);
    if (editId === id) setEditId(null);
    setConfirmDel(null);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
        <input type="text" value={tblFilter} onChange={e => setTblFilter(e.target.value)} placeholder="Filter..." style={{ flex: 1, minWidth: 140, border: "1px solid #d1d5db", borderRadius: 8, padding: "8px 12px", fontSize: 13, outline: "none" }} />
        <select value={tblCompat} onChange={e => setTblCompat(e.target.value)} style={{ border: "1px solid #d1d5db", borderRadius: 8, padding: "8px 10px", fontSize: 13, outline: "none", background: "#fff" }}>
          <option value="all">All ({machines.length})</option>
          <option value="full">{"\u2713"} Full ({machines.filter(m => m.compatLevel === "full").length})</option>
          <option value="cam">{"\u25D0"} CAM ({machines.filter(m => m.compatLevel === "cam").length})</option>
          <option value="maybe">? Limited ({machines.filter(m => m.compatLevel === "maybe").length})</option>
          <option value="depends">{"\u2699"} Varies ({machines.filter(m => m.compatLevel === "depends").length})</option>
          <option value="unlikely">{"\u2717"} N/C ({machines.filter(m => m.compatLevel === "unlikely").length})</option>
        </select>
        <Btn bg="#6366f1" color="#fff" onClick={addRow}>+ Add</Btn>
        <Btn onClick={onImportCSV}>{"\u2B06"} Import CSV</Btn>
        <Btn onClick={onExportCSV}>{"\u2B07"} Export CSV</Btn>
        <Btn bg="#fef2f2" color="#dc2626" onClick={() => { if (confirm("Reset database to defaults? All edits will be lost.")) onResetDB(); }}>Reset</Btn>
        {saveStatus === "saving" && <span style={{ fontSize: 11, color: "#6b7280" }}>Saving...</span>}
        {saveStatus === "saved" && <span style={{ fontSize: 11, color: "#059669" }}>{"\u2713"} Saved</span>}
        {saveStatus === "error" && <span style={{ fontSize: 11, color: "#dc2626" }}>Save failed</span>}
      </div>
      <div style={{ overflowX: "auto", border: "1px solid #e5e7eb", borderRadius: 10 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead><tr style={{ background: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
            <th style={{ padding: "8px 6px", textAlign: "left", fontWeight: 600, color: "#374151", minWidth: 90 }}>Brand</th>
            <th style={{ padding: "8px 6px", textAlign: "left", fontWeight: 600, color: "#374151", minWidth: 110 }}>Model</th>
            <th style={{ padding: "8px 6px", textAlign: "left", fontWeight: 600, color: "#374151", minWidth: 65 }}>Firmware</th>
            <th style={{ padding: "8px 6px", textAlign: "left", fontWeight: 600, color: "#374151", minWidth: 130 }}>Controller</th>
            <th style={{ padding: "8px 6px", textAlign: "left", fontWeight: 600, color: "#374151", minWidth: 85 }}>Status</th>
            <th style={{ padding: "8px 6px", textAlign: "left", fontWeight: 600, color: "#374151", minWidth: 140 }}>Notes</th>
            <th style={{ padding: "8px 6px", textAlign: "center", fontWeight: 600, color: "#374151", width: 95 }}>Actions</th>
          </tr></thead>
          <tbody>
            {filteredTable.length === 0 && <tr><td colSpan={7} style={{ padding: 20, textAlign: "center", color: "#9ca3af" }}>No machines match.</td></tr>}
            {filteredTable.map(m => {
              const isE = editId === m.id;
              const cc = CC[m.compatLevel];
              if (isE) return <EditRow key={m.id} machine={m} onSave={handleSave} onCancel={cancelEdit} />;
              return (
                <tr key={m.id} style={{ borderBottom: "1px solid #f3f4f6", verticalAlign: "top" }}>
                  <td style={{ padding: "8px 6px", color: "#374151" }}>{m.brand}</td>
                  <td style={{ padding: "8px 6px", color: "#111827", fontWeight: 500 }}>{m.model}</td>
                  <td style={{ padding: "8px 6px", color: "#6b7280" }}>{m.firmware}</td>
                  <td style={{ padding: "8px 6px", color: "#6b7280", maxWidth: 170, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.controller}</td>
                  <td style={{ padding: "8px 6px" }}><span style={{ fontSize: 11, fontWeight: 600, color: cc.color, background: cc.bg, border: `1px solid ${cc.bdr}`, borderRadius: 20, padding: "2px 8px", whiteSpace: "nowrap" }}>{cc.tag}</span></td>
                  <td style={{ padding: "8px 6px", color: "#6b7280", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={m.notes}>{m.notes}</td>
                  <td style={{ padding: "8px 6px", textAlign: "center" }}>
                    <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                      <Btn bg="#eff6ff" color="#2563eb" onClick={() => startEdit(m)}>Edit</Btn>
                      {confirmDel === m.id ? (
                        <><Btn bg="#dc2626" color="#fff" onClick={() => deleteRow(m.id)}>Yes</Btn><Btn onClick={() => setConfirmDel(null)}>No</Btn></>
                      ) : (
                        <Btn bg="#fef2f2" color="#dc2626" onClick={() => setConfirmDel(m.id)}>Del</Btn>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 12 }}>Showing {filteredTable.length} of {machines.length}. Edits auto-save. Use Export CSV to download.</p>
    </div>
  );
}
