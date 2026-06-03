"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import StatCard from "@/components/StatCard";
import { fetchDashboard } from "@/lib/dashboardService";
import { formatDate } from "@/lib/mockData";
import type { DashboardData, QuestionStats, UserResponse } from "@/lib/types";

function getBarColor(v: number) {
  if (v === 0) return "#1D9E75";
  if (v === 1) return "#5DCAA5";
  if (v === 2) return "#EF9F27";
  return "#E24B4A";
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const today = new Date();

  useEffect(() => {
    fetchDashboard()
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudieron cargar los datos.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 ml-[220px] flex items-center justify-center">
          <p className="text-gray-400">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 ml-[220px] flex items-center justify-center">
          <p className="text-red">{error ?? "Error desconocido."}</p>
        </div>
      </div>
    );
  }

  const globalStats = data.globalStats;
  const preguntasGenerales = globalStats.filter((s) => s.section === "Síntomas Generales");
  const preguntasRespiratorios = globalStats.filter((s) => s.section === "Síntomas Respiratorios");
  const preguntaTemperatura = globalStats.find((s) => s.section === "Temperatura");

  const avgGeneral =
    preguntasGenerales.length + preguntasRespiratorios.length > 0
      ? (
          [...preguntasGenerales, ...preguntasRespiratorios].reduce(
            (sum, q) => sum + q.average,
            0
          ) /
          (preguntasGenerales.length + preguntasRespiratorios.length)
        ).toFixed(1)
      : "–";

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 ml-[220px] flex flex-col min-h-screen">
        <TopBar
          title={`Resultados — ${formatDate(today).split(" ").slice(1).join(" ")}`}
          date={formatDate(today)}
        />

        <div className="p-6 lg:p-7 pb-10">
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-3.5 mb-5">
            <StatCard
              label="Respuestas totales"
              value={data.totalResponses}
              subtitle="Registradas"
              pill={{
                text: `${data.totalUsers} paciente${data.totalUsers !== 1 ? "s" : ""}`,
                className: "bg-teal-light text-teal-dark",
              }}
            />
            <StatCard
              label="Severidad promedio"
              value={avgGeneral}
              subtitle="Escala 0 – 3"
              pill={{
                text: "Síntomas Generales + Respiratorios",
                className: "bg-amber-light text-amber",
              }}
            />
            <StatCard
              label="Síntomas Generales"
              value={preguntasGenerales.length}
              subtitle="3 preguntas"
              pill={{
                text: "Sección 1",
                className: "bg-red-light text-red",
              }}
              smallValue
            />
            <StatCard
              label="Síntomas Respiratorios"
              value={preguntasRespiratorios.length}
              subtitle="3 preguntas"
              pill={{
                text: "Sección 2",
                className: "bg-teal-light text-teal-dark",
              }}
              smallValue
            />
          </div>

          {/* Síntomas Generales */}
          {preguntasGenerales.length > 0 && (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-3">
                Síntomas Generales
              </p>
              <div className="grid grid-cols-3 gap-4 mb-5">
                {preguntasGenerales.map((q: QuestionStats) => (
                  <DashboardStatCard key={q.questionId} stats={q} />
                ))}
              </div>
            </>
          )}

          {/* Síntomas Respiratorios */}
          {preguntasRespiratorios.length > 0 && (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-3">
                Síntomas Respiratorios
              </p>
              <div className="grid grid-cols-3 gap-4 mb-5">
                {preguntasRespiratorios.map((q: QuestionStats) => (
                  <DashboardStatCard key={q.questionId} stats={q} />
                ))}
              </div>
            </>
          )}

          {/* Temperatura */}
          {preguntaTemperatura && (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-3">
                Temperatura
              </p>
              <div className="grid grid-cols-3 gap-4 mb-5">
                <DashboardStatCard stats={preguntaTemperatura} />
              </div>
            </>
          )}

          {/* Per-user list */}
          {data.userResponses.length > 0 && (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mt-6 mb-3">
                Pacientes
              </p>
              <div className="grid grid-cols-3 gap-3">
                {data.userResponses.map((user) => {
                  const answeredDays = user.days.filter((d) => !d.missed).length;
                  const missedDays = user.days.filter((d) => d.missed).length;
                  return (
                    <button
                      key={user.email}
                      onClick={() => setSelectedUser(user)}
                      className="bg-white rounded-xl p-4 shadow-card text-left hover:shadow-card-hover transition-shadow cursor-pointer"
                    >
                      <p className="text-[13px] font-semibold text-[#1e1e1e] mb-1 truncate">
                        {user.email}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {answeredDays} día{answeredDays !== 1 ? "s" : ""} respondido
                        {missedDays > 0 && ` · ${missedDays} sin respuesta`}
                      </p>
                      {/* Mini timeline */}
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {user.days.map((day) => (
                          <div
                            key={day.userDia}
                            className={`w-3 h-3 rounded-full ${
                              day.missed
                                ? "bg-gray-200"
                                : "bg-teal"
                            }`}
                            title={`Día ${day.userDia}${day.missed ? " — sin respuesta" : ""}`}
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* User detail modal */}
      {selectedUser && (
        <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}

function DashboardStatCard({ stats }: { stats: QuestionStats }) {
  const max = Math.max(...stats.distribution.map((d) => d.count));

  return (
    <div className="bg-white rounded-xl p-4 shadow-card">
      <p className="text-[12px] text-gray-600 leading-snug mb-2">{stats.text}</p>
      <p className="text-[20px] font-semibold text-[#1f2937] mb-1">
        {stats.average.toFixed(1)}
      </p>
      <div className="space-y-1">
        {stats.distribution.map((d) => {
          const pct = max > 0 ? Math.round((d.count / max) * 100) : 0;
          return (
            <div key={d.value} className="flex items-center gap-2 text-[11px]">
              <span className="w-4 text-right text-gray-500">{d.value}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, background: getBarColor(d.value) }}
                />
              </div>
              <span className="w-6 text-right text-gray-400">{d.count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UserModal({ user, onClose }: { user: UserResponse; onClose: () => void }) {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-[#f0f4f3] rounded-2xl w-[90vw] max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="font-serif text-[18px] text-[#1e1e1e]">{user.email}</h2>
            <p className="text-[12px] text-gray-400">
              {user.days.filter((d) => !d.missed).length} días respondidos ·{" "}
              {user.days.filter((d) => d.missed).length} sin respuesta
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Days grid */}
        <div className="p-6 grid grid-cols-3 gap-4">
          {user.days.map((day) => {
            if (day.missed) {
              return (
                <div
                  key={day.userDia}
                  className="bg-white rounded-xl p-4 shadow-card border-2 border-dashed border-gray-200 opacity-60"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                      Día {day.userDia}
                    </p>
                    <span className="text-[10px] text-gray-400">{day.fecha}</span>
                  </div>
                  <p className="text-[13px] text-gray-400 italic text-center py-4">
                    No respondió
                  </p>
                </div>
              );
            }

            return (
              <div key={day.userDia} className="bg-white rounded-xl p-4 shadow-card">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-semibold text-teal uppercase tracking-wide">
                    Día {day.userDia}
                  </p>
                  <span className="text-[10px] text-gray-400">{day.fecha}</span>
                </div>

                <div className="space-y-2">
                  {day.respuestas.map((value, qIdx) => {
                    const qId = qIdx + 1;
                    const section =
                      qId <= 3
                        ? "Síntomas Generales"
                        : qId <= 6
                        ? "Síntomas Respiratorios"
                        : "Temperatura";
                    const qTexts = [
                      "¿Cuánta cefalea sintió?",
                      "¿Cuánto dolor muscular?",
                      "¿Cuánta fatiga?",
                      "¿Cuánta tos?",
                      "¿Dolor de garganta?",
                      "¿Congestión nasal?",
                      "Temperatura corporal",
                    ];
                    return (
                      <div key={qId} className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: getBarColor(value) }}
                        />
                        <span className="text-[11px] text-gray-600 flex-1 leading-tight">
                          {qTexts[qIdx]}
                        </span>
                        <span
                          className="text-[11px] font-semibold"
                          style={{ color: getBarColor(value) }}
                        >
                          {value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}