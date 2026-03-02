import { useState, useRef, useCallback, useEffect } from "react";
import { FIELDS } from "../data/compatLevels";

const STORAGE_KEY = "millmage-machines-db";

export function useMachines() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState(null);
  const nextId = useRef(0);

  // Load from localStorage or fetch default JSON
  useEffect(() => {
    (async () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMachines(parsed.map((m, i) => ({ ...m, id: i })));
            nextId.current = parsed.length;
            setLoading(false);
            return;
          }
        }
      } catch (e) { /* fall through */ }

      // Fallback: fetch static JSON
      try {
        const res = await fetch("/data/machines.json");
        const data = await res.json();
        setMachines(data.map((m, i) => ({ ...m, id: i })));
        nextId.current = data.length;
      } catch (e) {
        setMachines([]);
      }
      setLoading(false);
    })();
  }, []);

  const saveToDB = useCallback((data) => {
    setSaveStatus("saving");
    try {
      const clean = data.map(({ id, ...rest }) => rest);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (e) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 3000);
    }
  }, []);

  const addRow = useCallback(() => {
    const id = nextId.current++;
    const nw = { id, brand: "", model: "", firmware: "grbl", controller: "", compatLevel: "full", notes: "" };
    setMachines(prev => [nw, ...prev]);
    return nw;
  }, []);

  const saveEdit = useCallback((editId, data) => {
    setMachines(prev => {
      const updated = prev.map(m => m.id === editId ? { ...m, ...data } : m);
      saveToDB(updated);
      return updated;
    });
  }, [saveToDB]);

  const deleteRow = useCallback((id) => {
    setMachines(prev => {
      const updated = prev.filter(m => m.id !== id);
      saveToDB(updated);
      return updated;
    });
  }, [saveToDB]);

  const resetDB = useCallback(async () => {
    try {
      const res = await fetch("/data/machines.json");
      const data = await res.json();
      const fresh = data.map((m, i) => ({ ...m, id: i }));
      nextId.current = data.length;
      setMachines(fresh);
      saveToDB(fresh);
    } catch (e) {
      setSaveStatus("error");
    }
  }, [saveToDB]);

  const exportCSV = useCallback(() => {
    const hdr = "brand,model,firmware,controller,compatLevel,notes";
    const rows = machines.map(m =>
      FIELDS.map(f => `"${String(m[f] || "").replace(/"/g, '""')}"`).join(",")
    );
    const blob = new Blob([hdr + "\n" + rows.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "millmage_machines.csv";
    a.click();
  }, [machines]);

  const exportJSON = useCallback(() => {
    const clean = machines.map(({ id, ...rest }) => rest);
    const blob = new Blob([JSON.stringify(clean, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "machines.json";
    a.click();
  }, [machines]);

  const importJSON = useCallback(() => {
    const inp = document.createElement("input");
    inp.type = "file";
    inp.accept = ".json";
    inp.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const txt = await file.text();
        const data = JSON.parse(txt);
        if (!Array.isArray(data) || data.length === 0 || !data[0].brand || !data[0].model) {
          alert("Invalid JSON: expected an array of objects with brand and model fields.");
          return;
        }
        const imported = data.map((r, i) => ({ ...r, id: i }));
        nextId.current = imported.length;
        setMachines(imported);
        saveToDB(imported);
      } catch (err) {
        alert("Failed to parse JSON file: " + err.message);
      }
    };
    inp.click();
  }, [saveToDB]);

  const importCSV = useCallback(() => {
    const inp = document.createElement("input");
    inp.type = "file";
    inp.accept = ".csv";
    inp.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const txt = await file.text();
      const lines = txt.split("\n").map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) return;
      const hdr = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
      const rows = [];
      for (let i = 1; i < lines.length; i++) {
        const vals = [];
        let cur = "", inQ = false;
        for (const ch of lines[i]) {
          if (ch === '"') { inQ = !inQ; }
          else if (ch === "," && !inQ) { vals.push(cur.trim()); cur = ""; }
          else { cur += ch; }
        }
        vals.push(cur.trim());
        const obj = {};
        hdr.forEach((h, j) => { obj[h] = vals[j] || ""; });
        if (obj.brand || obj.model) rows.push(obj);
      }
      const imported = rows.map((r, i) => ({ ...r, id: i }));
      nextId.current = imported.length;
      setMachines(imported);
      saveToDB(imported);
    };
    inp.click();
  }, [saveToDB]);

  return { machines, loading, saveStatus, addRow, saveEdit, deleteRow, resetDB, exportCSV, importCSV, exportJSON, importJSON };
}
