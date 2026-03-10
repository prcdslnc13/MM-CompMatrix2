import { useState } from "react";
import { useMachines } from "./hooks/useMachines";
import { theme } from "./theme";
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

  if (loading) return <div style={{ fontFamily: theme.font.body, textAlign: "center", padding: 60, color: "#6b7280" }}>Loading machine database...</div>;

  return (
    <div style={{ fontFamily: theme.font.body, maxWidth: 1100, margin: "0 auto", padding: "20px 16px" }}>
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
        <div style={{ marginBottom: 10 }}>
          <img src="/logo.svg" alt="MillMage" style={{ height: 32 }} />
        </div>
        <p style={{ fontSize: 14, color: "#374151", margin: "0 0 4px", maxWidth: 540, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>Use this tool to find out how well MillMage works with your CNC router.</p>
        <p style={{ fontSize: 14, color: "#374151", margin: "0 0 12px", maxWidth: 540, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>We've covered many of the most popular machines available today.</p>
        <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 4px", maxWidth: 540, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>Don't see your machine listed? Reach out to us at <a href="mailto:support@millmagesoftware.com" style={{ color: theme.brand.primary, textDecoration: "underline", textUnderlineOffset: 2 }}>Support@MillMageSoftware.com</a></p>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0, maxWidth: 540, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>We'll look into it, let you know what level of compatibility to expect, and get it added!</p>
      </div>

      <SearchInput machines={machines} onSelect={setSel} />

      {sel && (
        <div
          onClick={() => setSel(null)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "20px 16px",
            animation: "backdropIn .2s ease",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: "24px 24px 20px",
              width: "100%",
              maxWidth: 560,
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              animation: "modalIn .2s ease",
              position: "relative",
            }}
          >
            <button
              onClick={() => setSel(null)}
              aria-label="Close"
              style={{
                position: "absolute", top: 12, right: 14,
                background: "none", border: "none",
                fontSize: 20, lineHeight: 1, cursor: "pointer",
                color: "#9ca3af", padding: "2px 6px", borderRadius: 6,
              }}
            >✕</button>
            <DetailCard machine={sel} onBack={() => setSel(null)} />
          </div>
        </div>
      )}

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

      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes backdropIn{from{opacity:0}to{opacity:1}}
        @keyframes modalIn{from{opacity:0;transform:translateY(12px) scale(0.98)}to{opacity:1;transform:translateY(0) scale(1)}}
      `}</style>
    </div>
  );
}
