import type { DashboardData, CsvRow, QuestionStats, UserResponse, UserDayEntry } from "./types";
import { questions, sections } from "./mockData";

const CSV_URL = process.env.NEXT_PUBLIC_SURVEY_SHEET_CSV_URL;

function sortByDate(a: CsvRow, b: CsvRow): number {
  return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
}

function buildUserDays(sortedRows: CsvRow[]): UserDayEntry[] {
  const days: UserDayEntry[] = [];
  let userDia = 0;

  for (const row of sortedRows) {
    userDia++;
    days.push({
      userDia,
      fecha: row.fecha,
      respuestas: questions.map((q) => parseInt(row[`pregunta_${q.id}` as keyof CsvRow] as string, 10) || 0),
      missed: false,
    });
  }

  // Detect gaps in dates — fill with "missed" entries
  const result: UserDayEntry[] = [];
  for (let i = 0; i < days.length; i++) {
    const current = days[i];
    result.push(current);

    if (i < days.length - 1) {
      const nextDate = new Date(days[i + 1].fecha);
      const currentDate = new Date(current.fecha);
      currentDate.setHours(0, 0, 0, 0);
      nextDate.setHours(0, 0, 0, 0);
      const diffMs = nextDate.getTime() - currentDate.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      // There are gap days between current and next response
      for (let d = 1; d < diffDays; d++) {
        const gapDate = new Date(currentDate);
        gapDate.setDate(gapDate.getDate() + d);
        result.push({
          userDia: current.userDia + d,
          fecha: gapDate.toISOString().split("T")[0],
          respuestas: [],
          missed: true,
        });
      }
    }
  }

  // Recompute userDia sequentially
  return result.map((entry, idx) => ({ ...entry, userDia: idx + 1 }));
}

/**
 * Fetches raw CSV from Google Sheets, parses it, and computes dashboard stats.
 * Never falls back to mock data — throws on any failure.
 */
export async function fetchDashboard(): Promise<DashboardData> {
  if (!CSV_URL) {
    throw new Error("NEXT_PUBLIC_SURVEY_SHEET_CSV_URL is not defined");
  }

  const res = await fetch(CSV_URL);
  if (!res.ok) {
    throw new Error(`CSV fetch failed with status ${res.status}`);
  }

  const csvText = await res.text();
  const rows = csvText.split("\n").map((row) => row.split(","));
  const headers = rows[0].map((h) => h.trim());

  const csvData: CsvRow[] = rows.slice(1).map((row) => {
    return headers.reduce((acc, header, index) => {
      acc[header] = row[index]?.trim() ?? "";
      return acc;
    }, {} as Record<string, string>) as unknown as CsvRow;
  });

  // Filter out empty rows
  const validRows = csvData.filter((r) => r.documento && r.dia);

  // ── Global stats ────────────────────────────────────────────────────────────
  const globalStats: QuestionStats[] = questions.map((q) => {
    const colKey = `pregunta_${q.id}` as keyof CsvRow;
    const values = validRows
      .map((r) => parseInt(r[colKey] as string, 10))
      .filter((v) => !isNaN(v));

    const sum = values.reduce((a, b) => a + b, 0);
    const avg = values.length > 0 ? sum / values.length : 0;

    // Build distribution from all possible values (0-4 to cover extra values in data)
    const allValues = [0, 1, 2, 3, 4];
    const distribution = allValues.map((val) => {
      const count = values.filter((v) => v === val).length;
      const percentage = values.length > 0 ? Math.round((count / values.length) * 100) : 0;
      return { value: val, count, percentage };
    });

    const sectionTitle = sections.find((s) => s.id === q.sectionId)?.title ?? "";

    return {
      questionId: q.id,
      section: sectionTitle,
      text: q.text,
      average: parseFloat(avg.toFixed(1)),
      distribution,
    };
  });

  // ── Per-user responses ───────────────────────────────────────────────────────
  // Group rows by documento
  const byDocumento = new Map<string, CsvRow[]>();
  for (const row of validRows) {
    if (!byDocumento.has(row.documento)) {
      byDocumento.set(row.documento, []);
    }
    byDocumento.get(row.documento)!.push(row);
  }

  const userResponses: UserResponse[] = Array.from(byDocumento.entries()).map(
    ([documento, userRows]) => {
      // Sort by actual date
      const sorted = userRows.sort(sortByDate);
      const days = buildUserDays(sorted);
      return { documento, days };
    }
  );

  return {
    totalResponses: validRows.length,
    totalUsers: byDocumento.size,
    globalStats,
    userResponses,
  };
}