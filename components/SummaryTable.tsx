import { Question, getScoreClass, getScoreLabel } from "@/lib/mockData";

interface SummaryTableProps {
  questions: Question[];
  getBarColor: (value: number) => string;
}

export default function SummaryTable({ questions, getBarColor }: SummaryTableProps) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 pb-2.5 px-5 w-11">
            #
          </th>
          <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 pb-2.5">
            Pregunta
          </th>
          <th className="text-center text-[11px] font-semibold uppercase tracking-wide text-gray-400 pb-2.5 w-20">
            Promedio
          </th>
          <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 pb-2.5 w-40">
            Distribución
          </th>
          <th className="text-center text-[11px] font-semibold uppercase tracking-wide text-gray-400 pb-2.5 w-[90px]">
            Calificación
          </th>
        </tr>
      </thead>
      <tbody>
        {questions.map((q) => {
          const pct = Math.round((q.average / 10) * 100);
          return (
            <tr
              key={q.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-5 py-3 text-[13px] text-gray-400">{q.id}</td>
              <td className="py-3 text-[13.5px] text-[#1f2937]">
                {q.shortName}
              </td>
              <td className="py-3 text-center">
                <span className="font-semibold text-[15px] text-[#1f2937]">
                  {q.average.toFixed(1)}
                </span>
                <span className="text-[11px] text-gray-400">/10</span>
              </td>
              <td className="py-3">
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden w-[120px]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: getBarColor(Math.round(q.average)),
                    }}
                  />
                </div>
              </td>
              <td className="py-3 text-center">
                <span
                  className={`inline-flex items-center justify-center w-[34px] h-[34px] rounded-lg font-semibold text-[14px] ${getScoreClass(
                    q.average
                  )}`}
                >
                  {getScoreLabel(q.average)}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}