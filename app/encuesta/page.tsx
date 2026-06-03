"use client";

import { useState } from "react";
import Header from "@/components/Header";
import QuestionCard from "@/components/QuestionCard";
import SuccessScreen from "@/components/SuccessScreen";
import ErrorScreen from "@/components/ErrorScreen";
import { submitSurvey } from "@/lib/surveyService";
import { questions, sections } from "@/lib/mockData";
import type { SurveySubmission } from "@/lib/types";

function getDia(): number {
  const start = new Date("2026-05-25");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.min(Math.max(diff + 1, 1), 7);
}

const SCALE_EXPLANATION =
  "Se responderá de acuerdo a los siguientes criterios:\n" +
  "• 0 (AUSENTE): Nada.\n" +
  "• 1 (LEVE): Los síntomas son tolerables – el paciente puede hacer sus actividades diarias.\n" +
  "• 2 (MODERADO): Los síntomas son molestos – interfieren parcialmente con la actividad diaria.\n" +
  "• 3 (SEVERO): Los síntomas son intolerables – no es posible realizar las actividades cotidianas.";

function IntroCard() {
  return (
    <div className="bg-white rounded-xl p-5 mb-3 shadow-card border-l-4 border-teal">
      <h2 className="font-serif text-[18px] text-[#1e1e1e] mb-3">
        Escala de evaluación
      </h2>
      <div className="text-[13px] text-gray-600 leading-relaxed whitespace-pre-line">
        {SCALE_EXPLANATION}
      </div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="px-1 mt-5 mb-2">
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
        {title}
      </p>
    </div>
  );
}

export default function EncuestaPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [touched, setTouched] = useState<boolean[]>(
    new Array(questions.length).fill(false)
  );
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const answeredCount = touched.filter((t) => t).length;
  const emailFilled = email.length > 0 ? 1 : 0;
  const total = questions.length + 1;
  const progress = Math.round(((answeredCount + emailFilled) / total) * 100);

  function selectAnswer(index: number, value: number) {
    const newAnswers = [...answers];
    const newTouched = [...touched];
    newAnswers[index] = value;
    newTouched[index] = true;
    setAnswers(newAnswers);
    setTouched(newTouched);
  }

  function validateEmail(e: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  function isValid(): boolean {
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError(true);
      valid = false;
    } else {
      setEmailError(false);
    }

    const firstUntouched = touched.findIndex((t) => !t);
    if (firstUntouched !== -1) {
      valid = false;
    }

    return valid;
  }

  async function handleSubmit() {
    if (!isValid()) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const dia = getDia();
      const payload: SurveySubmission = {
        email,
        dia,
        respuestas: answers as number[],
      };
      const result = await submitSurvey(payload);

      if (result.ok) {
        setSubmitted(true);
      } else {
        setErrorMessage(result.message || "No se pudo guardar la respuesta.");
      }
    } catch {
      setErrorMessage("Error de conexión. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f0f4f3]">
        <Header progress={100} />
        <SuccessScreen />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-[#f0f4f3]">
        <Header progress={progress} />
        <ErrorScreen message={errorMessage} onRetry={() => setErrorMessage(null)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4f3]">
      <Header progress={progress} />

      <main className="px-4 pt-5 pb-0">
        {/* Intro Card */}
        <IntroCard />

        {/* Email Input */}
        <div className="bg-white rounded-xl p-5 mb-3.5 shadow-card">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Tu correo electrónico
          </p>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError(false);
            }}
            placeholder="ejemplo@correo.com"
            autoComplete="email"
            className={`w-full font-sans text-base text-[#1e1e1e] border-2 rounded-lg px-4 py-3 outline-none transition-colors ${
              emailError
                ? "border-red focus:border-red"
                : "border-[#ddd] focus:border-teal"
            }`}
          />
          {emailError && (
            <p className="text-xs text-red mt-1.5">
              Por favor ingresá un email válido.
            </p>
          )}
        </div>

        {/* Section 1: Síntomas Generales */}
        <SectionHeader title={sections[0].title} />
        {questions
          .filter((q) => q.sectionId === 1)
          .map((q, sectionIndex) => (
            <QuestionCard
              key={q.id}
              questionId={sectionIndex + 1}
              totalQuestions={questions.length}
              text={q.text}
              scale={q.scale}
              selectedValue={answers[q.id - 1]}
              onSelect={(val) => selectAnswer(q.id - 1, val)}
            />
          ))}

        {/* Section 2: Síntomas Respiratorios */}
        <SectionHeader title={sections[1].title} />
        {questions
          .filter((q) => q.sectionId === 2)
          .map((q, sectionIndex) => (
            <QuestionCard
              key={q.id}
              questionId={q.id}
              totalQuestions={questions.length}
              text={q.text}
              scale={q.scale}
              selectedValue={answers[q.id - 1]}
              onSelect={(val) => selectAnswer(q.id - 1, val)}
            />
          ))}

        {/* Section 3: Temperatura */}
        <SectionHeader title={sections[2].title} />
        {questions
          .filter((q) => q.sectionId === 3)
          .map((q) => (
            <QuestionCard
              key={q.id}
              questionId={q.id}
              totalQuestions={questions.length}
              text={q.text}
              scale={q.scale}
              selectedValue={answers[q.id - 1]}
              onSelect={(val) => selectAnswer(q.id - 1, val)}
            />
          ))}
      </main>

      {/* Submit */}
      <div className="px-4 mt-2 pb-12">
        <button
          onClick={handleSubmit}
          disabled={loading || !touched.every((t) => t) || email.length === 0}
          className={`w-full py-[15px] rounded-xl font-sans text-base font-semibold transition-all ${
            loading || !touched.every((t) => t) || email.length === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-teal text-white active:scale-[0.98]"
          }`}
        >
          {loading ? "Enviando..." : "Enviar respuestas"}
        </button>
        <p className="text-center text-xs text-gray-400 mt-4 px-5 leading-relaxed">
          Tus respuestas son confidenciales y se utilizan únicamente para
          mejorar nuestro servicio.
        </p>
      </div>
    </div>
  );
}