interface HeaderProps {
  progress: number;
}

export default function Header({ progress }: HeaderProps) {
  return (
    <header className="bg-white border-b-2 border-teal px-5 pt-5 pb-4 sticky top-0 z-10">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-8 h-8 bg-teal rounded-lg flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            className="w-[18px] h-[18px] fill-white"
          >
            <path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2zm0 12c5.33 0 8 2.67 8 4v2H4v-2c0-1.33 2.67-4 8-4z" />
          </svg>
        </div>
        <span className="font-serif text-[17px] text-[#1e1e1e]">
          Consultorio Médico
        </span>
      </div>
      <p className="text-xs text-gray-400 pl-[42px]">
        Encuesta de sintomas del paciente
      </p>
      <div className="h-[3px] bg-gray-200 rounded-full mt-3.5 overflow-hidden">
        <div
          className="h-full bg-teal rounded-full transition-all duration-400"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}