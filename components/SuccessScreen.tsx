export default function SuccessScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 py-10 text-center">
      <div className="w-[72px] h-[72px] bg-teal-light rounded-full flex items-center justify-center mb-5">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1D9E75"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-9 h-9"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 className="font-serif text-[26px] text-[#1e1e1e] mb-2.5">
        ¡Muchas gracias!
      </h2>
      <p className="text-[15px] text-gray-400 leading-relaxed max-w-[280px]">
        Tu respuesta fue registrada. Tu opinión nos ayuda a mejorar la atención
        cada día.
      </p>
    </div>
  );
}