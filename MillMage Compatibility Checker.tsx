import { useState, useMemo, useRef } from "react";

// ============================================================
// MACHINE DATABASE — Edit this array to add/remove/update machines
// Fields: brand, model, firmware, controller, compatLevel, notes
// compatLevel: "full" | "cam" | "maybe" | "depends" | "unlikely"
// ============================================================
const MACHINES = [
  // ── CARBIDE 3D (GRBL) ──
  { brand:"Carbide 3D", model:"Shapeoko 5 Pro", firmware:"grbl", controller:"GRBL 1.1 (Carbide Motion Controller)", compatLevel:"full", notes:"Ships with GRBL 1.1 firmware. Full CAD, CAM, and Control via USB." },
  { brand:"Carbide 3D", model:"Shapeoko 5 Pro 4x4", firmware:"grbl", controller:"GRBL 1.1 (Carbide Motion Controller)", compatLevel:"full", notes:"Ships with GRBL 1.1. Full compatibility." },
  { brand:"Carbide 3D", model:"Shapeoko 4", firmware:"grbl", controller:"GRBL 1.1 (Carbide Motion Controller)", compatLevel:"full", notes:"GRBL 1.1 firmware. Full compatibility." },
  { brand:"Carbide 3D", model:"Shapeoko 4 XL", firmware:"grbl", controller:"GRBL 1.1", compatLevel:"full", notes:"GRBL 1.1 firmware. Full compatibility." },
  { brand:"Carbide 3D", model:"Shapeoko 4 XXL", firmware:"grbl", controller:"GRBL 1.1", compatLevel:"full", notes:"GRBL 1.1 firmware. Full compatibility." },
  { brand:"Carbide 3D", model:"Shapeoko Pro", firmware:"grbl", controller:"GRBL 1.1", compatLevel:"full", notes:"GRBL 1.1 firmware. Full compatibility." },
  { brand:"Carbide 3D", model:"Shapeoko Pro XL", firmware:"grbl", controller:"GRBL 1.1", compatLevel:"full", notes:"GRBL 1.1 firmware. Full compatibility." },
  { brand:"Carbide 3D", model:"Shapeoko Pro XXL", firmware:"grbl", controller:"GRBL 1.1", compatLevel:"full", notes:"GRBL 1.1 firmware. Full compatibility." },
  { brand:"Carbide 3D", model:"Shapeoko 3", firmware:"grbl", controller:"GRBL 1.1", compatLevel:"full", notes:"GRBL 1.1 firmware. Full compatibility." },
  { brand:"Carbide 3D", model:"Shapeoko 3 XL", firmware:"grbl", controller:"GRBL 1.1", compatLevel:"full", notes:"GRBL 1.1 firmware. Full compatibility." },
  { brand:"Carbide 3D", model:"Shapeoko 3 XXL", firmware:"grbl", controller:"GRBL 1.1", compatLevel:"full", notes:"GRBL 1.1 firmware. Full compatibility." },
  { brand:"Carbide 3D", model:"Shapeoko HDM", firmware:"grbl", controller:"GRBL 1.1", compatLevel:"full", notes:"GRBL 1.1 firmware. Full compatibility." },
  { brand:"Carbide 3D", model:"Shapeoko 2", firmware:"grbl", controller:"GRBL (Arduino + GShield)", compatLevel:"full", notes:"Older GRBL version — may need firmware update to 1.1 for best results." },
  { brand:"Carbide 3D", model:"Nomad 3", firmware:"grbl", controller:"GRBL 1.1", compatLevel:"full", notes:"GRBL 1.1 firmware. Full compatibility." },
  { brand:"Carbide 3D", model:"Nomad 883", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL-based. Full compatibility." },
  { brand:"Carbide 3D", model:"Nomad 883 Pro", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL-based. Full compatibility." },

  // ── INVENTABLES ──
  { brand:"Inventables", model:"X-Carve", firmware:"grbl", controller:"X-Controller (GRBL)", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Inventables", model:"X-Carve Pro", firmware:"grbl", controller:"X-Controller (GRBL)", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Inventables", model:"X-Carve (2021+)", firmware:"grbl", controller:"X-Controller (GRBL)", compatLevel:"full", notes:"Updated X-Carve still uses GRBL. Full compatibility." },
  { brand:"Inventables", model:"Carvey", firmware:"grbl", controller:"GRBL-based", compatLevel:"full", notes:"GRBL-based. Full compatibility." },

  // ── SIENCI LABS ──
  { brand:"Sienci Labs", model:"LongMill MK1", firmware:"grbl", controller:"GRBL (Arduino-based)", compatLevel:"full", notes:"Original LongMill runs GRBL. Full compatibility." },
  { brand:"Sienci Labs", model:"LongMill MK1 30x30", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Sienci Labs", model:"LongMill MK1 12x30", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Sienci Labs", model:"LongMill MK2", firmware:"grblhal", controller:"grblHAL (SLB controller)", compatLevel:"full", notes:"Runs grblHAL firmware. Full compatibility." },
  { brand:"Sienci Labs", model:"LongMill MK2 30x30", firmware:"grblhal", controller:"grblHAL (SLB controller)", compatLevel:"full", notes:"grblHAL firmware. Full compatibility." },
  { brand:"Sienci Labs", model:"LongMill MK2 48x30", firmware:"grblhal", controller:"grblHAL (SLB controller)", compatLevel:"full", notes:"grblHAL firmware. Full compatibility." },
  { brand:"Sienci Labs", model:"LongMill MK2.5", firmware:"grblhal", controller:"grblHAL (SLB controller)", compatLevel:"full", notes:"grblHAL firmware. Full compatibility." },
  { brand:"Sienci Labs", model:"AltMill", firmware:"grblhal", controller:"grblHAL (SLB controller)", compatLevel:"full", notes:"grblHAL firmware. Full compatibility." },
  { brand:"Sienci Labs", model:"Mill One V1", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Sienci Labs", model:"Mill One V2", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Sienci Labs", model:"Mill One V3", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },

  // ── OPENBUILDS ──
  { brand:"OpenBuilds", model:"LEAD CNC 1010", firmware:"grbl", controller:"BlackBox (GRBL)", compatLevel:"full", notes:"BlackBox controller runs GRBL. Full compatibility." },
  { brand:"OpenBuilds", model:"LEAD CNC 1515", firmware:"grbl", controller:"BlackBox (GRBL)", compatLevel:"full", notes:"BlackBox controller runs GRBL. Full compatibility." },
  { brand:"OpenBuilds", model:"LEAD CNC", firmware:"grbl", controller:"BlackBox (GRBL)", compatLevel:"full", notes:"BlackBox controller runs GRBL. Full compatibility." },
  { brand:"OpenBuilds", model:"MiniMill", firmware:"grbl", controller:"BlackBox (GRBL)", compatLevel:"full", notes:"BlackBox controller runs GRBL. Full compatibility." },
  { brand:"OpenBuilds", model:"WorkBee", firmware:"grbl", controller:"BlackBox (GRBL)", compatLevel:"full", notes:"Typically paired with BlackBox (GRBL). Full compatibility." },
  { brand:"OpenBuilds", model:"C-Beam Machine", firmware:"grbl", controller:"BlackBox / xPRO (GRBL)", compatLevel:"full", notes:"GRBL-based controller. Full compatibility." },
  { brand:"OpenBuilds", model:"Sphinx", firmware:"grbl", controller:"BlackBox (GRBL)", compatLevel:"full", notes:"GRBL-based. Full compatibility." },
  { brand:"OpenBuilds", model:"ACRO System", firmware:"grbl", controller:"BlackBox (GRBL)", compatLevel:"full", notes:"GRBL-based. Full compatibility." },

  // ── ONEFINITY (Standard = Buildbotics; Elite = Masso) ──
  { brand:"Onefinity", model:"Woodworker X-35", firmware:"other_builtin", controller:"Onefinity Controller (Buildbotics-based)", compatLevel:"cam", notes:"Buildbotics-based controller. CAM Only." },
  { brand:"Onefinity", model:"Woodworker X-50", firmware:"other_builtin", controller:"Onefinity Controller (Buildbotics-based)", compatLevel:"cam", notes:"Buildbotics-based controller. CAM Only." },
  { brand:"Onefinity", model:"Machinist X-35", firmware:"other_builtin", controller:"Onefinity Controller (Buildbotics-based)", compatLevel:"cam", notes:"Buildbotics-based controller. CAM Only." },
  { brand:"Onefinity", model:"Machinist X-50", firmware:"other_builtin", controller:"Onefinity Controller (Buildbotics-based)", compatLevel:"cam", notes:"Buildbotics-based controller. CAM Only." },
  { brand:"Onefinity", model:"Journeyman X-50", firmware:"other_builtin", controller:"Onefinity Controller (Buildbotics-based)", compatLevel:"cam", notes:"Buildbotics-based controller. CAM Only." },
  { brand:"Onefinity", model:"Foreman", firmware:"other_builtin", controller:"Onefinity Controller (Buildbotics-based)", compatLevel:"cam", notes:"Buildbotics-based controller. CAM Only." },
  { brand:"Onefinity", model:"Elite Foreman", firmware:"masso", controller:"Masso G3 Controller", compatLevel:"cam", notes:"Masso controller. MillMage can generate GCode (CAM Only) but cannot directly control it." },
  { brand:"Onefinity", model:"Elite Journeyman", firmware:"masso", controller:"Masso G3 Controller", compatLevel:"cam", notes:"Masso controller. CAM Only." },
  { brand:"Onefinity", model:"Elite Woodworker", firmware:"masso", controller:"Masso G3 Controller", compatLevel:"cam", notes:"Masso controller. CAM Only." },
  { brand:"Onefinity", model:"Elite Machinist", firmware:"masso", controller:"Masso G3 Controller", compatLevel:"cam", notes:"Masso controller. CAM Only." },

  // ── SAINSMART / GENMITSU ──
  { brand:"SainSmart", model:"Genmitsu 3018-PROVer", firmware:"grbl", controller:"GRBL 1.1", compatLevel:"full", notes:"GRBL 1.1 firmware. Full compatibility." },
  { brand:"SainSmart", model:"Genmitsu 3018-PROVer V2", firmware:"grbl", controller:"GRBL 1.1", compatLevel:"full", notes:"GRBL 1.1 firmware. Full compatibility." },
  { brand:"SainSmart", model:"Genmitsu 3018-PRO", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"SainSmart", model:"Genmitsu 3018-MX3", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"SainSmart", model:"Genmitsu CNC 3018", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"SainSmart", model:"Genmitsu PROVerXL 4030 V2", firmware:"grbl", controller:"GRBL (customized)", compatLevel:"full", notes:"Customized GRBL. Select GRBL in MillMage device setup." },
  { brand:"SainSmart", model:"Genmitsu PROVerXL 4030", firmware:"grbl", controller:"GRBL (customized)", compatLevel:"full", notes:"Customized GRBL. Select GRBL in MillMage device setup." },
  { brand:"SainSmart", model:"Genmitsu PROVerXL 6050", firmware:"grbl", controller:"GRBL (customized)", compatLevel:"full", notes:"Customized GRBL. Full compatibility." },
  { brand:"SainSmart", model:"Genmitsu PROVerXL 6050 Plus", firmware:"grbl", controller:"GRBL (customized)", compatLevel:"full", notes:"Customized GRBL. Full compatibility." },
  { brand:"SainSmart", model:"Genmitsu 3030-PROVer MAX", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"SainSmart", model:"Genmitsu 4040-PROVer", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"SainSmart", model:"Genmitsu CNC Router 1810", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },

  // ── BOBSCNC ──
  { brand:"BobsCNC", model:"Evolution 4", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"BobsCNC", model:"Evolution 3", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"BobsCNC", model:"KL744", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"BobsCNC", model:"KL733", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"BobsCNC", model:"Revolution", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"BobsCNC", model:"Quantum", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"BobsCNC", model:"E3", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"BobsCNC", model:"E4", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },

  // ── FOXALIEN ──
  { brand:"FoxAlien", model:"Masuter", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"FoxAlien", model:"Masuter Pro", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"FoxAlien", model:"Masuter 4040-XE", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"FoxAlien", model:"Vasto", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"FoxAlien", model:"Reizer 3020", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"FoxAlien", model:"WM-3020", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },

  // ── MILLRIGHT CNC ──
  { brand:"Millright CNC", model:"Mega V", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Millright CNC", model:"Mega V XL", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Millright CNC", model:"Mega V XXL", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Millright CNC", model:"Carve King 2", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Millright CNC", model:"Power Route", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Millright CNC", model:"Power Route XL", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Millright CNC", model:"M3", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },

  // ── YORAHOME ──
  { brand:"YoraHome", model:"Silverback 6060", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"YoraHome", model:"Silverback 4040", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"YoraHome", model:"Mandrill 3030", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"YoraHome", model:"Mandrill 2417", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },

  // ── TWO TREES ──
  { brand:"Two Trees", model:"TTC 450", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Two Trees", model:"TTC 6550", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Two Trees", model:"TTC 3018 Pro", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },

  // ── GENERIC 3018 / BUDGET ──
  { brand:"Generic", model:"CNC 3018", firmware:"grbl", controller:"GRBL (Arduino-based)", compatLevel:"full", notes:"Most 3018 machines run GRBL. Full compatibility." },
  { brand:"Generic", model:"CNC 3018-PRO", firmware:"grbl", controller:"GRBL (Arduino-based)", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Generic", model:"CNC 1610", firmware:"grbl", controller:"GRBL (Arduino-based)", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Generic", model:"CNC 2418", firmware:"grbl", controller:"GRBL (Arduino-based)", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Generic", model:"CNC 3040", firmware:"grbl", controller:"GRBL or Mach3 (varies)", compatLevel:"depends", notes:"Some 3040 machines use GRBL (full), others use Mach3 (CAM Only). Check your controller." },
  { brand:"Generic", model:"CNC 6040", firmware:"varies", controller:"Mach3 or GRBL (varies)", compatLevel:"depends", notes:"Commonly Mach3 (CAM Only). Some upgraded to GRBL (full). Check your controller." },
  { brand:"Generic", model:"CNC 6090", firmware:"varies", controller:"DSP / Mach3 (varies)", compatLevel:"depends", notes:"Industrial-grade desktops often use DSP or Mach3. Check your specific controller." },
  { brand:"MySweety", model:"CNC 3018 PRO", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"VEVOR", model:"CNC 3018", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"VEVOR", model:"CNC 3018 PRO", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"VEVOR", model:"CNC 3040T", firmware:"varies", controller:"Mach3 or GRBL", compatLevel:"depends", notes:"Varies by version. Check if your controller is GRBL or Mach3." },
  { brand:"Mostics", model:"CNC 3018 PRO", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"RATTMMOTOR", model:"CNC 3018 PRO", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"TopDirect", model:"CNC 3018", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Cenoz", model:"CNC 3018 PRO", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"MYSWEETY", model:"CNC Router 3018", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },

  // ── MAKERMADE / MASLOW ──
  { brand:"MakerMade", model:"M2", firmware:"grbl", controller:"GRBL 1.1 (Arduino Due)", compatLevel:"full", notes:"GRBL 1.1 based firmware. Full compatibility — unique chain-drive design." },
  { brand:"MakerMade", model:"Maslow CNC (M2 kit)", firmware:"grbl", controller:"GRBL 1.1 (Due Board)", compatLevel:"full", notes:"Uses GRBL 1.1 on Arduino Due. Full compatibility." },
  { brand:"Maslow CNC", model:"Maslow (Original/Classic)", firmware:"other_builtin", controller:"Maslow Mega (custom firmware)", compatLevel:"maybe", notes:"Original Maslow uses custom firmware on Arduino Mega. Not standard GRBL — limited compatibility." },

  // ── AVID CNC ──
  { brand:"Avid CNC", model:"PRO CNC 4x8", firmware:"mach", controller:"Mach4 / Avid CNC Control", compatLevel:"cam", notes:"Runs Mach4. CAM Only — export GCode and transfer to your machine." },
  { brand:"Avid CNC", model:"PRO CNC 4x4", firmware:"mach", controller:"Mach4 / Avid CNC Control", compatLevel:"cam", notes:"Runs Mach4. CAM Only." },
  { brand:"Avid CNC", model:"PRO CNC 5x10", firmware:"mach", controller:"Mach4 / Avid CNC Control", compatLevel:"cam", notes:"Runs Mach4. CAM Only." },
  { brand:"Avid CNC", model:"PRO CNC 4x2", firmware:"mach", controller:"Mach4 / Avid CNC Control", compatLevel:"cam", notes:"Runs Mach4. CAM Only." },
  { brand:"Avid CNC", model:"Benchtop PRO 2x4", firmware:"mach", controller:"Mach4", compatLevel:"cam", notes:"Runs Mach4. CAM Only." },
  { brand:"Avid CNC", model:"Benchtop PRO 2x3", firmware:"mach", controller:"Mach4", compatLevel:"cam", notes:"Runs Mach4. CAM Only." },
  { brand:"Avid CNC", model:"Standard CNC 4x8", firmware:"mach", controller:"Mach4", compatLevel:"cam", notes:"Runs Mach4. CAM Only." },
  { brand:"Avid CNC", model:"Standard CNC 4x4", firmware:"mach", controller:"Mach4", compatLevel:"cam", notes:"Runs Mach4. CAM Only." },

  // ── SHOPBOT ──
  { brand:"ShopBot", model:"Desktop", firmware:"other_builtin", controller:"ShopBot Control Software (proprietary)", compatLevel:"unlikely", notes:"ShopBot uses proprietary control software and file format (.sbp). Not compatible with MillMage." },
  { brand:"ShopBot", model:"Desktop MAX", firmware:"other_builtin", controller:"ShopBot Control (proprietary)", compatLevel:"unlikely", notes:"Proprietary control. Not compatible." },
  { brand:"ShopBot", model:"Buddy", firmware:"other_builtin", controller:"ShopBot Control (proprietary)", compatLevel:"unlikely", notes:"Proprietary control. Not compatible." },
  { brand:"ShopBot", model:"PRSalpha", firmware:"other_builtin", controller:"ShopBot Control (proprietary)", compatLevel:"unlikely", notes:"Proprietary control. Not compatible." },
  { brand:"ShopBot", model:"PRSstandard", firmware:"other_builtin", controller:"ShopBot Control (proprietary)", compatLevel:"unlikely", notes:"Proprietary control. Not compatible." },
  { brand:"ShopBot", model:"PRS", firmware:"other_builtin", controller:"ShopBot Control (proprietary)", compatLevel:"unlikely", notes:"Proprietary control. Not compatible." },

  // ── AXIOM PRECISION ──
  { brand:"Axiom", model:"Iconic 4", firmware:"other_builtin", controller:"RichAuto DSP Controller", compatLevel:"cam", notes:"RichAuto DSP controller. CAM Only — use LinuxCNC flavor. Requires metric units. Needs to be manually set to accept feed and speed commands from G-Code in the controller." },
  { brand:"Axiom", model:"Iconic 6", firmware:"other_builtin", controller:"RichAuto DSP Controller", compatLevel:"cam", notes:"RichAuto DSP controller. CAM Only — use LinuxCNC flavor. Requires metric units. Needs to be manually set to accept feed and speed commands from G-Code in the controller." },
  { brand:"Axiom", model:"Iconic 8", firmware:"other_builtin", controller:"RichAuto DSP Controller", compatLevel:"cam", notes:"RichAuto DSP controller. CAM Only — use LinuxCNC flavor. Requires metric units. Needs to be manually set to accept feed and speed commands from G-Code in the controller." },
  { brand:"Axiom", model:"AR4 Pro V5", firmware:"other_builtin", controller:"RichAuto B18 DSP Controller", compatLevel:"cam", notes:"RichAuto DSP controller. CAM Only — use LinuxCNC flavor. Requires metric units. Needs to be manually set to accept feed and speed commands from G-Code in the controller." },
  { brand:"Axiom", model:"AR6 Pro V5", firmware:"other_builtin", controller:"RichAuto B18 DSP Controller", compatLevel:"cam", notes:"RichAuto DSP controller. CAM Only — use LinuxCNC flavor. Requires metric units. Needs to be manually set to accept feed and speed commands from G-Code in the controller." },
  { brand:"Axiom", model:"AR8 Pro V5", firmware:"other_builtin", controller:"RichAuto B18 DSP Controller", compatLevel:"cam", notes:"RichAuto DSP controller. CAM Only — use LinuxCNC flavor. Requires metric units. Needs to be manually set to accept feed and speed commands from G-Code in the controller." },

  // ── NEXT WAVE / CNC SHARK ──
  { brand:"Next Wave", model:"CNC Shark HD5", firmware:"other_builtin", controller:"Next Wave Ready2Control (GRBL-variant)", compatLevel:"maybe", notes:"Uses a proprietary GRBL-variant controller. Compatibility is limited and unverified — try the 30-day free trial." },
  { brand:"Next Wave", model:"CNC Shark HD4", firmware:"other_builtin", controller:"Next Wave Ready2Control", compatLevel:"maybe", notes:"Proprietary GRBL-variant. Limited/unverified compatibility." },
  { brand:"Next Wave", model:"CNC Shark HD3", firmware:"other_builtin", controller:"Next Wave proprietary", compatLevel:"maybe", notes:"Proprietary controller. Limited compatibility." },
  { brand:"Next Wave", model:"CNC Shark HD520", firmware:"other_builtin", controller:"Next Wave Ready2Control", compatLevel:"maybe", notes:"Proprietary GRBL-variant. Limited compatibility." },
  { brand:"Next Wave", model:"CNC Piranha FX", firmware:"other_builtin", controller:"Next Wave proprietary", compatLevel:"maybe", notes:"Proprietary controller. Limited compatibility." },
  { brand:"Next Wave", model:"CNC Piranha XL", firmware:"other_builtin", controller:"Next Wave proprietary", compatLevel:"maybe", notes:"Proprietary controller. Limited compatibility." },

  // ── STEPCRAFT ──
  { brand:"Stepcraft", model:"D.420", firmware:"uccnc", controller:"UCCNC", compatLevel:"cam", notes:"Runs UCCNC. CAM Only — export GCode and transfer." },
  { brand:"Stepcraft", model:"D.600", firmware:"uccnc", controller:"UCCNC", compatLevel:"cam", notes:"Runs UCCNC. CAM Only." },
  { brand:"Stepcraft", model:"D.840", firmware:"uccnc", controller:"UCCNC", compatLevel:"cam", notes:"Runs UCCNC. CAM Only." },
  { brand:"Stepcraft", model:"M.500", firmware:"uccnc", controller:"UCCNC", compatLevel:"cam", notes:"Runs UCCNC. CAM Only." },
  { brand:"Stepcraft", model:"M.700", firmware:"uccnc", controller:"UCCNC", compatLevel:"cam", notes:"Runs UCCNC. CAM Only." },
  { brand:"Stepcraft", model:"M.1000", firmware:"uccnc", controller:"UCCNC", compatLevel:"cam", notes:"Runs UCCNC. CAM Only." },
  { brand:"Stepcraft", model:"Q.204", firmware:"uccnc", controller:"UCCNC", compatLevel:"cam", notes:"Runs UCCNC. CAM Only." },
  { brand:"Stepcraft", model:"Q.408", firmware:"uccnc", controller:"UCCNC", compatLevel:"cam", notes:"Runs UCCNC. CAM Only." },

  // ── SNAPMAKER ──
  { brand:"Snapmaker", model:"Snapmaker 2.0 A150", firmware:"other_builtin", controller:"Snapmaker proprietary (Marlin-based)", compatLevel:"maybe", notes:"Proprietary controller. Community testing ongoing." },
  { brand:"Snapmaker", model:"Snapmaker 2.0 A250", firmware:"other_builtin", controller:"Snapmaker proprietary (Marlin-based)", compatLevel:"maybe", notes:"Proprietary controller. Community testing ongoing." },
  { brand:"Snapmaker", model:"Snapmaker 2.0 A350", firmware:"other_builtin", controller:"Snapmaker proprietary (Marlin-based)", compatLevel:"maybe", notes:"Proprietary controller. Community testing ongoing." },
  { brand:"Snapmaker", model:"Snapmaker Artisan", firmware:"other_builtin", controller:"Snapmaker proprietary", compatLevel:"maybe", notes:"Proprietary controller. Community testing ongoing." },
  { brand:"Snapmaker", model:"Snapmaker J1", firmware:"other_builtin", controller:"Snapmaker proprietary", compatLevel:"maybe", notes:"Proprietary controller. Community testing ongoing." },
  { brand:"Snapmaker", model:"Snapmaker Original", firmware:"other_builtin", controller:"Snapmaker proprietary (Marlin-based)", compatLevel:"maybe", notes:"Proprietary controller. Limited compatibility." },

  // ── OOZNEST ──
  { brand:"Ooznest", model:"WorkBee 750x750", firmware:"grbl", controller:"GRBL (Duet optional)", compatLevel:"full", notes:"Typically GRBL with BlackBox. If using Duet, CAM Only." },
  { brand:"Ooznest", model:"WorkBee 1000x1000", firmware:"grbl", controller:"GRBL (Duet optional)", compatLevel:"full", notes:"Typically GRBL with BlackBox. If using Duet, CAM Only." },
  { brand:"Ooznest", model:"WorkBee 1500x1500", firmware:"grbl", controller:"GRBL (Duet optional)", compatLevel:"full", notes:"Typically GRBL with BlackBox. If using Duet, CAM Only." },
  { brand:"Ooznest", model:"WorkBee Z1+", firmware:"grbl", controller:"GRBL / Duet (varies)", compatLevel:"full", notes:"Check which controller you have. GRBL = full, Duet = CAM Only." },

  // ── CAMaster ──
  { brand:"CAMaster", model:"Stinger I", firmware:"mach", controller:"Mach3/Mach4", compatLevel:"cam", notes:"Typically runs Mach3/Mach4. CAM Only." },
  { brand:"CAMaster", model:"Stinger II", firmware:"mach", controller:"Mach3/Mach4", compatLevel:"cam", notes:"Runs Mach3/Mach4. CAM Only." },
  { brand:"CAMaster", model:"Stinger III", firmware:"mach", controller:"Mach3/Mach4", compatLevel:"cam", notes:"Runs Mach3/Mach4. CAM Only." },
  { brand:"CAMaster", model:"Cobra", firmware:"mach", controller:"Mach3/Mach4", compatLevel:"cam", notes:"Runs Mach3/Mach4. CAM Only." },

  // ── LAGUNA TOOLS ──
  { brand:"Laguna Tools", model:"IQ Pro", firmware:"other_builtin", controller:"Proprietary DSP", compatLevel:"unlikely", notes:"Laguna uses proprietary control. Not compatible." },
  { brand:"Laguna Tools", model:"Swift", firmware:"other_builtin", controller:"Proprietary DSP", compatLevel:"unlikely", notes:"Proprietary control. Not compatible." },
  { brand:"Laguna Tools", model:"SmartShop II", firmware:"other_builtin", controller:"Proprietary", compatLevel:"unlikely", notes:"Proprietary control. Not compatible." },

  // ── SHOP SABRE ──
  { brand:"Shop Sabre", model:"RC 23", firmware:"mach", controller:"Mach3/Mach4", compatLevel:"cam", notes:"Typically runs Mach3/Mach4. CAM Only." },
  { brand:"Shop Sabre", model:"RC 43", firmware:"mach", controller:"Mach3/Mach4", compatLevel:"cam", notes:"Runs Mach3/Mach4. CAM Only." },
  { brand:"Shop Sabre", model:"IS Series", firmware:"other_builtin", controller:"Proprietary (Centroid)", compatLevel:"unlikely", notes:"Industrial Centroid controller. Not compatible." },

  // ── CNCROUTERPARTS / MISC ──
  { brand:"CNC4Newbie", model:"NewCarve", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Bulkman 3D", model:"WorkBee CNC", firmware:"grbl", controller:"GRBL (xPRO / BlackBox)", compatLevel:"full", notes:"Typically GRBL. Full compatibility." },
  { brand:"Bulkman 3D", model:"LEAD CNC Kit", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Bulkman 3D", model:"QueenBee CNC", firmware:"grbl", controller:"GRBL / FluidNC", compatLevel:"full", notes:"Typically GRBL or FluidNC. Full compatibility." },
  { brand:"RatRig", model:"V-Core CNC", firmware:"grbl", controller:"GRBL / FluidNC", compatLevel:"full", notes:"Check firmware — GRBL/FluidNC = full support." },

  // ── 3D PRINTERS WITH CNC (Multi-function) ──
  { brand:"Creality", model:"CP-01", firmware:"other_builtin", controller:"Creality proprietary (Marlin-based)", compatLevel:"maybe", notes:"Marlin-based proprietary controller. Limited compatibility." },
  { brand:"Sainsmart", model:"Coreception", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL when in CNC mode. Full compatibility." },

  // ── PRINTDRY / PRINTCNC / DIY ──
  { brand:"PrintNC", model:"PrintNC", firmware:"varies", controller:"Varies (commonly FluidNC, grblHAL, LinuxCNC)", compatLevel:"depends", notes:"DIY design — compatibility depends on your controller. GRBL/grblHAL/FluidNC = full. LinuxCNC/Mach3 = CAM Only." },
  { brand:"MPCNC", model:"Mostly Printed CNC (V1 Engineering)", firmware:"varies", controller:"GRBL / Marlin (varies)", compatLevel:"depends", notes:"GRBL builds = full support. Marlin builds = limited compatibility. Check your firmware." },
  { brand:"Root CNC", model:"Root CNC 3", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"Typically GRBL-based. Full compatibility." },
  { brand:"DIY", model:"Arduino + CNC Shield", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"Standard GRBL on Arduino Uno/Nano. Full compatibility." },
  { brand:"DIY", model:"Teensy + grblHAL", firmware:"grblhal", controller:"grblHAL", compatLevel:"full", notes:"grblHAL firmware. Full compatibility." },
  { brand:"DIY", model:"ESP32 + FluidNC", firmware:"fluidnc", controller:"FluidNC", compatLevel:"full", notes:"FluidNC. Full compatibility." },

  // ── xTool ──
  { brand:"xTool", model:"D1", firmware:"grbl", controller:"GRBL-based", compatLevel:"full", notes:"GRBL-based controller. Primarily a laser but CNC capable. Full compatibility in CNC mode." },
  { brand:"xTool", model:"D1 Pro", firmware:"grbl", controller:"GRBL-based", compatLevel:"full", notes:"GRBL-based. Full compatibility in CNC mode." },

  // ── CNC CONTROLLERS (generic) ──
  { brand:"Various", model:"Any machine with GRBL ≤1.1", firmware:"grbl", controller:"GRBL ≤1.1", compatLevel:"full", notes:"GRBL is fully supported. Full CAD, CAM, and Control." },
  { brand:"Various", model:"Any machine with grblHAL", firmware:"grblhal", controller:"grblHAL", compatLevel:"full", notes:"grblHAL is fully supported. Full CAD, CAM, and Control." },
  { brand:"Various", model:"Any machine with GRBL-STM", firmware:"grblstm", controller:"GRBL-STM", compatLevel:"full", notes:"GRBL-STM is fully supported. Full compatibility." },
  { brand:"Various", model:"Any machine with FluidNC", firmware:"fluidnc", controller:"FluidNC", compatLevel:"full", notes:"FluidNC is fully supported. Full CAD, CAM, and Control." },
  { brand:"Various", model:"Any machine with Smoothieware", firmware:"smoothieware", controller:"Smoothieware", compatLevel:"full", notes:"Smoothieware support is a Labs feature (testing). Full CAD, CAM, and Control." },
  { brand:"Various", model:"Any machine with Mach3", firmware:"mach", controller:"Mach3", compatLevel:"cam", notes:"CAM Only. Export GCode and transfer to your machine." },
  { brand:"Various", model:"Any machine with Mach4", firmware:"mach", controller:"Mach4", compatLevel:"cam", notes:"CAM Only. Export GCode and transfer." },
  { brand:"Various", model:"Any machine with LinuxCNC", firmware:"linuxcnc", controller:"LinuxCNC", compatLevel:"cam", notes:"CAM Only. Export GCode and transfer." },
  { brand:"Various", model:"Any machine with UCCNC", firmware:"uccnc", controller:"UCCNC", compatLevel:"cam", notes:"CAM Only. Export GCode and transfer." },
  { brand:"Various", model:"Any machine with Duet / RRF", firmware:"duet", controller:"Duet / RepRapFirmware", compatLevel:"cam", notes:"CAM Only. Export GCode and transfer." },
  { brand:"Various", model:"Any machine with Masso controller", firmware:"masso", controller:"Masso", compatLevel:"cam", notes:"CAM Only. Export GCode and transfer." },
  { brand:"Various", model:"Any machine with Woodpecker board", firmware:"grbl", controller:"GRBL (Woodpecker CNC board)", compatLevel:"full", notes:"Woodpecker boards run GRBL. Full compatibility." },
  { brand:"Various", model:"Any machine with xPRO V5 controller", firmware:"fluidnc", controller:"FluidNC (Spark Concepts xPRO V5)", compatLevel:"full", notes:"xPRO V5 runs FluidNC. Full compatibility." },

  // ── GRIZZLY ──
  { brand:"Grizzly", model:"G0704 (CNC converted)", firmware:"varies", controller:"Typically Mach3 or LinuxCNC after conversion", compatLevel:"cam", notes:"Common CNC conversion uses Mach3 or LinuxCNC. CAM Only." },
  { brand:"Grizzly", model:"G0876", firmware:"other_builtin", controller:"Proprietary DSP", compatLevel:"unlikely", notes:"Proprietary DSP controller. Not compatible." },

  // ── POWERMATIC ──
  { brand:"Powermatic", model:"PM-2x4SPK", firmware:"other_builtin", controller:"Proprietary", compatLevel:"unlikely", notes:"Proprietary controller. Not compatible." },

  // ── SHAPER ──
  { brand:"Shaper", model:"Origin", firmware:"other_builtin", controller:"Shaper proprietary (handheld CNC)", compatLevel:"unlikely", notes:"Completely different paradigm — handheld CNC with proprietary system. Not compatible." },
  { brand:"Shaper", model:"Origin Plus", firmware:"other_builtin", controller:"Shaper proprietary", compatLevel:"unlikely", notes:"Proprietary system. Not compatible." },

  // ── TORMACH ──
  { brand:"Tormach", model:"PCNC 440", firmware:"other_builtin", controller:"PathPilot (LinuxCNC-based)", compatLevel:"cam", notes:"PathPilot is LinuxCNC-based. MillMage can generate GCode (CAM Only) but cannot directly control." },
  { brand:"Tormach", model:"PCNC 770", firmware:"other_builtin", controller:"PathPilot (LinuxCNC-based)", compatLevel:"cam", notes:"PathPilot/LinuxCNC. CAM Only." },
  { brand:"Tormach", model:"PCNC 1100", firmware:"other_builtin", controller:"PathPilot (LinuxCNC-based)", compatLevel:"cam", notes:"PathPilot/LinuxCNC. CAM Only." },
  { brand:"Tormach", model:"24R", firmware:"other_builtin", controller:"PathPilot (LinuxCNC-based)", compatLevel:"cam", notes:"PathPilot/LinuxCNC. CAM Only." },

  // ── CNC Router Table brands ──
  { brand:"Legacy", model:"Maverick", firmware:"other_builtin", controller:"Proprietary", compatLevel:"unlikely", notes:"Proprietary controller. Not compatible." },
  { brand:"Probotix", model:"Nebula", firmware:"linuxcnc", controller:"LinuxCNC", compatLevel:"cam", notes:"Runs LinuxCNC. CAM Only." },
  { brand:"Probotix", model:"Comet", firmware:"linuxcnc", controller:"LinuxCNC", compatLevel:"cam", notes:"Runs LinuxCNC. CAM Only." },
  { brand:"Probotix", model:"Fireball V90", firmware:"linuxcnc", controller:"LinuxCNC", compatLevel:"cam", notes:"Runs LinuxCNC. CAM Only." },

  // ── ADDITIONAL POPULAR MODELS ──
  { brand:"Comgrow", model:"ROBO CNC", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Comgrow", model:"Z1", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Genmitsu", model:"PROVerXL 4030 V2", firmware:"grbl", controller:"GRBL (customized)", compatLevel:"full", notes:"Customized GRBL. Full compatibility." },
  { brand:"EleksMaker", model:"EleksMill", firmware:"grbl", controller:"GRBL (Mana board)", compatLevel:"full", notes:"Runs GRBL on Mana board. Full compatibility." },
  { brand:"Shapeoko", model:"Shapeoko 1 (Original)", firmware:"grbl", controller:"GRBL 0.8/0.9 (Arduino + GShield)", compatLevel:"full", notes:"Very old GRBL — may need firmware update for best results." },

  // ── CHINESE INDUSTRIAL MACHINES (DSP / NC Studio) ──
  { brand:"Various (Chinese)", model:"Machine with NC Studio controller", firmware:"other_builtin", controller:"NC Studio / Weihong", compatLevel:"unlikely", notes:"NC Studio/Weihong is a proprietary Chinese DSP controller. Not compatible with MillMage." },
  { brand:"Various (Chinese)", model:"Machine with DSP A11/A15/A18 controller", firmware:"other_builtin", controller:"RichAuto DSP", compatLevel:"cam", notes:"RichAuto DSP controller. CAM Only — use LinuxCNC flavor. Requires metric units. Needs to be manually set to accept feed and speed commands from G-Code in the controller." },
  { brand:"Various (Chinese)", model:"Machine with DSP 0501 controller", firmware:"other_builtin", controller:"DSP 0501 (DDCSV)", compatLevel:"cam", notes:"DDCS-based controller. CAM Only — use LinuxCNC G-Code flavor." },

  // ── ADDITIONAL BRANDS (Popular search queries) ──
  { brand:"Donek Tools", model:"Drag Knife CNC", firmware:"grbl", controller:"GRBL (typically on Shapeoko/X-Carve)", compatLevel:"full", notes:"If running on a GRBL machine, full compatibility." },
  { brand:"Longmill", model:"Benchtop CNC", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"Same as Sienci LongMill. GRBL firmware." },
  { brand:"WorkBee", model:"CNC Router Kit", firmware:"grbl", controller:"GRBL (BlackBox / xPRO)", compatLevel:"full", notes:"GRBL or FluidNC. Full compatibility." },
  { brand:"QueenBee", model:"CNC Router Kit", firmware:"grbl", controller:"GRBL / FluidNC", compatLevel:"full", notes:"GRBL or FluidNC. Full compatibility." },

  // ══════════════════════════════════════════════════════════
  // AMAZON & ALIEXPRESS BUDGET CNC ROUTERS
  // ══════════════════════════════════════════════════════════

  // ── LUNYEE (Amazon) ──
  { brand:"LUNYEE", model:"3018 PRO MAX (500W)", firmware:"grbl", controller:"GRBL (offline controller)", compatLevel:"full", notes:"All-metal 500W build with GRBL offline control. Full compatibility." },
  { brand:"LUNYEE", model:"3018 PRO", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"LUNYEE", model:"3018 PRO Ultra", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"LUNYEE", model:"4040 PRO", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"Larger 400x400mm GRBL machine. Full compatibility." },
  { brand:"LUNYEE", model:"CNC 3020", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },

  // ── CNCTOPBAOS (Amazon) ──
  { brand:"CNCTOPBAOS", model:"3018-PRO", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"CNCTOPBAOS", model:"3018-PRO-MAX", firmware:"grbl", controller:"GRBL (offline controller)", compatLevel:"full", notes:"GRBL with offline controller. Full compatibility." },
  { brand:"CNCTOPBAOS", model:"1610 PRO", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"Compact 160x100mm GRBL machine. Full compatibility." },
  { brand:"CNCTOPBAOS", model:"3018 Pro 2-in-1 (with laser)", firmware:"grbl", controller:"GRBL (offline controller)", compatLevel:"full", notes:"GRBL firmware with dual spindle/laser. Full compatibility." },
  { brand:"CNCTOPBAOS", model:"CNC 3018", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },

  // ── RATTMMOTOR (Amazon) ──
  { brand:"RATTMMOTOR", model:"3018-PRO", firmware:"grbl", controller:"GRBL (upgraded control board)", compatLevel:"full", notes:"GRBL with upgraded board and emergency stop. Full compatibility." },
  { brand:"RATTMMOTOR", model:"CNC 3018 DIY Kit", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"RATTMMOTOR", model:"3018 PRO MAX", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"RATTMMOTOR", model:"CNC 1610", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },

  // ── MYSWEETY (Amazon) ──
  { brand:"MYSWEETY", model:"CNC 3020 PLUS (500W)", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"500W spindle with GRBL control. Full compatibility." },
  { brand:"MYSWEETY", model:"CNC 3018 PRO", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"MYSWEETY", model:"CNC 3018", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"MYSWEETY", model:"CNC 1610 PRO", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },

  // ── AnoleX (Amazon) ──
  { brand:"AnoleX", model:"4030-Evo Ultra 2", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"All-metal with 800W trim router. GRBL control. Full compatibility." },
  { brand:"AnoleX", model:"4030-Evo", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"AnoleX", model:"3020 PRO", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },

  // ── NymoLabs (Amazon) ──
  { brand:"NymoLabs", model:"NBS-6040", firmware:"grbl", controller:"GRBL v1.1 (TFT touchscreen)", compatLevel:"full", notes:"Open-source GRBL v1.1 with touchscreen. Full compatibility." },
  { brand:"NymoLabs", model:"NBS-3020", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },

  // ── Genmitsu (additional Amazon models) ──
  { brand:"Genmitsu", model:"3020-PRO Ultra (710W)", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"710W spindle, all-metal. GRBL control. Full compatibility." },
  { brand:"Genmitsu", model:"4040-PRO MAX (710W trimmer)", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"710W trimmer with linear rails. GRBL. Full compatibility." },
  { brand:"Genmitsu", model:"4040 Reno", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"Belt-driven GRBL machine. Full compatibility." },
  { brand:"Genmitsu", model:"Cubiko", firmware:"grbl", controller:"GRBL (WiFi + APP supported)", compatLevel:"full", notes:"Smart desktop CNC with WiFi. GRBL-based. Full compatibility." },
  { brand:"Genmitsu", model:"3040 (Y-axis extension of 3018)", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"Extended 3018 with GRBL. Full compatibility." },
  { brand:"Genmitsu", model:"5040 CNC Router", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },

  // ── FoxAlien (additional Amazon models) ──
  { brand:"FoxAlien", model:"Masuter 3S", firmware:"grbl", controller:"GRBL (NEMA 23 closed-loop)", compatLevel:"full", notes:"Closed-loop steppers with GRBL. Full compatibility." },
  { brand:"FoxAlien", model:"XE-Ultra 8080", firmware:"grbl", controller:"GRBL (NEMA 23 closed-loop)", compatLevel:"full", notes:"Large 800x800mm with GRBL. Full compatibility." },
  { brand:"FoxAlien", model:"CNC 4040-XE", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"FoxAlien", model:"Masuter S", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },

  // ── VEVOR (Amazon) ──
  { brand:"VEVOR", model:"CNC 3018 (300W)", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"Budget 300W GRBL machine. Full compatibility." },
  { brand:"VEVOR", model:"CNC 3020", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"VEVOR", model:"CNC 4040", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"VEVOR", model:"CNC 3040 (800W)", firmware:"varies", controller:"Mach3 or GRBL (varies by listing)", compatLevel:"depends", notes:"Check which controller shipped with yours. Mach3 = CAM Only, GRBL = Full." },
  { brand:"VEVOR", model:"CNC 6040 (1500W)", firmware:"mach", controller:"Mach3 (USB)", compatLevel:"cam", notes:"Larger VEVOR machines typically use Mach3. CAM Only." },
  { brand:"VEVOR", model:"CNC 6040 (2200W)", firmware:"mach", controller:"Mach3 (USB)", compatLevel:"cam", notes:"Mach3 control. CAM Only." },

  // ── Cenoz (Amazon) ──
  { brand:"Cenoz", model:"Upgrade 3018 Pro", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL with integrated driver chip. Full compatibility." },
  { brand:"Cenoz", model:"CNC 3018 Pro MAX", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },

  // ── IKRANBIRD (Amazon) ──
  { brand:"IKRANBIRD", model:"3018 PRO", firmware:"grbl", controller:"GRBL 1.1f", compatLevel:"full", notes:"GRBL 1.1f control board. Full compatibility." },
  { brand:"IKRANBIRD", model:"3018 PRO MAX", firmware:"grbl", controller:"GRBL 1.1f", compatLevel:"full", notes:"GRBL 1.1f. Full compatibility." },

  // ── Beautystar (Amazon/AliExpress) ──
  { brand:"Beautystar", model:"CNC 3018 Pro", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Beautystar", model:"CNC 3018 Pro MAX", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },

  // ── HUANYANG / CNC brand (AliExpress popular) ──
  { brand:"HUANYANG", model:"CNC 3040 (800W)", firmware:"mach", controller:"Mach3 (parallel port/USB)", compatLevel:"cam", notes:"Chinese 3040 with Mach3. CAM Only." },
  { brand:"HUANYANG", model:"CNC 6040 (1500W)", firmware:"mach", controller:"Mach3", compatLevel:"cam", notes:"Mach3 control. CAM Only." },
  { brand:"HUANYANG", model:"CNC 6040 (2200W)", firmware:"mach", controller:"Mach3", compatLevel:"cam", notes:"Mach3 control. CAM Only." },

  // ── Chinese Generic Mach3 Machines (AliExpress / eBay) ──
  { brand:"Generic (Chinese)", model:"CNC 3040T (4-axis)", firmware:"mach", controller:"Mach3 (USB/parallel)", compatLevel:"cam", notes:"Most 3040T 4-axis machines use Mach3. CAM Only." },
  { brand:"Generic (Chinese)", model:"CNC 3040Z (3-axis)", firmware:"mach", controller:"Mach3", compatLevel:"cam", notes:"Mach3 control. CAM Only." },
  { brand:"Generic (Chinese)", model:"CNC 6040 (3-axis, USB)", firmware:"mach", controller:"Mach3 (USB adapter)", compatLevel:"cam", notes:"Mach3 USB. CAM Only." },
  { brand:"Generic (Chinese)", model:"CNC 6040 (4-axis)", firmware:"mach", controller:"Mach3", compatLevel:"cam", notes:"Mach3 control. CAM Only." },
  { brand:"Generic (Chinese)", model:"CNC 6090 (3-axis)", firmware:"mach", controller:"Mach3 or DSP", compatLevel:"cam", notes:"Usually Mach3 or DSP. CAM Only if Mach3. Not compatible if DSP." },
  { brand:"Generic (Chinese)", model:"CNC 6090 (4-axis, 2.2kW)", firmware:"mach", controller:"Mach3", compatLevel:"cam", notes:"Mach3 control. CAM Only." },
  { brand:"Generic (Chinese)", model:"CNC 3020T", firmware:"mach", controller:"Mach3 (parallel)", compatLevel:"cam", notes:"Older Mach3 parallel port design. CAM Only." },
  { brand:"Generic (Chinese)", model:"CNC 1325 (4x8 industrial)", firmware:"other_builtin", controller:"DSP / NC Studio / Weihong", compatLevel:"unlikely", notes:"Chinese industrial 4x8 machines typically use NC Studio or DSP. Not compatible." },
  { brand:"Generic (Chinese)", model:"CNC 1530 (5x10 industrial)", firmware:"other_builtin", controller:"DSP / NC Studio", compatLevel:"unlikely", notes:"Industrial DSP controller. Not compatible." },

  // ── Carvera (Amazon) ──
  { brand:"Makera", model:"Carvera", firmware:"grbl", controller:"GRBL-based (custom)", compatLevel:"full", notes:"GRBL-based with auto tool change. Full compatibility." },
  { brand:"Makera", model:"Carvera Air", firmware:"grbl", controller:"GRBL-based (custom)", compatLevel:"full", notes:"Compact GRBL-based CNC. Full compatibility." },

  // ── SainSmart (additional Amazon models) ──
  { brand:"SainSmart", model:"Genmitsu 3018-PROVer Mach3", firmware:"grbl", controller:"GRBL (Mach3 compatible GCode)", compatLevel:"full", notes:"Despite name, this is GRBL-controlled. Full compatibility." },

  // ── Preenex (Amazon) ──
  { brand:"Preenex", model:"CNC 3018 PRO", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Preenex", model:"CNC 3018", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },

  // ── TOPQSC (Amazon) ──
  { brand:"TOPQSC", model:"CNC 3018 PRO", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },

  // ── BricoLoco / Newker (AliExpress) ──
  { brand:"Newker", model:"CNC 3040 (GRBL version)", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL version of 3040. Full compatibility." },
  { brand:"Newker", model:"CNC 3040 (Mach3 version)", firmware:"mach", controller:"Mach3", compatLevel:"cam", notes:"Mach3 version. CAM Only." },

  // ── CNC USB Controller Machines (AliExpress generic) ──
  { brand:"Generic (AliExpress)", model:"CNC 3018 with Woodpecker board", firmware:"grbl", controller:"GRBL (Woodpecker 3.4)", compatLevel:"full", notes:"Woodpecker boards run GRBL. Full compatibility." },
  { brand:"Generic (AliExpress)", model:"CNC 3018 PRO with offline controller", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Generic (AliExpress)", model:"CNC 2418 PRO", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Generic (AliExpress)", model:"CNC 1610 PRO", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Generic (AliExpress)", model:"CNC 5040 (GRBL version)", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL version. Full compatibility." },
  { brand:"Generic (AliExpress)", model:"CNC 4030 (GRBL version)", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL version. Full compatibility." },
  { brand:"Generic (AliExpress)", model:"Mini CNC 1208", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"Small GRBL machine. Full compatibility." },
  { brand:"Generic (AliExpress)", model:"Mini CNC 2417", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"Small GRBL machine. Full compatibility." },

  // ── OmniGrbl / ESP32-based (AliExpress) ──
  { brand:"Various (AliExpress)", model:"CNC with ESP32 FluidNC board", firmware:"fluidnc", controller:"FluidNC (ESP32)", compatLevel:"full", notes:"FluidNC is fully supported. Full compatibility." },
  { brand:"Various (AliExpress)", model:"CNC with MKS DLC32 board", firmware:"grbl", controller:"GRBL (ESP32-based)", compatLevel:"full", notes:"GRBL on ESP32. Full compatibility." },
  { brand:"Various (AliExpress)", model:"CNC with CNC Shield V3 + Arduino Uno", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"Standard GRBL setup. Full compatibility." },
  { brand:"Various (AliExpress)", model:"CNC with CNC Shield V4 + Nano", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"Standard GRBL setup. Full compatibility." },

  // ── Zhong Hua Jiang (AliExpress industrial) ──
  { brand:"Zhong Hua Jiang", model:"CNC 6040 (air-cooled spindle)", firmware:"mach", controller:"Mach3", compatLevel:"cam", notes:"Mach3 control. CAM Only." },
  { brand:"Zhong Hua Jiang", model:"CNC 6090 (water-cooled 2.2kW)", firmware:"mach", controller:"Mach3", compatLevel:"cam", notes:"Mach3 control. CAM Only." },

  // ── TwoTrees (additional Amazon/AliExpress) ──
  { brand:"Two Trees", model:"TTC 3018 Pro Max", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Two Trees", model:"TTC 4040", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },

  // ── CNC 4040 PRO (generic Amazon brand) ──
  { brand:"Generic (Amazon)", model:"CNC 4040 PRO (500W, steel frame)", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL with steel HSS frame. Full compatibility." },
  { brand:"Generic (Amazon)", model:"CNC 4040 PRO (100W desktop)", firmware:"grbl", controller:"GRBL (USB)", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Generic (Amazon)", model:"CNC 3018 (any brand, GRBL)", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"Nearly all 3018 machines sold on Amazon/AliExpress use GRBL. Full compatibility." },
  { brand:"Generic (Amazon)", model:"CNC 1610 (any brand, GRBL)", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"Nearly all 1610 machines use GRBL. Full compatibility." },
  { brand:"Generic (Amazon)", model:"CNC 2418 (any brand, GRBL)", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"Nearly all 2418 machines use GRBL. Full compatibility." },

  // ── Carveco / CAM software bundled machines ──
  { brand:"SainSmart", model:"Genmitsu CNC 3018 (Carveco Maker bundle)", firmware:"grbl", controller:"GRBL (with Carveco Maker CAM)", compatLevel:"full", notes:"GRBL firmware with bundled Carveco CAM software. Full compatibility." },

  // ── Ortur / Aufero (laser+CNC combos on Amazon) ──
  { brand:"Ortur", model:"Aufero CNC (Laser Frame 2)", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility in CNC mode." },

  // ── Totem / Twotrees (AliExpress laser+CNC) ──
  { brand:"Totem", model:"CNC 3018 S1", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },

  // ── Sovol (Amazon/AliExpress) ──
  { brand:"Sovol", model:"SO-3", firmware:"grbl", controller:"GRBL-based", compatLevel:"full", notes:"GRBL-based. Full compatibility." },

  // ── Longer (Amazon) ──
  { brand:"Longer", model:"CNC Router Kit", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },

  // ── CRONOS / CNC brand (AliExpress) ──
  { brand:"CRONOS", model:"CNC 3018 PRO", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"CRONOS", model:"CNC 3040", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL version. Full compatibility." },

  // ── YOFULY (AliExpress) ──
  { brand:"YOFULY", model:"CNC 3018 PRO MAX", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"YOFULY", model:"CNC 3018 PRO", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },

  // ── Sain Smart Genmitsu additional entry level ──
  { brand:"SainSmart", model:"Genmitsu CNC 3018 (Original)", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"Original 3018 with GRBL. Full compatibility." },
];

const CC = {
  full:{label:"Full Compatibility",tag:"CAD + CAM + Control",color:"#059669",bg:"#ecfdf5",bdr:"#a7f3d0",icon:"✓",sum:"MillMage can design, generate toolpaths, and directly connect to and control your machine."},
  cam:{label:"CAM Only",tag:"CAM Only",color:"#d97706",bg:"#fffbeb",bdr:"#fde68a",icon:"◐",sum:"MillMage can design and generate GCode for your machine, but cannot directly connect to or control it. You'll export GCode and transfer it separately."},
  maybe:{label:"Limited / Unverified",tag:"Limited",color:"#7c3aed",bg:"#f5f3ff",bdr:"#ddd6fe",icon:"?",sum:"This machine uses a proprietary or non-standard controller. Compatibility is limited or not yet verified by the MillMage team."},
  depends:{label:"Depends on Controller",tag:"Varies",color:"#2563eb",bg:"#eff6ff",bdr:"#bfdbfe",icon:"⚙",sum:"Compatibility depends on which controller/firmware is installed on your specific machine. Check your firmware against the supported list."},
  unlikely:{label:"Not Compatible",tag:"Not Compatible",color:"#dc2626",bg:"#fef2f2",bdr:"#fecaca",icon:"✗",sum:"This machine uses proprietary control software that MillMage cannot interface with."},
};

function norm(s){return s.toLowerCase().replace(/[^a-z0-9]/g,"")}

function score(q,m){
  const qn=norm(q), bn=norm(m.brand), mn=norm(m.model), cn=norm(m.controller);
  const all=bn+" "+mn+" "+cn;
  if(!qn)return 0;
  if(mn===qn)return 100;
  if(mn.startsWith(qn))return 90;
  if((bn+mn).includes(qn))return 80;
  if(all.replace(/\s/g,"").includes(qn))return 70;
  const ws=q.toLowerCase().split(/\s+/).filter(w=>w.length>1);
  if(!ws.length)return 0;
  const hits=ws.filter(w=>all.includes(norm(w)));
  if(hits.length===ws.length)return 60;
  if(hits.length>0)return 30+(hits.length/ws.length)*25;
  return 0;
}

const TAB_SEARCH=0, TAB_TABLE=1;

export default function App(){
  const [query,setQuery]=useState("");
  const [sel,setSel]=useState(null);
  const [tab,setTab]=useState(TAB_SEARCH);
  const [fwHelp,setFwHelp]=useState(false);
  const [tblFilter,setTblFilter]=useState("");
  const [tblCompat,setTblCompat]=useState("all");
  const ref=useRef(null);

  const results=useMemo(()=>{
    if(query.trim().length<2)return[];
    return MACHINES.map(m=>({...m,sc:score(query,m)})).filter(m=>m.sc>25).sort((a,b)=>b.sc-a.sc).slice(0,10);
  },[query]);

  const filteredTable=useMemo(()=>{
    let list=MACHINES;
    if(tblFilter.trim().length>=2){
      list=list.filter(m=>score(tblFilter,m)>20);
    }
    if(tblCompat!=="all"){
      list=list.filter(m=>m.compatLevel===tblCompat);
    }
    return list;
  },[tblFilter,tblCompat]);

  const handleSelect=(m)=>{setSel(m);setQuery("");};
  const handleReset=()=>{setSel(null);setQuery("");setTimeout(()=>ref.current?.focus(),100);};
  const c=sel?CC[sel.compatLevel]:null;

  const TabBtn=({v,label})=>(
    <button onClick={()=>setTab(v)} style={{
      flex:1,padding:"10px 0",fontSize:13,fontWeight:600,cursor:"pointer",border:"none",
      borderBottom:tab===v?"2px solid #6366f1":"2px solid transparent",
      background:"transparent",color:tab===v?"#6366f1":"#6b7280",transition:"all .15s"
    }}>{label}</button>
  );

  return(
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",maxWidth:900,margin:"0 auto",padding:"20px 16px"}}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <h1 style={{fontSize:22,fontWeight:700,color:"#111827",margin:"0 0 4px"}}>Is my CNC compatible with MillMage?</h1>
        <p style={{fontSize:14,color:"#6b7280",margin:0}}>Search {MACHINES.length} machines or browse the full database.</p>
      </div>

      <div style={{display:"flex",borderBottom:"1px solid #e5e7eb",marginBottom:20}}>
        <TabBtn v={TAB_SEARCH} label="🔍 Search"/>
        <TabBtn v={TAB_TABLE} label="📋 Full Machine Database"/>
      </div>

      {tab===TAB_SEARCH&&(
        <>
          {sel?(
            <div style={{animation:"fadeIn .25s ease"}}>
              <div style={{background:c.bg,border:`2px solid ${c.bdr}`,borderRadius:12,padding:"20px 24px",marginBottom:16}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                  <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:36,height:36,borderRadius:"50%",background:c.color,color:"#fff",fontSize:20,fontWeight:700}}>{c.icon}</span>
                  <div>
                    <div style={{fontSize:17,fontWeight:700,color:"#111827"}}>{sel.brand} {sel.model}</div>
                    <span style={{display:"inline-block",fontSize:12,fontWeight:600,color:c.color,background:"#fff",border:`1px solid ${c.bdr}`,borderRadius:20,padding:"2px 10px",marginTop:2}}>{c.tag}</span>
                  </div>
                </div>
                <p style={{fontSize:14,color:"#374151",lineHeight:1.6,margin:"0 0 12px"}}>{c.sum}</p>
                <div style={{background:"rgba(255,255,255,0.7)",borderRadius:8,padding:"12px 14px",fontSize:13,color:"#4b5563",lineHeight:1.55}}>
                  <strong style={{color:"#111827"}}>Controller:</strong> {sel.controller}<br/>
                  <span style={{color:"#6b7280"}}>{sel.notes}</span>
                </div>
              </div>
              {sel.compatLevel==="full"&&<div style={{background:"#f0fdf4",borderRadius:8,padding:"12px 16px",fontSize:13,color:"#166534",marginBottom:16,lineHeight:1.5}}><strong>Ready to go!</strong> Download the <a href="https://lightburnsoftware.com/products/millmage-core" target="_blank" rel="noopener" style={{color:"#059669"}}>30-day free trial</a> to verify with your setup, then purchase when ready.</div>}
              {sel.compatLevel==="cam"&&<div style={{background:"#fffbeb",borderRadius:8,padding:"12px 16px",fontSize:13,color:"#92400e",marginBottom:16,lineHeight:1.5}}><strong>You can still use MillMage!</strong> Design your projects and export GCode, then transfer it to your machine via your existing control software, SD card, or USB drive.</div>}
              {(sel.compatLevel==="maybe"||sel.compatLevel==="depends")&&<div style={{background:"#f5f3ff",borderRadius:8,padding:"12px 16px",fontSize:13,color:"#5b21b6",marginBottom:16,lineHeight:1.5}}><strong>Not sure?</strong> Try the <a href="https://lightburnsoftware.com/products/millmage-core" target="_blank" rel="noopener" style={{color:"#7c3aed"}}>30-day free trial</a> to test. You can also check the <a href="https://forum.lightburnsoftware.com/c/millmage-hardware-compatibility/65" target="_blank" rel="noopener" style={{color:"#7c3aed"}}>Hardware Compatibility forum</a>.</div>}
              {sel.compatLevel==="unlikely"&&<div style={{background:"#fef2f2",borderRadius:8,padding:"12px 16px",fontSize:13,color:"#991b1b",marginBottom:16,lineHeight:1.5}}>This machine's proprietary system isn't supported. If you've upgraded the controller to a GRBL/grblHAL/FluidNC board, search again by your new controller type.</div>}
              <button onClick={handleReset} style={{display:"block",width:"100%",padding:"12px",background:"#fff",border:"1px solid #d1d5db",borderRadius:8,fontSize:14,fontWeight:500,color:"#374151",cursor:"pointer"}} onMouseEnter={e=>e.target.style.background="#f9fafb"} onMouseLeave={e=>e.target.style.background="#fff"}>← Check another machine</button>
            </div>
          ):(
            <>
              <div style={{position:"relative",marginBottom:results.length>0?0:16}}>
                <div style={{display:"flex",alignItems:"center",border:"2px solid "+(query.length>0?"#6366f1":"#d1d5db"),borderRadius:results.length>0?"10px 10px 0 0":"10px",padding:"0 14px",background:"#fff",transition:"border-color .15s"}}>
                  <span style={{fontSize:18,color:"#9ca3af",marginRight:10}}>🔍</span>
                  <input ref={ref} type="text" value={query} onChange={e=>setQuery(e.target.value)} placeholder='e.g. "Shapeoko 5", "X-Carve", "Onefinity Elite", "GRBL"' style={{flex:1,border:"none",outline:"none",padding:"14px 0",fontSize:15,color:"#111827",background:"transparent"}}/>
                  {query&&<button onClick={()=>{setQuery("");ref.current?.focus();}} style={{background:"none",border:"none",fontSize:18,color:"#9ca3af",cursor:"pointer",padding:"4px"}}>×</button>}
                </div>
              </div>
              {results.length>0&&(
                <div style={{border:"2px solid #6366f1",borderTop:"1px solid #e5e7eb",borderRadius:"0 0 10px 10px",background:"#fff",overflow:"hidden",marginBottom:16,maxHeight:420,overflowY:"auto"}}>
                  {results.map((m,i)=>{const cc=CC[m.compatLevel];return(
                    <button key={i} onClick={()=>handleSelect(m)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"12px 16px",background:"transparent",border:"none",borderBottom:i<results.length-1?"1px solid #f3f4f6":"none",cursor:"pointer",textAlign:"left"}} onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <div><div style={{fontSize:14,fontWeight:600,color:"#111827"}}>{m.brand} {m.model}</div><div style={{fontSize:12,color:"#6b7280",marginTop:1}}>{m.controller}</div></div>
                      <span style={{fontSize:11,fontWeight:600,color:cc.color,background:cc.bg,border:`1px solid ${cc.bdr}`,borderRadius:20,padding:"3px 10px",whiteSpace:"nowrap",flexShrink:0}}>{cc.tag}</span>
                    </button>
                  );})}
                </div>
              )}
              {query.trim().length>=2&&results.length===0&&(
                <div style={{border:"2px solid #6366f1",borderTop:"1px solid #e5e7eb",borderRadius:"0 0 10px 10px",background:"#fff",padding:"20px 16px",textAlign:"center",marginBottom:16}}>
                  <p style={{fontSize:14,color:"#6b7280",margin:"0 0 6px"}}>No match for <strong>"{query}"</strong></p>
                  <p style={{fontSize:13,color:"#9ca3af",margin:0}}>Try searching by brand, model, or firmware (e.g. "GRBL", "Mach4", "LinuxCNC"). You can also browse the Full Machine Database tab.</p>
                </div>
              )}
              <button onClick={()=>setFwHelp(!fwHelp)} style={{background:"none",border:"none",color:"#6366f1",fontSize:14,fontWeight:500,cursor:"pointer",padding:0,textDecoration:"underline",textUnderlineOffset:2,marginBottom:12,display:"block"}}>{fwHelp?"Hide firmware info ↑":"Don't know your firmware? See what MillMage supports ↓"}</button>
              {fwHelp&&(
                <div style={{marginBottom:16,background:"#f9fafb",borderRadius:10,padding:"16px 20px",border:"1px solid #e5e7eb"}}>
                  <p style={{fontSize:13,color:"#374151",margin:"0 0 12px",lineHeight:1.5}}>MillMage compatibility depends on the <strong>firmware / controller</strong> your CNC runs. Here's what's supported:</p>
                  <div style={{marginBottom:10}}><div style={{fontSize:13,fontWeight:700,color:"#059669",marginBottom:3}}>✓ Full Support (CAD + CAM + Control)</div><div style={{fontSize:13,color:"#374151",lineHeight:1.6}}>GRBL ≤1.1 · grblHAL · GRBL-STM · FluidNC · Smoothieware (Labs)</div></div>
                  <div style={{marginBottom:10}}><div style={{fontSize:13,fontWeight:700,color:"#d97706",marginBottom:3}}>◐ CAM Only (GCode export, no direct control)</div><div style={{fontSize:13,color:"#374151",lineHeight:1.6}}>Mach3 / Mach4 · LinuxCNC · UCCNC · Duet / RRF · Masso</div></div>
                  <p style={{fontSize:12,color:"#6b7280",margin:"8px 0 0",lineHeight:1.5}}>Not sure what firmware your CNC runs? Check with your manufacturer or try the <a href="https://lightburnsoftware.com/products/millmage-core" target="_blank" rel="noopener" style={{color:"#6366f1"}}>30-day free trial</a>.</p>
                </div>
              )}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div style={{background:"#ecfdf5",borderRadius:8,padding:"14px 16px",border:"1px solid #a7f3d0"}}><div style={{fontSize:12,fontWeight:700,color:"#059669",marginBottom:6}}>✓ FULL CONTROL</div><div style={{fontSize:12,color:"#374151",lineHeight:1.6}}>GRBL · grblHAL · FluidNC · Smoothieware</div></div>
                <div style={{background:"#fffbeb",borderRadius:8,padding:"14px 16px",border:"1px solid #fde68a"}}><div style={{fontSize:12,fontWeight:700,color:"#d97706",marginBottom:6}}>◐ CAM ONLY</div><div style={{fontSize:12,color:"#374151",lineHeight:1.6}}>Mach3/4 · LinuxCNC · UCCNC · Duet · Masso</div></div>
              </div>
            </>
          )}
        </>
      )}

      {tab===TAB_TABLE&&(
        <div>
          <p style={{fontSize:13,color:"#6b7280",margin:"0 0 12px",lineHeight:1.5}}>
            This is the complete machine database ({MACHINES.length} entries). Use the filters below to narrow results. To edit this data, modify the <code style={{background:"#f3f4f6",padding:"1px 5px",borderRadius:4,fontSize:12}}>MACHINES</code> array in the source code.
          </p>
          <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
            <input type="text" value={tblFilter} onChange={e=>setTblFilter(e.target.value)} placeholder="Filter by brand, model, or controller..." style={{flex:1,minWidth:200,border:"1px solid #d1d5db",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none"}}/>
            <select value={tblCompat} onChange={e=>setTblCompat(e.target.value)} style={{border:"1px solid #d1d5db",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none",background:"#fff",cursor:"pointer"}}>
              <option value="all">All ({MACHINES.length})</option>
              <option value="full">✓ Full ({MACHINES.filter(m=>m.compatLevel==="full").length})</option>
              <option value="cam">◐ CAM Only ({MACHINES.filter(m=>m.compatLevel==="cam").length})</option>
              <option value="maybe">? Limited ({MACHINES.filter(m=>m.compatLevel==="maybe").length})</option>
              <option value="depends">⚙ Varies ({MACHINES.filter(m=>m.compatLevel==="depends").length})</option>
              <option value="unlikely">✗ Not Compatible ({MACHINES.filter(m=>m.compatLevel==="unlikely").length})</option>
            </select>
          </div>
          <div style={{overflowX:"auto",border:"1px solid #e5e7eb",borderRadius:10}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead>
                <tr style={{background:"#f9fafb",borderBottom:"2px solid #e5e7eb"}}>
                  <th style={{padding:"10px 12px",textAlign:"left",fontWeight:600,color:"#374151",whiteSpace:"nowrap"}}>Brand</th>
                  <th style={{padding:"10px 12px",textAlign:"left",fontWeight:600,color:"#374151",whiteSpace:"nowrap"}}>Model</th>
                  <th style={{padding:"10px 12px",textAlign:"left",fontWeight:600,color:"#374151",whiteSpace:"nowrap"}}>Controller</th>
                  <th style={{padding:"10px 12px",textAlign:"left",fontWeight:600,color:"#374151",whiteSpace:"nowrap"}}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTable.length===0&&<tr><td colSpan={4} style={{padding:20,textAlign:"center",color:"#9ca3af"}}>No machines match your filter.</td></tr>}
                {filteredTable.map((m,i)=>{const cc=CC[m.compatLevel];return(
                  <tr key={i} style={{borderBottom:"1px solid #f3f4f6",cursor:"pointer"}} onClick={()=>{setSel(m);setTab(TAB_SEARCH);}} onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{padding:"8px 12px",color:"#374151",whiteSpace:"nowrap"}}>{m.brand}</td>
                    <td style={{padding:"8px 12px",color:"#111827",fontWeight:500}}>{m.model}</td>
                    <td style={{padding:"8px 12px",color:"#6b7280",maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.controller}</td>
                    <td style={{padding:"8px 12px"}}><span style={{fontSize:11,fontWeight:600,color:cc.color,background:cc.bg,border:`1px solid ${cc.bdr}`,borderRadius:20,padding:"2px 10px",whiteSpace:"nowrap"}}>{cc.tag}</span></td>
                  </tr>
                );})}
              </tbody>
            </table>
          </div>
          <p style={{fontSize:12,color:"#9ca3af",marginTop:12,lineHeight:1.5}}>Showing {filteredTable.length} of {MACHINES.length} machines. Click any row to see full details. Machine missing? Check by firmware type in the Search tab.</p>
        </div>
      )}
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}