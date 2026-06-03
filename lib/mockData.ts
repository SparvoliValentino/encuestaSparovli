import type { SurveySection, SurveyQuestion } from "./types";

// ─── Color palette ───────────────────────────────────────────────────────────
const TEAL = "#1D9E75";
const AMBER = "#EF9F27";
const RED = "#E24B4A";

// ─── Sections ────────────────────────────────────────────────────────────────
export const sections: SurveySection[] = [
  {
    id: 1,
    title: "Síntomas Generales",
    description: "Preguntas sobre malestares generales",
  },
  {
    id: 2,
    title: "Síntomas Respiratorios",
    description: "Preguntas sobre síntomas respiratorios",
  },
  {
    id: 3,
    title: "Temperatura",
    description: "Temperatura corporal en las últimas 24 horas",
  },
];

// ─── Scale helpers ───────────────────────────────────────────────────────────
/** Standard 0-3 severity scale (Síntomas Generales / Respiratorios) */
export const severityScale = [
  { value: 0, label: "Ausente", color: TEAL },
  { value: 1, label: "Leve", color: "#5DCAA5" },
  { value: 2, label: "Moderado", color: AMBER },
  { value: 3, label: "Severo", color: RED },
];

/** Temperature scale 0-2 with °C range labels */
export const temperatureScale = [
  { value: 0, label: "37 – 37,5 °C", color: TEAL },
  { value: 1, label: "37,6 – 38 °C", color: AMBER },
  { value: 2, label: "Más de 38 °C", color: RED },
];

// ─── Questions ───────────────────────────────────────────────────────────────
export const questions: SurveyQuestion[] = [
  // Section 1: Síntomas Generales
  {
    id: 1,
    sectionId: 1,
    text: "¿Cuánta cefalea (dolor de cabeza) sintió durante las últimas 24 horas?",
    shortName: "Cefalea",
    scale: severityScale,
  },
  {
    id: 2,
    sectionId: 1,
    text: "¿Cuánto dolor corporal, muscular o en las articulaciones sintió en las últimas 24 horas?",
    shortName: "Dolores musculares",
    scale: severityScale,
  },
  {
    id: 3,
    sectionId: 1,
    text: "¿Cuánta fatiga sintió en las últimas 24 horas?",
    shortName: "Fatiga",
    scale: severityScale,
  },
  // Section 2: Síntomas Respiratorios
  {
    id: 4,
    sectionId: 2,
    text: "¿Cuánta tos tuvo en las últimas 24 horas?",
    shortName: "Tos",
    scale: severityScale,
  },
  {
    id: 5,
    sectionId: 2,
    text: "¿Cuánto dolor de garganta sintió en las últimas 24 horas?",
    shortName: "Dolor de garganta",
    scale: severityScale,
  },
  {
    id: 6,
    sectionId: 2,
    text: "¿Cuánta congestión nasal ha tenido en las últimas 24 horas?",
    shortName: "Congestión nasal",
    scale: severityScale,
  },
  // Section 3: Temperatura
  {
    id: 7,
    sectionId: 3,
    text: "Seleccione su temperatura corporal en las últimas 24 horas.",
    shortName: "Temperatura",
    scale: temperatureScale,
  },
];

// ─── Distribution helpers (for dashboard mock data generation) ───────────────
/** Returns bar color based on severity value (0-3) */
export function getBarColor(value: number): string {
  if (value === 0) return TEAL;
  if (value === 1) return "#5DCAA5";
  if (value === 2) return AMBER;
  return RED;
}

/** Returns button class for a given severity value */
export function getButtonClass(value: number, selected: boolean): string {
  if (!selected) return "border-[#ddd] text-gray-700";
  if (value === 0) return "border-[#1D9E75] bg-[#1D9E75] text-white";
  if (value === 1) return "border-[#5DCAA5] bg-[#5DCAA5] text-white";
  if (value === 2) return "border-[#EF9F27] bg-[#EF9F27] text-white";
  return "border-[#E24B4A] bg-[#E24B4A] text-white";
}

/** Returns scale class badge for dashboard display */
export function getScoreClass(value: number): string {
  if (value <= 1) return "bg-[#E1F5EE] text-[#1D9E75]";
  if (value <= 2) return "bg-[#FAEEDA] text-[#EF9F27]";
  return "bg-[#FCEBEB] text-[#E24B4A]";
}

/** Returns scale label for dashboard display */
export function getScoreLabel(value: number): string {
  if (value === 0) return "Bien";
  if (value === 1) return "Regular";
  if (value === 2) return "Atención";
  return "Alerta";
}

// ─── Date formatting ─────────────────────────────────────────────────────────
export function formatDate(date: Date): string {
  return date.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}