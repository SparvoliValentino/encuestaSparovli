interface TopBarProps {
  title: string;
  date: string;
}

export default function TopBar({ title, date }: TopBarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-7 h-14 flex items-center justify-between sticky top-0 z-10">
      <h1 className="font-serif text-lg text-[#1f2937]">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
          {date}
        </span>
        <button
          onClick={() => { 
            window.open(process.env.NEXT_PUBLIC_SURVEY_SHEET_CSV_URL, "_blank");
          }}
          className="text-[13px] font-medium text-teal-dark bg-teal-light px-3.5 py-1.5 rounded-lg hover:bg-teal-mid/30 transition-colors">
          Ver Excel
        </button>
      </div>
    </div>
  );
}