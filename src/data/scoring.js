export function norm(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function score(q, m) {
  const qn = norm(q);
  const bn = norm(m.brand);
  const mn = norm(m.model);
  const cn = norm(m.controller);
  const all = bn + " " + mn + " " + cn;
  if (!qn) return 0;
  if (mn === qn) return 100;
  if (mn.startsWith(qn)) return 90;
  if ((bn + mn).includes(qn)) return 80;
  if (all.replace(/\s/g, "").includes(qn)) return 70;
  const ws = q.toLowerCase().split(/\s+/).filter(w => w.length > 1);
  if (!ws.length) return 0;
  const hits = ws.filter(w => all.includes(norm(w)));
  if (hits.length === ws.length) return 60;
  if (hits.length > 0) return 30 + (hits.length / ws.length) * 25;
  return 0;
}
