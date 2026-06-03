interface StatCardProps {
  label: string;
  value: string | number;
  subtitle: string;
  pill: {
    text: string;
    className: string;
  };
  smallValue?: boolean;
}

export default function StatCard({
  label,
  value,
  subtitle,
  pill,
  smallValue = false,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-card border border-gray-200">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
        {label}
      </p>
      <p
        className={`font-semibold text-[#1f2937] leading-none mb-1 ${
          smallValue ? "text-[18px] leading-[1.3]" : "text-[28px]"
        }`}
      >
        {value}
      </p>
      <p className="text-xs text-gray-400 mb-2">{subtitle}</p>
      <span
        className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${pill.className}`}
      >
        {pill.text}
      </span>
    </div>
  );
}