export const CC = {
  full: { tag: "CAD + CAM + Control", color: "#059669", bg: "#ecfdf5", bdr: "#a7f3d0", icon: "\u2713", sum: "MillMage can design, generate toolpaths, and directly connect to and control your machine." },
  cam: { tag: "CAD + CAM", color: "#d97706", bg: "#fffbeb", bdr: "#fde68a", icon: "\u25D0", sum: "MillMage can design and generate GCode, but cannot directly control your machine. Export GCode and transfer separately." },
  maybe: { tag: "Limited", color: "#7c3aed", bg: "#f5f3ff", bdr: "#ddd6fe", icon: "?", sum: "Proprietary or non-standard controller. Compatibility is limited or unverified." },
  depends: { tag: "Varies", color: "#2563eb", bg: "#eff6ff", bdr: "#bfdbfe", icon: "\u2699", sum: "Compatibility depends on which controller/firmware is installed. Check your firmware." },
  unlikely: { tag: "Not Compatible", color: "#dc2626", bg: "#fef2f2", bdr: "#fecaca", icon: "\u2717", sum: "Proprietary control software that MillMage cannot interface with." },
};

export const COMPAT_OPTS = ["full", "cam", "maybe", "depends", "unlikely"];

export const FIELDS = ["brand", "model", "firmware", "controller", "compatLevel", "notes"];
