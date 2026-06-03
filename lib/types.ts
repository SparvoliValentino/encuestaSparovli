// ─── Severity scale (0-3) ─────────────────────────────────────────────────────
export type SeverityValue = 0 | 1 | 2 | 3;
export type TemperatureValue = 0 | 1 | 2;

// ─── Scale options ────────────────────────────────────────────────────────────
export interface ScaleOption {
  value: number;
  label: string;
  color: string;
}

// ─── Questions ───────────────────────────────────────────────────────────────
export interface SurveyQuestion {
  id: number;
  sectionId: number;
  text: string;
  shortName: string;
  scale: ScaleOption[];
}

// ─── Sections ─────────────────────────────────────────────────────────────────
export interface SurveySection {
  id: number;
  title: string;
  description?: string;
}

// ─── Submission ───────────────────────────────────────────────────────────────
export interface SurveySubmission {
  documento: string;
  dia: number;
  respuestas: number[];
}

// ─── CSV row from Google Sheets ───────────────────────────────────────────────
export interface CsvRow {
  fecha: string;
  documento: string;
  dia: string;
  pregunta_1: string;
  pregunta_2: string;
  pregunta_3: string;
  pregunta_4: string;
  pregunta_5: string;
  pregunta_6: string;
  pregunta_7: string;
}

// ─── Per-user single day entry ─────────────────────────────────────────────────
export interface UserDayEntry {
  userDia: number;        // user's sequential day (1, 2, 3...)
  fecha: string;          // actual date string
  respuestas: number[];   // [p1, p2, ..., p7]
  missed: boolean;         // true if this day had no response (gap)
}

// ─── Per-user full response record ────────────────────────────────────────────
export interface UserResponse {
  documento: string;
  days: UserDayEntry[];
}

// ─── Dashboard data (computed from CSV) ─────────────────────────────────────
export interface QuestionStats {
  questionId: number;
  section: string;
  text: string;
  average: number;
  distribution: { value: number; count: number; percentage: number }[];
}

export interface DashboardData {
  totalResponses: number;
  totalUsers: number;
  globalStats: QuestionStats[];
  userResponses: UserResponse[];
}