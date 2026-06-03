import type { ScaleOption } from "@/lib/types";

interface QuestionCardProps {
  questionId: number;
  totalQuestions: number;
  text: string;
  scale: ScaleOption[];
  selectedValue: number | null;
  onSelect: (value: number) => void;
}

export default function QuestionCard({
  questionId,
  totalQuestions,
  text,
  scale,
  selectedValue,
  onSelect,
}: QuestionCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 mb-3 shadow-card">
      <p className="text-[11px] font-semibold text-teal uppercase tracking-wide mb-1.5">
        Pregunta {questionId} de {totalQuestions}
      </p>
      <p className="text-[15px] text-[#1e1e1e] leading-relaxed mb-4">{text}</p>

      {/* Segmented option buttons */}
      <div className="flex gap-2">
        {scale.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
              className="flex-1 py-2.5 rounded-lg text-[11px] font-semibold border-2 transition-all active:scale-95"
              style={
                isSelected
                  ? {
                      backgroundColor: option.color,
                      borderColor: option.color,
                      color: "#fff",
                    }
                  : {
                      backgroundColor: "transparent",
                      borderColor: "#e5e7eb",
                      color: option.color,
                    }
              }
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}