import { Question } from "@/lib/mockData";

interface DistributionChartProps {
  question: Question;
  getBarColor: (value: number) => string;
  fullWidth?: boolean;
}

export default function DistributionChart({
  question,
  getBarColor,
  fullWidth = false,
}: DistributionChartProps) {
  const max = Math.max(...question.distribution);

  return (
    <div
      className={`bg-white rounded-xl p-5 shadow-card border border-gray-200 ${
        fullWidth ? "col-span-2" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-[14px] font-medium text-[#1f2937] leading-snug max-w-[80%]">
          {question.text}
        </h3>
        <div className="text-right">
          <p className="text-[22px] font-semibold text-[#1f2937] leading-none">
            {question.average}
          </p>
          <p className="text-[11px] text-gray-400">promedio</p>
        </div>
      </div>

      <div className="space-y-2">
        {question.distribution.map((count, i) => {
          const value = i + 1;
          const pct = max > 0 ? Math.round((count / max) * 100) : 0;
          return (
            <div key={value} className="flex items-center gap-2.5 text-[13px]">
              <span className="w-[22px] text-right text-gray-600 font-medium flex-shrink-0">
                {value}
              </span>
              <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
                <div
                  className="h-full rounded transition-all duration-600"
                  style={{
                    width: `${pct}%`,
                    background: getBarColor(value),
                  }}
                />
              </div>
              <span className="w-[30px] text-right text-gray-400 text-[12px] flex-shrink-0">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}