import type { SurveySubmission } from "./types";

export type SurveyPayload = SurveySubmission;

export type SurveyResponse = {
  ok: boolean;
  message: string;
  error?: string;
};

export async function submitSurvey(payload: SurveyPayload): Promise<SurveyResponse> {
  const url = process.env.NEXT_PUBLIC_SURVEY_API_URL;

  if (!url) {
    throw new Error("NEXT_PUBLIC_SURVEY_API_URL is not defined");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: JSON.stringify(payload),
  });

  const data: SurveyResponse = await response.json();
  return data;
}