import { useState } from "react";
import { useMachines } from "./hooks/useMachines";
import SearchInput from "./components/SearchInput";
import DetailCard from "./components/DetailCard";
import PublicTable from "./components/PublicTable";
import AdminTable from "./components/AdminTable";
import PasswordPrompt from "./components/PasswordPrompt";

export default function App() {
  const { machines, loading, saveStatus, addRow, saveEdit, deleteRow, resetDB, exportCSV, importCSV, exportJSON, importJSON } = useMachines();
  const [mode, setMode] = useState("public");
  const [authed, setAuthed] = useState(false);
  const [showPwPrompt, setShowPwPrompt] = useState(false);
  const [sel, setSel] = useState(null);
  const [tblFilter, setTblFilter] = useState("");
  const [tblCompat, setTblCompat] = useState("all");

  const isAdmin = mode === "admin";

  const handleModeToggle = (v) => {
    if (v === "admin" && !authed) {
      setShowPwPrompt(true);
      return;
    }
    setMode(v);
    setSel(null);
  };

  if (loading) return <div style={{ fontFamily: "-apple-system,sans-serif", textAlign: "center", padding: 60, color: "#6b7280" }}>Loading machine database...</div>;

  return (
    <div style={{ fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif", maxWidth: 1100, margin: "0 auto", padding: "20px 16px" }}>
      {showPwPrompt && (
        <PasswordPrompt
          onSuccess={() => { setAuthed(true); setShowPwPrompt(false); setMode("admin"); setSel(null); }}
          onCancel={() => setShowPwPrompt(false)}
        />
      )}

      {/* Mode toggle */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <div style={{ display: "inline-flex", background: "#f3f4f6", borderRadius: 8, padding: 3 }}>
          {[["public", "Public"], ["admin", "Admin"]].map(([v, l]) => (
            <button key={v} onClick={() => handleModeToggle(v)} style={{ padding: "7px 16px", fontSize: 13, fontWeight: 600, border: "none", borderRadius: 6, cursor: "pointer", background: mode === v ? "#fff" : "transparent", color: mode === v ? "#111827" : "#6b7280", boxShadow: mode === v ? "0 1px 3px rgba(0,0,0,0.1)" : "none", transition: "all .15s" }}>{l}</button>
          ))}
        </div>
      </div>

      {isAdmin && <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 8, padding: "8px 14px", fontSize: 12, color: "#92400e", marginBottom: 16, textAlign: "center" }}>
        <strong>Admin Mode</strong> — Edit your machine database here. Changes are saved automatically. Switch to <strong>Public</strong> to see the read-only version.
      </div>}

      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Is my CNC compatible with MillMage?</h1>
        <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>Search {machines.length} machines{isAdmin ? " or edit the database" : ""}.</p>
      </div>

      {sel ? <DetailCard machine={sel} onBack={() => setSel(null)} /> : <SearchInput machines={machines} onSelect={setSel} />}

      <div style={{ marginTop: 24, borderTop: "1px solid #e5e7eb", paddingTop: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 12px" }}>{isAdmin ? "Edit Machine Database" : "Full Machine Database"}</h2>
        {isAdmin ? (
          <AdminTable
            machines={machines}
            tblFilter={tblFilter} setTblFilter={setTblFilter}
            tblCompat={tblCompat} setTblCompat={setTblCompat}
            saveStatus={saveStatus}
            onAddRow={addRow}
            onSaveEdit={saveEdit}
            onDeleteRow={deleteRow}
            onResetDB={resetDB}
            onExportCSV={exportCSV}
            onImportCSV={importCSV}
            onExportJSON={exportJSON}
            onImportJSON={importJSON}
          />
        ) : (
          <PublicTable
            machines={machines}
            tblFilter={tblFilter} setTblFilter={setTblFilter}
            tblCompat={tblCompat} setTblCompat={setTblCompat}
            onSelect={setSel}
          />
        )}
      </div>

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
