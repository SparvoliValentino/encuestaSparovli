interface ErrorScreenProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorScreen({ message, onRetry }: ErrorScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 py-10 text-center">
      <div className="w-[72px] h-[72px] bg-red-light rounded-full flex items-center justify-center mb-5">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#E24B4A"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-9 h-9"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>
      <h2 className="font-serif text-[26px] text-[#1e1e1e] mb-2.5">
        Algo salió mal
      </h2>
      <p className="text-[15px] text-gray-400 leading-relaxed max-w-[280px] mb-6">
        {message}
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-teal text-white rounded-xl font-medium text-[14px]"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}