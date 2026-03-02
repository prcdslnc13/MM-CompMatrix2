import { useState, useMemo, useRef, useCallback, useEffect } from "react";

const DEFAULT_MACHINES = [
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
  { brand:"Inventables", model:"X-Carve", firmware:"grbl", controller:"X-Controller (GRBL)", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Inventables", model:"X-Carve Pro", firmware:"grbl", controller:"X-Controller (GRBL)", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Inventables", model:"X-Carve (2021+)", firmware:"grbl", controller:"X-Controller (GRBL)", compatLevel:"full", notes:"Updated X-Carve still uses GRBL. Full compatibility." },
  { brand:"Inventables", model:"Carvey", firmware:"grbl", controller:"GRBL-based", compatLevel:"full", notes:"GRBL-based. Full compatibility." },
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
  { brand:"OpenBuilds", model:"LEAD CNC 1010", firmware:"grbl", controller:"BlackBox (GRBL)", compatLevel:"full", notes:"BlackBox controller runs GRBL. Full compatibility." },
  { brand:"OpenBuilds", model:"LEAD CNC 1515", firmware:"grbl", controller:"BlackBox (GRBL)", compatLevel:"full", notes:"BlackBox controller runs GRBL. Full compatibility." },
  { brand:"OpenBuilds", model:"LEAD CNC", firmware:"grbl", controller:"BlackBox (GRBL)", compatLevel:"full", notes:"BlackBox controller runs GRBL. Full compatibility." },
  { brand:"OpenBuilds", model:"MiniMill", firmware:"grbl", controller:"BlackBox (GRBL)", compatLevel:"full", notes:"BlackBox controller runs GRBL. Full compatibility." },
  { brand:"OpenBuilds", model:"WorkBee", firmware:"grbl", controller:"BlackBox (GRBL)", compatLevel:"full", notes:"Typically paired with BlackBox (GRBL). Full compatibility." },
  { brand:"OpenBuilds", model:"C-Beam Machine", firmware:"grbl", controller:"BlackBox / xPRO (GRBL)", compatLevel:"full", notes:"GRBL-based controller. Full compatibility." },
  { brand:"OpenBuilds", model:"Sphinx", firmware:"grbl", controller:"BlackBox (GRBL)", compatLevel:"full", notes:"GRBL-based. Full compatibility." },
  { brand:"OpenBuilds", model:"ACRO System", firmware:"grbl", controller:"BlackBox (GRBL)", compatLevel:"full", notes:"GRBL-based. Full compatibility." },
  { brand:"Onefinity", model:"Woodworker X-35", firmware:"other_builtin", controller:"Onefinity Controller (Buildbotics-based)", compatLevel:"maybe", notes:"Proprietary Buildbotics-based controller. GCode export may work via USB transfer." },
  { brand:"Onefinity", model:"Woodworker X-50", firmware:"other_builtin", controller:"Onefinity Controller (Buildbotics-based)", compatLevel:"maybe", notes:"Proprietary controller. Limited compatibility." },
  { brand:"Onefinity", model:"Machinist X-35", firmware:"other_builtin", controller:"Onefinity Controller (Buildbotics-based)", compatLevel:"maybe", notes:"Proprietary controller. Limited compatibility." },
  { brand:"Onefinity", model:"Machinist X-50", firmware:"other_builtin", controller:"Onefinity Controller (Buildbotics-based)", compatLevel:"maybe", notes:"Proprietary controller. Limited compatibility." },
  { brand:"Onefinity", model:"Journeyman X-50", firmware:"other_builtin", controller:"Onefinity Controller (Buildbotics-based)", compatLevel:"maybe", notes:"Proprietary controller. Limited compatibility." },
  { brand:"Onefinity", model:"Foreman", firmware:"other_builtin", controller:"Onefinity Controller (Buildbotics-based)", compatLevel:"maybe", notes:"Proprietary controller. Limited compatibility." },
  { brand:"Onefinity", model:"Elite Foreman", firmware:"masso", controller:"Masso G3 Controller", compatLevel:"cam", notes:"Masso controller. CAM Only." },
  { brand:"Onefinity", model:"Elite Journeyman", firmware:"masso", controller:"Masso G3 Controller", compatLevel:"cam", notes:"Masso controller. CAM Only." },
  { brand:"Onefinity", model:"Elite Woodworker", firmware:"masso", controller:"Masso G3 Controller", compatLevel:"cam", notes:"Masso controller. CAM Only." },
  { brand:"Onefinity", model:"Elite Machinist", firmware:"masso", controller:"Masso G3 Controller", compatLevel:"cam", notes:"Masso controller. CAM Only." },
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
  { brand:"BobsCNC", model:"Evolution 4", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"BobsCNC", model:"Evolution 3", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"BobsCNC", model:"KL744", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"BobsCNC", model:"KL733", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"BobsCNC", model:"Revolution", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"BobsCNC", model:"Quantum", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"BobsCNC", model:"E3", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"BobsCNC", model:"E4", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"FoxAlien", model:"Masuter", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"FoxAlien", model:"Masuter Pro", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"FoxAlien", model:"Masuter 4040-XE", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"FoxAlien", model:"Vasto", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"FoxAlien", model:"Reizer 3020", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"FoxAlien", model:"WM-3020", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Millright CNC", model:"Mega V", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Millright CNC", model:"Mega V XL", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Millright CNC", model:"Mega V XXL", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Millright CNC", model:"Carve King 2", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Millright CNC", model:"Power Route", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Millright CNC", model:"Power Route XL", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Millright CNC", model:"M3", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"YoraHome", model:"Silverback 6060", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"YoraHome", model:"Silverback 4040", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"YoraHome", model:"Mandrill 3030", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"YoraHome", model:"Mandrill 2417", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Two Trees", model:"TTC 450", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Two Trees", model:"TTC 6550", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Two Trees", model:"TTC 3018 Pro", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Generic", model:"CNC 3018", firmware:"grbl", controller:"GRBL (Arduino-based)", compatLevel:"full", notes:"Most 3018 machines run GRBL. Full compatibility." },
  { brand:"Generic", model:"CNC 3018-PRO", firmware:"grbl", controller:"GRBL (Arduino-based)", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Generic", model:"CNC 1610", firmware:"grbl", controller:"GRBL (Arduino-based)", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Generic", model:"CNC 2418", firmware:"grbl", controller:"GRBL (Arduino-based)", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Generic", model:"CNC 3040", firmware:"grbl", controller:"GRBL or Mach3 (varies)", compatLevel:"depends", notes:"Some use GRBL (full), others Mach3 (CAM Only). Check your controller." },
  { brand:"Generic", model:"CNC 6040", firmware:"varies", controller:"Mach3 or GRBL (varies)", compatLevel:"depends", notes:"Commonly Mach3. Some upgraded to GRBL. Check your controller." },
  { brand:"Generic", model:"CNC 6090", firmware:"varies", controller:"DSP / Mach3 (varies)", compatLevel:"depends", notes:"Often use DSP or Mach3. Check your specific controller." },
  { brand:"MySweety", model:"CNC 3018 PRO", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"VEVOR", model:"CNC 3018", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"VEVOR", model:"CNC 3018 PRO", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"VEVOR", model:"CNC 3040T", firmware:"varies", controller:"Mach3 or GRBL", compatLevel:"depends", notes:"Varies by version. Check your controller." },
  { brand:"Mostics", model:"CNC 3018 PRO", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"RATTMMOTOR", model:"CNC 3018 PRO", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"TopDirect", model:"CNC 3018", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Cenoz", model:"CNC 3018 PRO", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"MYSWEETY", model:"CNC Router 3018", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"MakerMade", model:"M2", firmware:"grbl", controller:"GRBL 1.1 (Arduino Due)", compatLevel:"full", notes:"GRBL 1.1 based. Full compatibility — unique chain-drive design." },
  { brand:"MakerMade", model:"Maslow CNC (M2 kit)", firmware:"grbl", controller:"GRBL 1.1 (Due Board)", compatLevel:"full", notes:"Uses GRBL 1.1 on Arduino Due. Full compatibility." },
  { brand:"Maslow CNC", model:"Maslow (Original/Classic)", firmware:"other_builtin", controller:"Maslow Mega (custom firmware)", compatLevel:"maybe", notes:"Custom firmware on Arduino Mega. Not standard GRBL — limited compatibility." },
  { brand:"Avid CNC", model:"PRO CNC 4x8", firmware:"mach", controller:"Mach4 / Avid CNC Control", compatLevel:"cam", notes:"Runs Mach4. CAM Only." },
  { brand:"Avid CNC", model:"PRO CNC 4x4", firmware:"mach", controller:"Mach4 / Avid CNC Control", compatLevel:"cam", notes:"Runs Mach4. CAM Only." },
  { brand:"Avid CNC", model:"PRO CNC 5x10", firmware:"mach", controller:"Mach4 / Avid CNC Control", compatLevel:"cam", notes:"Runs Mach4. CAM Only." },
  { brand:"Avid CNC", model:"PRO CNC 4x2", firmware:"mach", controller:"Mach4 / Avid CNC Control", compatLevel:"cam", notes:"Runs Mach4. CAM Only." },
  { brand:"Avid CNC", model:"Benchtop PRO 2x4", firmware:"mach", controller:"Mach4", compatLevel:"cam", notes:"Runs Mach4. CAM Only." },
  { brand:"Avid CNC", model:"Benchtop PRO 2x3", firmware:"mach", controller:"Mach4", compatLevel:"cam", notes:"Runs Mach4. CAM Only." },
  { brand:"Avid CNC", model:"Standard CNC 4x8", firmware:"mach", controller:"Mach4", compatLevel:"cam", notes:"Runs Mach4. CAM Only." },
  { brand:"Avid CNC", model:"Standard CNC 4x4", firmware:"mach", controller:"Mach4", compatLevel:"cam", notes:"Runs Mach4. CAM Only." },
  { brand:"ShopBot", model:"Desktop", firmware:"other_builtin", controller:"ShopBot Control Software (proprietary)", compatLevel:"unlikely", notes:"Proprietary control software and .sbp format. Not compatible." },
  { brand:"ShopBot", model:"Desktop MAX", firmware:"other_builtin", controller:"ShopBot Control (proprietary)", compatLevel:"unlikely", notes:"Proprietary control. Not compatible." },
  { brand:"ShopBot", model:"Buddy", firmware:"other_builtin", controller:"ShopBot Control (proprietary)", compatLevel:"unlikely", notes:"Proprietary control. Not compatible." },
  { brand:"ShopBot", model:"PRSalpha", firmware:"other_builtin", controller:"ShopBot Control (proprietary)", compatLevel:"unlikely", notes:"Proprietary control. Not compatible." },
  { brand:"ShopBot", model:"PRSstandard", firmware:"other_builtin", controller:"ShopBot Control (proprietary)", compatLevel:"unlikely", notes:"Proprietary control. Not compatible." },
  { brand:"ShopBot", model:"PRS", firmware:"other_builtin", controller:"ShopBot Control (proprietary)", compatLevel:"unlikely", notes:"Proprietary control. Not compatible." },
  { brand:"Axiom", model:"Iconic 4", firmware:"other_builtin", controller:"RichAuto DSP Controller", compatLevel:"unlikely", notes:"Proprietary RichAuto DSP. Not compatible." },
  { brand:"Axiom", model:"Iconic 6", firmware:"other_builtin", controller:"RichAuto DSP Controller", compatLevel:"unlikely", notes:"RichAuto DSP. Not compatible." },
  { brand:"Axiom", model:"Iconic 8", firmware:"other_builtin", controller:"RichAuto DSP Controller", compatLevel:"unlikely", notes:"RichAuto DSP. Not compatible." },
  { brand:"Axiom", model:"AR4 Pro V5", firmware:"other_builtin", controller:"RichAuto B18 DSP Controller", compatLevel:"unlikely", notes:"RichAuto DSP. Not compatible." },
  { brand:"Axiom", model:"AR6 Pro V5", firmware:"other_builtin", controller:"RichAuto B18 DSP Controller", compatLevel:"unlikely", notes:"RichAuto DSP. Not compatible." },
  { brand:"Axiom", model:"AR8 Pro V5", firmware:"other_builtin", controller:"RichAuto B18 DSP Controller", compatLevel:"unlikely", notes:"RichAuto DSP. Not compatible." },
  { brand:"Next Wave", model:"CNC Shark HD5", firmware:"other_builtin", controller:"Next Wave Ready2Control (GRBL-variant)", compatLevel:"maybe", notes:"Proprietary GRBL-variant. Limited and unverified." },
  { brand:"Next Wave", model:"CNC Shark HD4", firmware:"other_builtin", controller:"Next Wave Ready2Control", compatLevel:"maybe", notes:"Proprietary GRBL-variant. Limited compatibility." },
  { brand:"Next Wave", model:"CNC Shark HD3", firmware:"other_builtin", controller:"Next Wave proprietary", compatLevel:"maybe", notes:"Proprietary controller. Limited compatibility." },
  { brand:"Next Wave", model:"CNC Shark HD520", firmware:"other_builtin", controller:"Next Wave Ready2Control", compatLevel:"maybe", notes:"Proprietary GRBL-variant. Limited compatibility." },
  { brand:"Next Wave", model:"CNC Piranha FX", firmware:"other_builtin", controller:"Next Wave proprietary", compatLevel:"maybe", notes:"Proprietary controller. Limited compatibility." },
  { brand:"Next Wave", model:"CNC Piranha XL", firmware:"other_builtin", controller:"Next Wave proprietary", compatLevel:"maybe", notes:"Proprietary controller. Limited compatibility." },
  { brand:"Stepcraft", model:"D.420", firmware:"uccnc", controller:"UCCNC", compatLevel:"cam", notes:"Runs UCCNC. CAM Only." },
  { brand:"Stepcraft", model:"D.600", firmware:"uccnc", controller:"UCCNC", compatLevel:"cam", notes:"Runs UCCNC. CAM Only." },
  { brand:"Stepcraft", model:"D.840", firmware:"uccnc", controller:"UCCNC", compatLevel:"cam", notes:"Runs UCCNC. CAM Only." },
  { brand:"Stepcraft", model:"M.500", firmware:"uccnc", controller:"UCCNC", compatLevel:"cam", notes:"Runs UCCNC. CAM Only." },
  { brand:"Stepcraft", model:"M.700", firmware:"uccnc", controller:"UCCNC", compatLevel:"cam", notes:"Runs UCCNC. CAM Only." },
  { brand:"Stepcraft", model:"M.1000", firmware:"uccnc", controller:"UCCNC", compatLevel:"cam", notes:"Runs UCCNC. CAM Only." },
  { brand:"Stepcraft", model:"Q.204", firmware:"uccnc", controller:"UCCNC", compatLevel:"cam", notes:"Runs UCCNC. CAM Only." },
  { brand:"Stepcraft", model:"Q.408", firmware:"uccnc", controller:"UCCNC", compatLevel:"cam", notes:"Runs UCCNC. CAM Only." },
  { brand:"Snapmaker", model:"Snapmaker 2.0 A150", firmware:"other_builtin", controller:"Snapmaker proprietary (Marlin-based)", compatLevel:"maybe", notes:"Proprietary controller. Community testing ongoing." },
  { brand:"Snapmaker", model:"Snapmaker 2.0 A250", firmware:"other_builtin", controller:"Snapmaker proprietary (Marlin-based)", compatLevel:"maybe", notes:"Proprietary controller. Community testing ongoing." },
  { brand:"Snapmaker", model:"Snapmaker 2.0 A350", firmware:"other_builtin", controller:"Snapmaker proprietary (Marlin-based)", compatLevel:"maybe", notes:"Proprietary controller. Community testing ongoing." },
  { brand:"Snapmaker", model:"Snapmaker Artisan", firmware:"other_builtin", controller:"Snapmaker proprietary", compatLevel:"maybe", notes:"Proprietary controller. Community testing ongoing." },
  { brand:"Snapmaker", model:"Snapmaker J1", firmware:"other_builtin", controller:"Snapmaker proprietary", compatLevel:"maybe", notes:"Proprietary controller. Community testing ongoing." },
  { brand:"Snapmaker", model:"Snapmaker Original", firmware:"other_builtin", controller:"Snapmaker proprietary (Marlin-based)", compatLevel:"maybe", notes:"Proprietary controller. Limited compatibility." },
  { brand:"Ooznest", model:"WorkBee 750x750", firmware:"grbl", controller:"GRBL (Duet optional)", compatLevel:"full", notes:"Typically GRBL with BlackBox. If using Duet, CAM Only." },
  { brand:"Ooznest", model:"WorkBee 1000x1000", firmware:"grbl", controller:"GRBL (Duet optional)", compatLevel:"full", notes:"Typically GRBL with BlackBox. If using Duet, CAM Only." },
  { brand:"Ooznest", model:"WorkBee 1500x1500", firmware:"grbl", controller:"GRBL (Duet optional)", compatLevel:"full", notes:"Typically GRBL with BlackBox. If using Duet, CAM Only." },
  { brand:"Ooznest", model:"WorkBee Z1+", firmware:"grbl", controller:"GRBL / Duet (varies)", compatLevel:"full", notes:"GRBL = full, Duet = CAM Only." },
  { brand:"CAMaster", model:"Stinger I", firmware:"mach", controller:"Mach3/Mach4", compatLevel:"cam", notes:"Runs Mach3/Mach4. CAM Only." },
  { brand:"CAMaster", model:"Stinger II", firmware:"mach", controller:"Mach3/Mach4", compatLevel:"cam", notes:"Runs Mach3/Mach4. CAM Only." },
  { brand:"CAMaster", model:"Stinger III", firmware:"mach", controller:"Mach3/Mach4", compatLevel:"cam", notes:"Runs Mach3/Mach4. CAM Only." },
  { brand:"CAMaster", model:"Cobra", firmware:"mach", controller:"Mach3/Mach4", compatLevel:"cam", notes:"Runs Mach3/Mach4. CAM Only." },
  { brand:"Laguna Tools", model:"IQ Pro", firmware:"other_builtin", controller:"Proprietary DSP", compatLevel:"unlikely", notes:"Proprietary control. Not compatible." },
  { brand:"Laguna Tools", model:"Swift", firmware:"other_builtin", controller:"Proprietary DSP", compatLevel:"unlikely", notes:"Proprietary control. Not compatible." },
  { brand:"Laguna Tools", model:"SmartShop II", firmware:"other_builtin", controller:"Proprietary", compatLevel:"unlikely", notes:"Proprietary control. Not compatible." },
  { brand:"Shop Sabre", model:"RC 23", firmware:"mach", controller:"Mach3/Mach4", compatLevel:"cam", notes:"Runs Mach3/Mach4. CAM Only." },
  { brand:"Shop Sabre", model:"RC 43", firmware:"mach", controller:"Mach3/Mach4", compatLevel:"cam", notes:"Runs Mach3/Mach4. CAM Only." },
  { brand:"Shop Sabre", model:"IS Series", firmware:"other_builtin", controller:"Proprietary (Centroid)", compatLevel:"unlikely", notes:"Industrial Centroid controller. Not compatible." },
  { brand:"CNC4Newbie", model:"NewCarve", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Bulkman 3D", model:"WorkBee CNC", firmware:"grbl", controller:"GRBL (xPRO / BlackBox)", compatLevel:"full", notes:"Typically GRBL. Full compatibility." },
  { brand:"Bulkman 3D", model:"LEAD CNC Kit", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Bulkman 3D", model:"QueenBee CNC", firmware:"grbl", controller:"GRBL / FluidNC", compatLevel:"full", notes:"Typically GRBL or FluidNC. Full compatibility." },
  { brand:"RatRig", model:"V-Core CNC", firmware:"grbl", controller:"GRBL / FluidNC", compatLevel:"full", notes:"GRBL/FluidNC = full support." },
  { brand:"Creality", model:"CP-01", firmware:"other_builtin", controller:"Creality proprietary (Marlin-based)", compatLevel:"maybe", notes:"Marlin-based proprietary. Limited compatibility." },
  { brand:"Sainsmart", model:"Coreception", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL when in CNC mode. Full compatibility." },
  { brand:"PrintNC", model:"PrintNC", firmware:"varies", controller:"Varies (FluidNC, grblHAL, LinuxCNC)", compatLevel:"depends", notes:"DIY — depends on controller. GRBL/grblHAL/FluidNC = full." },
  { brand:"MPCNC", model:"Mostly Printed CNC (V1 Engineering)", firmware:"varies", controller:"GRBL / Marlin (varies)", compatLevel:"depends", notes:"GRBL = full. Marlin = limited. Check firmware." },
  { brand:"Root CNC", model:"Root CNC 3", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"Typically GRBL-based. Full compatibility." },
  { brand:"DIY", model:"Arduino + CNC Shield", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"Standard GRBL on Arduino. Full compatibility." },
  { brand:"DIY", model:"Teensy + grblHAL", firmware:"grblhal", controller:"grblHAL", compatLevel:"full", notes:"grblHAL firmware. Full compatibility." },
  { brand:"DIY", model:"ESP32 + FluidNC", firmware:"fluidnc", controller:"FluidNC", compatLevel:"full", notes:"FluidNC. Full compatibility." },
  { brand:"xTool", model:"D1", firmware:"grbl", controller:"GRBL-based", compatLevel:"full", notes:"GRBL-based. Full compatibility in CNC mode." },
  { brand:"xTool", model:"D1 Pro", firmware:"grbl", controller:"GRBL-based", compatLevel:"full", notes:"GRBL-based. Full compatibility in CNC mode." },
  { brand:"Various", model:"Any machine with GRBL ≤1.1", firmware:"grbl", controller:"GRBL ≤1.1", compatLevel:"full", notes:"GRBL is fully supported." },
  { brand:"Various", model:"Any machine with grblHAL", firmware:"grblhal", controller:"grblHAL", compatLevel:"full", notes:"grblHAL is fully supported." },
  { brand:"Various", model:"Any machine with GRBL-STM", firmware:"grblstm", controller:"GRBL-STM", compatLevel:"full", notes:"GRBL-STM is fully supported." },
  { brand:"Various", model:"Any machine with FluidNC", firmware:"fluidnc", controller:"FluidNC", compatLevel:"full", notes:"FluidNC is fully supported." },
  { brand:"Various", model:"Any machine with Smoothieware", firmware:"smoothieware", controller:"Smoothieware", compatLevel:"full", notes:"Smoothieware support is a Labs feature." },
  { brand:"Various", model:"Any machine with Mach3", firmware:"mach", controller:"Mach3", compatLevel:"cam", notes:"CAM Only. Export GCode and transfer." },
  { brand:"Various", model:"Any machine with Mach4", firmware:"mach", controller:"Mach4", compatLevel:"cam", notes:"CAM Only. Export GCode and transfer." },
  { brand:"Various", model:"Any machine with LinuxCNC", firmware:"linuxcnc", controller:"LinuxCNC", compatLevel:"cam", notes:"CAM Only. Export GCode and transfer." },
  { brand:"Various", model:"Any machine with UCCNC", firmware:"uccnc", controller:"UCCNC", compatLevel:"cam", notes:"CAM Only. Export GCode and transfer." },
  { brand:"Various", model:"Any machine with Duet / RRF", firmware:"duet", controller:"Duet / RepRapFirmware", compatLevel:"cam", notes:"CAM Only. Export GCode and transfer." },
  { brand:"Various", model:"Any machine with Masso controller", firmware:"masso", controller:"Masso", compatLevel:"cam", notes:"CAM Only. Export GCode and transfer." },
  { brand:"Various", model:"Any machine with Woodpecker board", firmware:"grbl", controller:"GRBL (Woodpecker CNC board)", compatLevel:"full", notes:"Woodpecker boards run GRBL. Full compatibility." },
  { brand:"Various", model:"Any machine with xPRO V5 controller", firmware:"fluidnc", controller:"FluidNC (Spark Concepts xPRO V5)", compatLevel:"full", notes:"xPRO V5 runs FluidNC. Full compatibility." },
  { brand:"Grizzly", model:"G0704 (CNC converted)", firmware:"varies", controller:"Typically Mach3 or LinuxCNC", compatLevel:"cam", notes:"CNC conversion uses Mach3 or LinuxCNC. CAM Only." },
  { brand:"Grizzly", model:"G0876", firmware:"other_builtin", controller:"Proprietary DSP", compatLevel:"unlikely", notes:"Proprietary DSP. Not compatible." },
  { brand:"Powermatic", model:"PM-2x4SPK", firmware:"other_builtin", controller:"Proprietary", compatLevel:"unlikely", notes:"Proprietary controller. Not compatible." },
  { brand:"Shaper", model:"Origin", firmware:"other_builtin", controller:"Shaper proprietary (handheld CNC)", compatLevel:"unlikely", notes:"Handheld CNC with proprietary system. Not compatible." },
  { brand:"Shaper", model:"Origin Plus", firmware:"other_builtin", controller:"Shaper proprietary", compatLevel:"unlikely", notes:"Proprietary system. Not compatible." },
  { brand:"Tormach", model:"PCNC 440", firmware:"other_builtin", controller:"PathPilot (LinuxCNC-based)", compatLevel:"cam", notes:"PathPilot is LinuxCNC-based. CAM Only." },
  { brand:"Tormach", model:"PCNC 770", firmware:"other_builtin", controller:"PathPilot (LinuxCNC-based)", compatLevel:"cam", notes:"PathPilot/LinuxCNC. CAM Only." },
  { brand:"Tormach", model:"PCNC 1100", firmware:"other_builtin", controller:"PathPilot (LinuxCNC-based)", compatLevel:"cam", notes:"PathPilot/LinuxCNC. CAM Only." },
  { brand:"Tormach", model:"24R", firmware:"other_builtin", controller:"PathPilot (LinuxCNC-based)", compatLevel:"cam", notes:"PathPilot/LinuxCNC. CAM Only." },
  { brand:"Legacy", model:"Maverick", firmware:"other_builtin", controller:"Proprietary", compatLevel:"unlikely", notes:"Proprietary controller. Not compatible." },
  { brand:"Probotix", model:"Nebula", firmware:"linuxcnc", controller:"LinuxCNC", compatLevel:"cam", notes:"Runs LinuxCNC. CAM Only." },
  { brand:"Probotix", model:"Comet", firmware:"linuxcnc", controller:"LinuxCNC", compatLevel:"cam", notes:"Runs LinuxCNC. CAM Only." },
  { brand:"Probotix", model:"Fireball V90", firmware:"linuxcnc", controller:"LinuxCNC", compatLevel:"cam", notes:"Runs LinuxCNC. CAM Only." },
  { brand:"Comgrow", model:"ROBO CNC", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Comgrow", model:"Z1", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Genmitsu", model:"PROVerXL 4030 V2", firmware:"grbl", controller:"GRBL (customized)", compatLevel:"full", notes:"Customized GRBL. Full compatibility." },
  { brand:"EleksMaker", model:"EleksMill", firmware:"grbl", controller:"GRBL (Mana board)", compatLevel:"full", notes:"Runs GRBL on Mana board. Full compatibility." },
  { brand:"Shapeoko", model:"Shapeoko 1 (Original)", firmware:"grbl", controller:"GRBL 0.8/0.9 (Arduino + GShield)", compatLevel:"full", notes:"Very old GRBL — may need firmware update." },
  { brand:"Various (Chinese)", model:"Machine with NC Studio controller", firmware:"other_builtin", controller:"NC Studio / Weihong", compatLevel:"unlikely", notes:"Proprietary Chinese DSP. Not compatible." },
  { brand:"Various (Chinese)", model:"Machine with DSP A11/A15/A18", firmware:"other_builtin", controller:"RichAuto DSP", compatLevel:"unlikely", notes:"RichAuto DSP is proprietary. Not compatible." },
  { brand:"Various (Chinese)", model:"Machine with DSP 0501", firmware:"other_builtin", controller:"DSP 0501 (DDCSV)", compatLevel:"unlikely", notes:"DSP 0501/DDCS are proprietary. Not compatible." },
  { brand:"Donek Tools", model:"Drag Knife CNC", firmware:"grbl", controller:"GRBL (on Shapeoko/X-Carve)", compatLevel:"full", notes:"If running on a GRBL machine, full compatibility." },
  { brand:"Longmill", model:"Benchtop CNC", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"Same as Sienci LongMill. GRBL firmware." },
  { brand:"WorkBee", model:"CNC Router Kit", firmware:"grbl", controller:"GRBL (BlackBox / xPRO)", compatLevel:"full", notes:"GRBL or FluidNC. Full compatibility." },
  { brand:"QueenBee", model:"CNC Router Kit", firmware:"grbl", controller:"GRBL / FluidNC", compatLevel:"full", notes:"GRBL or FluidNC. Full compatibility." },
  { brand:"LUNYEE", model:"3018 PRO MAX (500W)", firmware:"grbl", controller:"GRBL (offline controller)", compatLevel:"full", notes:"All-metal 500W with GRBL offline control. Full compatibility." },
  { brand:"LUNYEE", model:"3018 PRO", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"LUNYEE", model:"4040 PRO", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"400x400mm GRBL machine. Full compatibility." },
  { brand:"CNCTOPBAOS", model:"3018-PRO", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"CNCTOPBAOS", model:"3018-PRO-MAX", firmware:"grbl", controller:"GRBL (offline controller)", compatLevel:"full", notes:"GRBL with offline controller. Full compatibility." },
  { brand:"RATTMMOTOR", model:"3018-PRO", firmware:"grbl", controller:"GRBL (upgraded board)", compatLevel:"full", notes:"GRBL with upgraded board. Full compatibility." },
  { brand:"RATTMMOTOR", model:"3018 PRO MAX", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"AnoleX", model:"4030-Evo Ultra 2", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"All-metal with 800W trim router. Full compatibility." },
  { brand:"AnoleX", model:"4030-Evo", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"NymoLabs", model:"NBS-6040", firmware:"grbl", controller:"GRBL v1.1 (TFT touchscreen)", compatLevel:"full", notes:"Open-source GRBL v1.1. Full compatibility." },
  { brand:"Genmitsu", model:"3020-PRO Ultra (710W)", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"710W spindle, all-metal. Full compatibility." },
  { brand:"Genmitsu", model:"4040-PRO MAX (710W)", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"710W trimmer with linear rails. Full compatibility." },
  { brand:"Genmitsu", model:"4040 Reno", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"Belt-driven GRBL machine. Full compatibility." },
  { brand:"Genmitsu", model:"Cubiko", firmware:"grbl", controller:"GRBL (WiFi + APP)", compatLevel:"full", notes:"Smart desktop CNC with WiFi. GRBL-based. Full compatibility." },
  { brand:"Genmitsu", model:"5040 CNC Router", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"FoxAlien", model:"Masuter 3S", firmware:"grbl", controller:"GRBL (NEMA 23 closed-loop)", compatLevel:"full", notes:"Closed-loop steppers with GRBL. Full compatibility." },
  { brand:"FoxAlien", model:"XE-Ultra 8080", firmware:"grbl", controller:"GRBL (NEMA 23 closed-loop)", compatLevel:"full", notes:"Large 800x800mm with GRBL. Full compatibility." },
  { brand:"FoxAlien", model:"CNC 4040-XE", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"VEVOR", model:"CNC 3018 (300W)", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"Budget 300W GRBL machine. Full compatibility." },
  { brand:"VEVOR", model:"CNC 3020", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"VEVOR", model:"CNC 4040", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"VEVOR", model:"CNC 3040 (800W)", firmware:"varies", controller:"Mach3 or GRBL (varies)", compatLevel:"depends", notes:"Check which controller shipped with yours." },
  { brand:"VEVOR", model:"CNC 6040 (1500W)", firmware:"mach", controller:"Mach3 (USB)", compatLevel:"cam", notes:"Typically Mach3. CAM Only." },
  { brand:"VEVOR", model:"CNC 6040 (2200W)", firmware:"mach", controller:"Mach3 (USB)", compatLevel:"cam", notes:"Mach3 control. CAM Only." },
  { brand:"HUANYANG", model:"CNC 3040 (800W)", firmware:"mach", controller:"Mach3", compatLevel:"cam", notes:"Chinese 3040 with Mach3. CAM Only." },
  { brand:"HUANYANG", model:"CNC 6040 (1500W)", firmware:"mach", controller:"Mach3", compatLevel:"cam", notes:"Mach3 control. CAM Only." },
  { brand:"Generic (Chinese)", model:"CNC 3040T (4-axis)", firmware:"mach", controller:"Mach3 (USB/parallel)", compatLevel:"cam", notes:"Most 3040T 4-axis machines use Mach3. CAM Only." },
  { brand:"Generic (Chinese)", model:"CNC 6040 (4-axis)", firmware:"mach", controller:"Mach3", compatLevel:"cam", notes:"Mach3 control. CAM Only." },
  { brand:"Generic (Chinese)", model:"CNC 1325 (4x8 industrial)", firmware:"other_builtin", controller:"DSP / NC Studio / Weihong", compatLevel:"unlikely", notes:"Industrial machines typically use NC Studio or DSP. Not compatible." },
  { brand:"Makera", model:"Carvera", firmware:"grbl", controller:"GRBL-based (custom)", compatLevel:"full", notes:"GRBL-based with auto tool change. Full compatibility." },
  { brand:"Makera", model:"Carvera Air", firmware:"grbl", controller:"GRBL-based (custom)", compatLevel:"full", notes:"Compact GRBL-based CNC. Full compatibility." },
  { brand:"SainSmart", model:"Genmitsu 3018-PROVer Mach3", firmware:"grbl", controller:"GRBL (Mach3 compatible GCode)", compatLevel:"full", notes:"Despite name, this is GRBL-controlled. Full compatibility." },
  { brand:"Newker", model:"CNC 3040 (GRBL version)", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL version of 3040. Full compatibility." },
  { brand:"Newker", model:"CNC 3040 (Mach3 version)", firmware:"mach", controller:"Mach3", compatLevel:"cam", notes:"Mach3 version. CAM Only." },
  { brand:"Various (AliExpress)", model:"CNC with ESP32 FluidNC board", firmware:"fluidnc", controller:"FluidNC (ESP32)", compatLevel:"full", notes:"FluidNC is fully supported. Full compatibility." },
  { brand:"Various (AliExpress)", model:"CNC with MKS DLC32 board", firmware:"grbl", controller:"GRBL (ESP32-based)", compatLevel:"full", notes:"GRBL on ESP32. Full compatibility." },
  { brand:"Generic (Amazon)", model:"CNC 3018 (any brand, GRBL)", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"Nearly all 3018 machines use GRBL. Full compatibility." },
  { brand:"Generic (Amazon)", model:"CNC 1610 (any brand, GRBL)", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"Nearly all 1610 machines use GRBL. Full compatibility." },
  { brand:"Generic (Amazon)", model:"CNC 2418 (any brand, GRBL)", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"Nearly all 2418 machines use GRBL. Full compatibility." },
  { brand:"Sovol", model:"SO-3", firmware:"grbl", controller:"GRBL-based", compatLevel:"full", notes:"GRBL-based. Full compatibility." },
  { brand:"Ortur", model:"Aufero CNC (Laser Frame 2)", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility in CNC mode." },
  { brand:"Two Trees", model:"TTC 3018 Pro Max", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"Two Trees", model:"TTC 4040", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"GRBL firmware. Full compatibility." },
  { brand:"SainSmart", model:"Genmitsu CNC 3018 (Original)", firmware:"grbl", controller:"GRBL", compatLevel:"full", notes:"Original 3018 with GRBL. Full compatibility." },
];

const CC = {
  full:{tag:"CAD + CAM + Control",color:"#059669",bg:"#ecfdf5",bdr:"#a7f3d0",icon:"✓",sum:"MillMage can design, generate toolpaths, and directly connect to and control your machine."},
  cam:{tag:"CAM Only",color:"#d97706",bg:"#fffbeb",bdr:"#fde68a",icon:"◐",sum:"MillMage can design and generate GCode, but cannot directly control your machine. Export GCode and transfer separately."},
  maybe:{tag:"Limited",color:"#7c3aed",bg:"#f5f3ff",bdr:"#ddd6fe",icon:"?",sum:"Proprietary or non-standard controller. Compatibility is limited or unverified."},
  depends:{tag:"Varies",color:"#2563eb",bg:"#eff6ff",bdr:"#bfdbfe",icon:"⚙",sum:"Compatibility depends on which controller/firmware is installed. Check your firmware."},
  unlikely:{tag:"Not Compatible",color:"#dc2626",bg:"#fef2f2",bdr:"#fecaca",icon:"✗",sum:"Proprietary control software that MillMage cannot interface with."},
};
const COMPAT_OPTS=["full","cam","maybe","depends","unlikely"];
const FIELDS=["brand","model","firmware","controller","compatLevel","notes"];

function norm(s){return s.toLowerCase().replace(/[^a-z0-9]/g,"")}
function score(q,m){
  const qn=norm(q),bn=norm(m.brand),mn=norm(m.model),cn=norm(m.controller),all=bn+" "+mn+" "+cn;
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

const STORAGE_KEY = "millmage-machines-db";

const cellSt={border:"1px solid #d1d5db",borderRadius:4,padding:"4px 6px",fontSize:12,width:"100%",boxSizing:"border-box"};
const Btn=({children,bg="#f3f4f6",color="#374151",onClick})=><button onClick={onClick} style={{border:"none",borderRadius:5,padding:"5px 10px",fontSize:11,fontWeight:600,cursor:"pointer",background:bg,color,whiteSpace:"nowrap"}}>{children}</button>;

function EditRow({machine,onSave,onCancel}){
  const [d,setD]=useState({brand:machine.brand,model:machine.model,firmware:machine.firmware,controller:machine.controller,compatLevel:machine.compatLevel,notes:machine.notes});
  const up=(f,v)=>setD(p=>({...p,[f]:v}));
  return(
    <tr style={{borderBottom:"1px solid #f3f4f6",background:"#fefce8",verticalAlign:"top"}}>
      <td style={{padding:"6px 4px"}}><input type="text" value={d.brand} onChange={e=>up("brand",e.target.value)} style={cellSt}/></td>
      <td style={{padding:"6px 4px"}}><input type="text" value={d.model} onChange={e=>up("model",e.target.value)} style={cellSt}/></td>
      <td style={{padding:"6px 4px"}}><input type="text" value={d.firmware} onChange={e=>up("firmware",e.target.value)} style={cellSt}/></td>
      <td style={{padding:"6px 4px"}}><input type="text" value={d.controller} onChange={e=>up("controller",e.target.value)} style={cellSt}/></td>
      <td style={{padding:"6px 4px"}}><select value={d.compatLevel} onChange={e=>up("compatLevel",e.target.value)} style={{...cellSt,padding:"4px 2px"}}>{COMPAT_OPTS.map(o=><option key={o} value={o}>{CC[o].tag}</option>)}</select></td>
      <td style={{padding:"6px 4px"}}><textarea value={d.notes} onChange={e=>up("notes",e.target.value)} rows={2} style={{...cellSt,resize:"vertical",minHeight:40}}/></td>
      <td style={{padding:"6px 4px",textAlign:"center"}}><div style={{display:"flex",gap:4,justifyContent:"center",flexWrap:"wrap"}}><Btn bg="#059669" color="#fff" onClick={()=>onSave(d)}>Save</Btn><Btn onClick={onCancel}>Cancel</Btn></div></td>
    </tr>
  );
}

function SearchInput({machines,onSelect}){
  const [query,setQuery]=useState("");
  const [fwHelp,setFwHelp]=useState(false);
  const ref=useRef(null);
  const results=useMemo(()=>{
    if(query.trim().length<2)return[];
    return machines.map(m=>({...m,sc:score(query,m)})).filter(m=>m.sc>25).sort((a,b)=>b.sc-a.sc).slice(0,10);
  },[query,machines]);
  return(
    <>
      <div style={{position:"relative",marginBottom:results.length>0?0:16}}>
        <div style={{display:"flex",alignItems:"center",border:"2px solid "+(query.length>0?"#6366f1":"#d1d5db"),borderRadius:results.length>0?"10px 10px 0 0":"10px",padding:"0 14px",background:"#fff",transition:"border-color .15s"}}>
          <span style={{fontSize:18,color:"#9ca3af",marginRight:10}}>🔍</span>
          <input ref={ref} type="text" value={query} onChange={e=>setQuery(e.target.value)} placeholder='e.g. "Shapeoko 5", "X-Carve", "GRBL"' style={{flex:1,border:"none",outline:"none",padding:"14px 0",fontSize:15,color:"#111827",background:"transparent"}}/>
          {query&&<button onClick={()=>{setQuery("");ref.current?.focus();}} style={{background:"none",border:"none",fontSize:18,color:"#9ca3af",cursor:"pointer",padding:"4px"}}>×</button>}
        </div>
      </div>
      {results.length>0&&(
        <div style={{border:"2px solid #6366f1",borderTop:"1px solid #e5e7eb",borderRadius:"0 0 10px 10px",background:"#fff",overflow:"hidden",marginBottom:16,maxHeight:420,overflowY:"auto"}}>
          {results.map((m,i)=>{const cc=CC[m.compatLevel];return(
            <button key={m.id} onClick={()=>{onSelect(m);setQuery("");}} style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"12px 16px",background:"transparent",border:"none",borderBottom:i<results.length-1?"1px solid #f3f4f6":"none",cursor:"pointer",textAlign:"left"}} onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div><div style={{fontSize:14,fontWeight:600,color:"#111827"}}>{m.brand} {m.model}</div><div style={{fontSize:12,color:"#6b7280",marginTop:1}}>{m.controller}</div></div>
              <span style={{fontSize:11,fontWeight:600,color:cc.color,background:cc.bg,border:`1px solid ${cc.bdr}`,borderRadius:20,padding:"3px 10px",whiteSpace:"nowrap",flexShrink:0}}>{cc.tag}</span>
            </button>
          );})}
        </div>
      )}
      {query.trim().length>=2&&results.length===0&&(
        <div style={{border:"2px solid #6366f1",borderTop:"1px solid #e5e7eb",borderRadius:"0 0 10px 10px",background:"#fff",padding:"20px 16px",textAlign:"center",marginBottom:16}}>
          <p style={{fontSize:14,color:"#6b7280",margin:"0 0 6px"}}>No match for <strong>"{query}"</strong></p>
          <p style={{fontSize:13,color:"#9ca3af",margin:0}}>Try brand, model, or firmware name. You can also browse the full database below.</p>
        </div>
      )}
      <button onClick={()=>setFwHelp(!fwHelp)} style={{background:"none",border:"none",color:"#6366f1",fontSize:14,fontWeight:500,cursor:"pointer",padding:0,textDecoration:"underline",textUnderlineOffset:2,marginBottom:12,display:"block"}}>{fwHelp?"Hide firmware info ↑":"Don't know your firmware? ↓"}</button>
      {fwHelp&&(
        <div style={{marginBottom:16,background:"#f9fafb",borderRadius:10,padding:"16px 20px",border:"1px solid #e5e7eb"}}>
          <p style={{fontSize:13,color:"#374151",margin:"0 0 12px",lineHeight:1.5}}>MillMage compatibility depends on your CNC's <strong>firmware / controller</strong>:</p>
          <div style={{marginBottom:10}}><div style={{fontSize:13,fontWeight:700,color:"#059669",marginBottom:3}}>✓ Full Support</div><div style={{fontSize:13,color:"#374151"}}>GRBL ≤1.1 · grblHAL · GRBL-STM · FluidNC · Smoothieware (Labs)</div></div>
          <div><div style={{fontSize:13,fontWeight:700,color:"#d97706",marginBottom:3}}>◐ CAM Only</div><div style={{fontSize:13,color:"#374151"}}>Mach3/4 · LinuxCNC · UCCNC · Duet/RRF · Masso</div></div>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div style={{background:"#ecfdf5",borderRadius:8,padding:"14px 16px",border:"1px solid #a7f3d0"}}><div style={{fontSize:12,fontWeight:700,color:"#059669",marginBottom:6}}>✓ FULL CONTROL</div><div style={{fontSize:12,color:"#374151",lineHeight:1.6}}>GRBL · grblHAL · FluidNC · Smoothieware</div></div>
        <div style={{background:"#fffbeb",borderRadius:8,padding:"14px 16px",border:"1px solid #fde68a"}}><div style={{fontSize:12,fontWeight:700,color:"#d97706",marginBottom:6}}>◐ CAM ONLY</div><div style={{fontSize:12,color:"#374151",lineHeight:1.6}}>Mach3/4 · LinuxCNC · UCCNC · Duet · Masso</div></div>
      </div>
    </>
  );
}

function DetailCard({machine,onBack}){
  const c=CC[machine.compatLevel];
  return(
    <div style={{animation:"fadeIn .25s ease"}}>
      <div style={{background:c.bg,border:`2px solid ${c.bdr}`,borderRadius:12,padding:"20px 24px",marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:36,height:36,borderRadius:"50%",background:c.color,color:"#fff",fontSize:20,fontWeight:700}}>{c.icon}</span>
          <div>
            <div style={{fontSize:17,fontWeight:700,color:"#111827"}}>{machine.brand} {machine.model}</div>
            <span style={{display:"inline-block",fontSize:12,fontWeight:600,color:c.color,background:"#fff",border:`1px solid ${c.bdr}`,borderRadius:20,padding:"2px 10px",marginTop:2}}>{c.tag}</span>
          </div>
        </div>
        <p style={{fontSize:14,color:"#374151",lineHeight:1.6,margin:"0 0 12px"}}>{c.sum}</p>
        <div style={{background:"rgba(255,255,255,0.7)",borderRadius:8,padding:"12px 14px",fontSize:13,color:"#4b5563",lineHeight:1.55}}>
          <strong style={{color:"#111827"}}>Controller:</strong> {machine.controller}<br/><span style={{color:"#6b7280"}}>{machine.notes}</span>
        </div>
      </div>
      {machine.compatLevel==="full"&&<div style={{background:"#f0fdf4",borderRadius:8,padding:"12px 16px",fontSize:13,color:"#166534",marginBottom:16,lineHeight:1.5}}><strong>Ready to go!</strong> Download the <a href="https://lightburnsoftware.com/products/millmage-core" target="_blank" rel="noopener" style={{color:"#059669"}}>30-day free trial</a> to verify with your setup.</div>}
      {machine.compatLevel==="cam"&&<div style={{background:"#fffbeb",borderRadius:8,padding:"12px 16px",fontSize:13,color:"#92400e",marginBottom:16,lineHeight:1.5}}><strong>You can still use MillMage!</strong> Design and export GCode, then transfer to your machine.</div>}
      {(machine.compatLevel==="maybe"||machine.compatLevel==="depends")&&<div style={{background:"#f5f3ff",borderRadius:8,padding:"12px 16px",fontSize:13,color:"#5b21b6",marginBottom:16,lineHeight:1.5}}><strong>Not sure?</strong> Try the <a href="https://lightburnsoftware.com/products/millmage-core" target="_blank" rel="noopener" style={{color:"#7c3aed"}}>30-day free trial</a>.</div>}
      {machine.compatLevel==="unlikely"&&<div style={{background:"#fef2f2",borderRadius:8,padding:"12px 16px",fontSize:13,color:"#991b1b",marginBottom:16,lineHeight:1.5}}>This machine's proprietary system isn't supported. If you've upgraded the controller, search again by the new controller type.</div>}
      <button onClick={onBack} style={{display:"block",width:"100%",padding:"12px",background:"#fff",border:"1px solid #d1d5db",borderRadius:8,fontSize:14,fontWeight:500,color:"#374151",cursor:"pointer"}}>← Check another machine</button>
    </div>
  );
}

export default function App(){
  const [machines,setMachines]=useState([]);
  const [loading,setLoading]=useState(true);
  const [saveStatus,setSaveStatus]=useState(null); // null | "saving" | "saved" | "error"
  const [mode,setMode]=useState("admin"); // "admin" | "public"
  const [query,setQuery]=useState("");
  const [sel,setSel]=useState(null);
  const [tblFilter,setTblFilter]=useState("");
  const [tblCompat,setTblCompat]=useState("all");
  const [editId,setEditId]=useState(null);
  const [confirmDel,setConfirmDel]=useState(null);
  const [fwHelp,setFwHelp]=useState(false);
  const nextId=useRef(0);

  // Load from storage on mount
  useEffect(()=>{
    (async()=>{
      try{
        const r=await window.storage.get(STORAGE_KEY);
        if(r&&r.value){
          const parsed=JSON.parse(r.value);
          if(Array.isArray(parsed)&&parsed.length>0){
            setMachines(parsed.map((m,i)=>({...m,id:i})));
            nextId.current=parsed.length;
            setLoading(false);
            return;
          }
        }
      }catch(e){}
      // Fallback to defaults
      setMachines(DEFAULT_MACHINES.map((m,i)=>({...m,id:i})));
      nextId.current=DEFAULT_MACHINES.length;
      setLoading(false);
    })();
  },[]);

  // Save to persistent storage
  const saveToDB=useCallback(async(data)=>{
    setSaveStatus("saving");
    try{
      const clean=data.map(({id,...rest})=>rest);
      await window.storage.set(STORAGE_KEY,JSON.stringify(clean));
      setSaveStatus("saved");
      setTimeout(()=>setSaveStatus(null),2000);
    }catch(e){
      setSaveStatus("error");
      setTimeout(()=>setSaveStatus(null),3000);
    }
  },[]);

  const filteredTable=useMemo(()=>{
    let list=machines;
    if(tblFilter.trim().length>=2) list=list.filter(m=>score(tblFilter,m)>20);
    if(tblCompat!=="all") list=list.filter(m=>m.compatLevel===tblCompat);
    return list;
  },[tblFilter,tblCompat,machines]);

  const startEdit=m=>{setEditId(m.id);};
  const cancelEdit=()=>{
    // If it was a brand new empty row, remove it
    const m=machines.find(x=>x.id===editId);
    if(m&&!m.brand&&!m.model&&!m.controller) setMachines(prev=>prev.filter(x=>x.id!==editId));
    setEditId(null);
  };
  const saveEdit=(data)=>{
    const updated=machines.map(m=>m.id===editId?{...m,...data}:m);
    setMachines(updated);saveToDB(updated);setEditId(null);
  };
  const addRow=()=>{
    const id=nextId.current++;
    const nw={id,brand:"",model:"",firmware:"grbl",controller:"",compatLevel:"full",notes:""};
    const updated=[nw,...machines];
    setMachines(updated);startEdit(nw);
  };
  const deleteRow=id=>{
    const updated=machines.filter(m=>m.id!==id);
    setMachines(updated);saveToDB(updated);    if(editId===id)setEditId(null);setConfirmDel(null);
  };
  const resetDB=async()=>{
    const fresh=DEFAULT_MACHINES.map((m,i)=>({...m,id:i}));
    nextId.current=DEFAULT_MACHINES.length;
    setMachines(fresh);await saveToDB(fresh);
  };
  const exportCSV=()=>{
    const hdr="brand,model,firmware,controller,compatLevel,notes";
    const rows=machines.map(m=>FIELDS.map(f=>`"${String(m[f]||"").replace(/"/g,'""')}"`).join(","));
    const blob=new Blob([hdr+"\n"+rows.join("\n")],{type:"text/csv"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="millmage_machines.csv";a.click();
  };
  const importCSV=()=>{
    const inp=document.createElement("input");inp.type="file";inp.accept=".csv";
    inp.onchange=async e=>{
      const file=e.target.files[0];if(!file)return;
      const txt=await file.text();
      const lines=txt.split("\n").map(l=>l.trim()).filter(Boolean);
      if(lines.length<2)return;
      const hdr=lines[0].split(",").map(h=>h.trim().replace(/^"|"$/g,""));
      const rows=[];
      for(let i=1;i<lines.length;i++){
        const vals=[];let cur="",inQ=false;
        for(let ch of lines[i]){
          if(ch==='"'){inQ=!inQ;}else if(ch===","&&!inQ){vals.push(cur.trim());cur="";}else{cur+=ch;}
        }
        vals.push(cur.trim());
        const obj={};hdr.forEach((h,j)=>{obj[h]=vals[j]||"";});
        if(obj.brand||obj.model)rows.push(obj);
      }
      const imported=rows.map((r,i)=>({...r,id:i}));
      nextId.current=imported.length;
      setMachines(imported);await saveToDB(imported);
    };
    inp.click();
  };

  const handleSelect=m=>{setSel(m);setQuery("");};
  const handleReset=()=>{setSel(null);setQuery("");setTimeout(()=>ref.current?.focus(),100);};

  if(loading) return <div style={{fontFamily:"-apple-system,sans-serif",textAlign:"center",padding:60,color:"#6b7280"}}>Loading machine database...</div>;

  const c=sel?CC[sel.compatLevel]:null;
  if(loading) return <div style={{fontFamily:"-apple-system,sans-serif",textAlign:"center",padding:60,color:"#6b7280"}}>Loading machine database...</div>;

  const isAdmin=mode==="admin";

  // ── SEARCH PANEL (shared) ──
  const SearchPanel=()=>(
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
              <strong style={{color:"#111827"}}>Controller:</strong> {sel.controller}<br/><span style={{color:"#6b7280"}}>{sel.notes}</span>
            </div>
          </div>
          {sel.compatLevel==="full"&&<div style={{background:"#f0fdf4",borderRadius:8,padding:"12px 16px",fontSize:13,color:"#166534",marginBottom:16,lineHeight:1.5}}><strong>Ready to go!</strong> Download the <a href="https://lightburnsoftware.com/products/millmage-core" target="_blank" rel="noopener" style={{color:"#059669"}}>30-day free trial</a> to verify with your setup.</div>}
          {sel.compatLevel==="cam"&&<div style={{background:"#fffbeb",borderRadius:8,padding:"12px 16px",fontSize:13,color:"#92400e",marginBottom:16,lineHeight:1.5}}><strong>You can still use MillMage!</strong> Design and export GCode, then transfer to your machine.</div>}
          {(sel.compatLevel==="maybe"||sel.compatLevel==="depends")&&<div style={{background:"#f5f3ff",borderRadius:8,padding:"12px 16px",fontSize:13,color:"#5b21b6",marginBottom:16,lineHeight:1.5}}><strong>Not sure?</strong> Try the <a href="https://lightburnsoftware.com/products/millmage-core" target="_blank" rel="noopener" style={{color:"#7c3aed"}}>30-day free trial</a>.</div>}
          {sel.compatLevel==="unlikely"&&<div style={{background:"#fef2f2",borderRadius:8,padding:"12px 16px",fontSize:13,color:"#991b1b",marginBottom:16,lineHeight:1.5}}>This machine's proprietary system isn't supported. If you've upgraded the controller, search again by the new controller type.</div>}
          <button onClick={handleReset} style={{display:"block",width:"100%",padding:"12px",background:"#fff",border:"1px solid #d1d5db",borderRadius:8,fontSize:14,fontWeight:500,color:"#374151",cursor:"pointer"}}>← Check another machine</button>
        </div>
      ):(
        <>
          <div style={{position:"relative",marginBottom:results.length>0?0:16}}>
            <div style={{display:"flex",alignItems:"center",border:"2px solid "+(query.length>0?"#6366f1":"#d1d5db"),borderRadius:results.length>0?"10px 10px 0 0":"10px",padding:"0 14px",background:"#fff",transition:"border-color .15s"}}>
              <span style={{fontSize:18,color:"#9ca3af",marginRight:10}}>🔍</span>
              <input ref={ref} type="text" value={query} onChange={e=>setQuery(e.target.value)} placeholder='e.g. "Shapeoko 5", "X-Carve", "GRBL"' style={{flex:1,border:"none",outline:"none",padding:"14px 0",fontSize:15,color:"#111827",background:"transparent"}}/>
              {query&&<button onClick={()=>{setQuery("");ref.current?.focus();}} style={{background:"none",border:"none",fontSize:18,color:"#9ca3af",cursor:"pointer",padding:"4px"}}>×</button>}
            </div>
          </div>
          {results.length>0&&(
            <div style={{border:"2px solid #6366f1",borderTop:"1px solid #e5e7eb",borderRadius:"0 0 10px 10px",background:"#fff",overflow:"hidden",marginBottom:16,maxHeight:420,overflowY:"auto"}}>
              {results.map((m,i)=>{const cc=CC[m.compatLevel];return(
                <button key={m.id} onClick={()=>handleSelect(m)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"12px 16px",background:"transparent",border:"none",borderBottom:i<results.length-1?"1px solid #f3f4f6":"none",cursor:"pointer",textAlign:"left"}} onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <div><div style={{fontSize:14,fontWeight:600,color:"#111827"}}>{m.brand} {m.model}</div><div style={{fontSize:12,color:"#6b7280",marginTop:1}}>{m.controller}</div></div>
                  <span style={{fontSize:11,fontWeight:600,color:cc.color,background:cc.bg,border:`1px solid ${cc.bdr}`,borderRadius:20,padding:"3px 10px",whiteSpace:"nowrap",flexShrink:0}}>{cc.tag}</span>
                </button>
              );})}
            </div>
          )}
          {query.trim().length>=2&&results.length===0&&(
            <div style={{border:"2px solid #6366f1",borderTop:"1px solid #e5e7eb",borderRadius:"0 0 10px 10px",background:"#fff",padding:"20px 16px",textAlign:"center",marginBottom:16}}>
              <p style={{fontSize:14,color:"#6b7280",margin:"0 0 6px"}}>No match for <strong>"{query}"</strong></p>
              <p style={{fontSize:13,color:"#9ca3af",margin:0}}>Try brand, model, or firmware name. You can also browse the full database below.</p>
            </div>
          )}
          <button onClick={()=>setFwHelp(!fwHelp)} style={{background:"none",border:"none",color:"#6366f1",fontSize:14,fontWeight:500,cursor:"pointer",padding:0,textDecoration:"underline",textUnderlineOffset:2,marginBottom:12,display:"block"}}>{fwHelp?"Hide firmware info ↑":"Don't know your firmware? ↓"}</button>
          {fwHelp&&(
            <div style={{marginBottom:16,background:"#f9fafb",borderRadius:10,padding:"16px 20px",border:"1px solid #e5e7eb"}}>
              <p style={{fontSize:13,color:"#374151",margin:"0 0 12px",lineHeight:1.5}}>MillMage compatibility depends on your CNC's <strong>firmware / controller</strong>:</p>
              <div style={{marginBottom:10}}><div style={{fontSize:13,fontWeight:700,color:"#059669",marginBottom:3}}>✓ Full Support</div><div style={{fontSize:13,color:"#374151"}}>GRBL ≤1.1 · grblHAL · GRBL-STM · FluidNC · Smoothieware (Labs)</div></div>
              <div><div style={{fontSize:13,fontWeight:700,color:"#d97706",marginBottom:3}}>◐ CAM Only</div><div style={{fontSize:13,color:"#374151"}}>Mach3/4 · LinuxCNC · UCCNC · Duet/RRF · Masso</div></div>
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div style={{background:"#ecfdf5",borderRadius:8,padding:"14px 16px",border:"1px solid #a7f3d0"}}><div style={{fontSize:12,fontWeight:700,color:"#059669",marginBottom:6}}>✓ FULL CONTROL</div><div style={{fontSize:12,color:"#374151",lineHeight:1.6}}>GRBL · grblHAL · FluidNC · Smoothieware</div></div>
            <div style={{background:"#fffbeb",borderRadius:8,padding:"14px 16px",border:"1px solid #fde68a"}}><div style={{fontSize:12,fontWeight:700,color:"#d97706",marginBottom:6}}>◐ CAM ONLY</div><div style={{fontSize:12,color:"#374151",lineHeight:1.6}}>Mach3/4 · LinuxCNC · UCCNC · Duet · Masso</div></div>
          </div>
        </>
      )}
    </>
  );

  // ── READ-ONLY TABLE (public) ──
  const PublicTable=()=>(
    <div>
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        <input type="text" value={tblFilter} onChange={e=>setTblFilter(e.target.value)} placeholder="Filter by brand, model, or controller..." style={{flex:1,minWidth:180,border:"1px solid #d1d5db",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none"}}/>
        <select value={tblCompat} onChange={e=>setTblCompat(e.target.value)} style={{border:"1px solid #d1d5db",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none",background:"#fff",cursor:"pointer"}}>
          <option value="all">All ({machines.length})</option>
          <option value="full">✓ Full ({machines.filter(m=>m.compatLevel==="full").length})</option>
          <option value="cam">◐ CAM ({machines.filter(m=>m.compatLevel==="cam").length})</option>
          <option value="maybe">? Limited ({machines.filter(m=>m.compatLevel==="maybe").length})</option>
          <option value="depends">⚙ Varies ({machines.filter(m=>m.compatLevel==="depends").length})</option>
          <option value="unlikely">✗ N/C ({machines.filter(m=>m.compatLevel==="unlikely").length})</option>
        </select>
      </div>
      <div style={{overflowX:"auto",border:"1px solid #e5e7eb",borderRadius:10}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{background:"#f9fafb",borderBottom:"2px solid #e5e7eb"}}>
            <th style={{padding:"10px 12px",textAlign:"left",fontWeight:600,color:"#374151"}}>Brand</th>
            <th style={{padding:"10px 12px",textAlign:"left",fontWeight:600,color:"#374151"}}>Model</th>
            <th style={{padding:"10px 12px",textAlign:"left",fontWeight:600,color:"#374151"}}>Controller</th>
            <th style={{padding:"10px 12px",textAlign:"left",fontWeight:600,color:"#374151"}}>Status</th>
          </tr></thead>
          <tbody>
            {filteredTable.length===0&&<tr><td colSpan={4} style={{padding:20,textAlign:"center",color:"#9ca3af"}}>No machines match.</td></tr>}
            {filteredTable.map(m=>{const cc=CC[m.compatLevel];return(
              <tr key={m.id} style={{borderBottom:"1px solid #f3f4f6",cursor:"pointer"}} onClick={()=>{setSel(m);}} onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"8px 12px",color:"#374151"}}>{m.brand}</td>
                <td style={{padding:"8px 12px",color:"#111827",fontWeight:500}}>{m.model}</td>
                <td style={{padding:"8px 12px",color:"#6b7280",maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.controller}</td>
                <td style={{padding:"8px 12px"}}><span style={{fontSize:11,fontWeight:600,color:cc.color,background:cc.bg,border:`1px solid ${cc.bdr}`,borderRadius:20,padding:"2px 10px",whiteSpace:"nowrap"}}>{cc.tag}</span></td>
              </tr>
            );})}
          </tbody>
        </table>
      </div>
      <p style={{fontSize:12,color:"#9ca3af",marginTop:12}}>Showing {filteredTable.length} of {machines.length} machines. Click any row for details.</p>
    </div>
  );

  // ── ADMIN TABLE ──
  const AdminTable=()=>(
    <div>
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
        <input type="text" value={tblFilter} onChange={e=>setTblFilter(e.target.value)} placeholder="Filter..." style={{flex:1,minWidth:140,border:"1px solid #d1d5db",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none"}}/>
        <select value={tblCompat} onChange={e=>setTblCompat(e.target.value)} style={{border:"1px solid #d1d5db",borderRadius:8,padding:"8px 10px",fontSize:13,outline:"none",background:"#fff"}}>
          <option value="all">All ({machines.length})</option>
          <option value="full">✓ Full ({machines.filter(m=>m.compatLevel==="full").length})</option>
          <option value="cam">◐ CAM ({machines.filter(m=>m.compatLevel==="cam").length})</option>
          <option value="maybe">? Limited ({machines.filter(m=>m.compatLevel==="maybe").length})</option>
          <option value="depends">⚙ Varies ({machines.filter(m=>m.compatLevel==="depends").length})</option>
          <option value="unlikely">✗ N/C ({machines.filter(m=>m.compatLevel==="unlikely").length})</option>
        </select>
        <Btn bg="#6366f1" color="#fff" onClick={addRow}>+ Add</Btn>
        <Btn onClick={importCSV}>⬆ Import CSV</Btn>
        <Btn onClick={exportCSV}>⬇ Export CSV</Btn>
        <Btn bg="#fef2f2" color="#dc2626" onClick={()=>{if(confirm("Reset database to defaults? All edits will be lost."))resetDB();}}>Reset</Btn>
        {saveStatus==="saving"&&<span style={{fontSize:11,color:"#6b7280"}}>Saving...</span>}
        {saveStatus==="saved"&&<span style={{fontSize:11,color:"#059669"}}>✓ Saved</span>}
        {saveStatus==="error"&&<span style={{fontSize:11,color:"#dc2626"}}>Save failed</span>}
      </div>
      <div style={{overflowX:"auto",border:"1px solid #e5e7eb",borderRadius:10}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{background:"#f9fafb",borderBottom:"2px solid #e5e7eb"}}>
            <th style={{padding:"8px 6px",textAlign:"left",fontWeight:600,color:"#374151",minWidth:90}}>Brand</th>
            <th style={{padding:"8px 6px",textAlign:"left",fontWeight:600,color:"#374151",minWidth:110}}>Model</th>
            <th style={{padding:"8px 6px",textAlign:"left",fontWeight:600,color:"#374151",minWidth:65}}>Firmware</th>
            <th style={{padding:"8px 6px",textAlign:"left",fontWeight:600,color:"#374151",minWidth:130}}>Controller</th>
            <th style={{padding:"8px 6px",textAlign:"left",fontWeight:600,color:"#374151",minWidth:85}}>Status</th>
            <th style={{padding:"8px 6px",textAlign:"left",fontWeight:600,color:"#374151",minWidth:140}}>Notes</th>
            <th style={{padding:"8px 6px",textAlign:"center",fontWeight:600,color:"#374151",width:95}}>Actions</th>
          </tr></thead>
          <tbody>
            {filteredTable.length===0&&<tr><td colSpan={7} style={{padding:20,textAlign:"center",color:"#9ca3af"}}>No machines match.</td></tr>}
            {filteredTable.map(m=>{
              const isE=editId===m.id;const cc=CC[m.compatLevel];
              if(isE) return <EditRow key={m.id} machine={m} onSave={saveEdit} onCancel={cancelEdit}/>;
              return(
                <tr key={m.id} style={{borderBottom:"1px solid #f3f4f6",verticalAlign:"top"}}>
                    <td style={{padding:"8px 6px",color:"#374151"}}>{m.brand}</td>
                    <td style={{padding:"8px 6px",color:"#111827",fontWeight:500}}>{m.model}</td>
                    <td style={{padding:"8px 6px",color:"#6b7280"}}>{m.firmware}</td>
                    <td style={{padding:"8px 6px",color:"#6b7280",maxWidth:170,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.controller}</td>
                    <td style={{padding:"8px 6px"}}><span style={{fontSize:11,fontWeight:600,color:cc.color,background:cc.bg,border:`1px solid ${cc.bdr}`,borderRadius:20,padding:"2px 8px",whiteSpace:"nowrap"}}>{cc.tag}</span></td>
                    <td style={{padding:"8px 6px",color:"#6b7280",maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={m.notes}>{m.notes}</td>
                    <td style={{padding:"8px 6px",textAlign:"center"}}><div style={{display:"flex",gap:4,justifyContent:"center"}}>
                      <Btn bg="#eff6ff" color="#2563eb" onClick={()=>startEdit(m)}>Edit</Btn>
                      {confirmDel===m.id?(<><Btn bg="#dc2626" color="#fff" onClick={()=>deleteRow(m.id)}>Yes</Btn><Btn onClick={()=>setConfirmDel(null)}>No</Btn></>):(<Btn bg="#fef2f2" color="#dc2626" onClick={()=>setConfirmDel(m.id)}>Del</Btn>)}
                    </div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p style={{fontSize:12,color:"#9ca3af",marginTop:12}}>Showing {filteredTable.length} of {machines.length}. Edits auto-save. Use Export CSV to download.</p>
    </div>
  );

  return(
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",maxWidth:1100,margin:"0 auto",padding:"20px 16px"}}>
      {/* Mode toggle */}
      <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
        <div style={{display:"inline-flex",background:"#f3f4f6",borderRadius:8,padding:3}}>
          {[["admin","🔧 Admin"],["public","🌐 Public Preview"]].map(([v,l])=>(
            <button key={v} onClick={()=>{setMode(v);setSel(null);setEditId(null);}} style={{padding:"7px 16px",fontSize:13,fontWeight:600,border:"none",borderRadius:6,cursor:"pointer",background:mode===v?"#fff":"transparent",color:mode===v?"#111827":"#6b7280",boxShadow:mode===v?"0 1px 3px rgba(0,0,0,0.1)":"none",transition:"all .15s"}}>{l}</button>
          ))}
        </div>
      </div>

      {isAdmin&&<div style={{background:"#fef3c7",border:"1px solid #fde68a",borderRadius:8,padding:"8px 14px",fontSize:12,color:"#92400e",marginBottom:16,textAlign:"center"}}>
        <strong>Admin Mode</strong> — Edit your machine database here. Changes are saved automatically. Switch to <strong>Public Preview</strong> to see the read-only version for your website.
      </div>}

      <div style={{textAlign:"center",marginBottom:20}}>
        <h1 style={{fontSize:22,fontWeight:700,color:"#111827",margin:"0 0 4px"}}>Is my CNC compatible with MillMage?</h1>
        <p style={{fontSize:14,color:"#6b7280",margin:0}}>Search {machines.length} machines{isAdmin?" or edit the database":""}.</p>
      </div>

      {/* Search is always available at the top */}
      {sel?<DetailCard machine={sel} onBack={()=>setSel(null)}/>:<SearchInput machines={machines} onSelect={setSel}/>}

      {/* Table section */}
      <div style={{marginTop:24,borderTop:"1px solid #e5e7eb",paddingTop:20}}>
        <h2 style={{fontSize:16,fontWeight:700,color:"#111827",margin:"0 0 12px"}}>{isAdmin?"📋 Edit Machine Database":"📋 Full Machine Database"}</h2>
        {isAdmin?<AdminTable/>:<PublicTable/>}
      </div>

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}