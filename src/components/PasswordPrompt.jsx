import { useState } from "react";
import { theme } from "../theme";

function getAdminPassword() {
  return import.meta.env.VITE_ADMIN_PASSWORD || window.__ENV__?.ADMIN_PASSWORD || "";
}

export default function PasswordPrompt({ onSuccess, onCancel }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pw === getAdminPassword()) {
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <form onSubmit={handleSubmit} style={{ background: "#fff", borderRadius: 12, padding: "28px 32px", maxWidth: 360, width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>Admin Access</h2>
        <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 16px" }}>Enter the admin password to edit the machine database.</p>
        <input
          type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          placeholder="Password"
          autoFocus
          style={{ width: "100%", border: `2px solid ${error ? "#dc2626" : "#d1d5db"}`, borderRadius: 8, padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 12 }}
        />
        {error && <p style={{ fontSize: 12, color: "#dc2626", margin: "0 0 8px" }}>Incorrect password.</p>}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button type="button" onClick={onCancel} style={{ border: "1px solid #d1d5db", borderRadius: 6, padding: "8px 16px", fontSize: 13, fontWeight: 500, background: "#fff", color: "#374151", cursor: "pointer" }}>Cancel</button>
          <button type="submit" style={{ border: "none", borderRadius: 6, padding: "8px 16px", fontSize: 13, fontWeight: 600, background: theme.brand.primary, color: "#fff", cursor: "pointer" }}>Enter</button>
        </div>
      </form>
    </div>
  );
}
