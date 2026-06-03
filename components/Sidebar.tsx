"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { formatTime } from "@/lib/mockData";

const navItems = [
  {
    label: "Resumen general",
    href: "/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: "Por pregunta",
    href: "/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    label: "Respuestas",
    href: "/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const periodItems = [
  {
    label: "Este mes",
    href: "/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    label: "Últimas 4 semanas",
    href: "/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    setTime(formatTime(new Date()));
  }, []);

  return (
    <aside className="w-[220px] bg-white border-r border-gray-200 flex flex-col fixed top-0 left-0 bottom-0 z-20">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-200">
        <div className="flex items-center gap-2.5 mb-0.5">
          <div className="w-[30px] h-[30px] bg-teal rounded-[7px] flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
              <path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2zm0 12c5.33 0 8 2.67 8 4v2H4v-2c0-1.33 2.67-4 8-4z" />
            </svg>
          </div>
          <span className="font-serif text-[15px] text-[#1f2937] leading-tight">
            Consultorio<br />Médico
          </span>
        </div>
        <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-1 pl-[40px]">
          Panel de encuestas
        </p>
      </div>

      {/* Nav */}
      <nav className="p-3 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-2 mb-1.5">
          Vistas
        </p>
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] mb-0.5 transition-colors ${
              pathname === item.href
                ? "bg-teal-light text-teal-dark font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className="w-4 h-4">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-2 mt-4 mb-1.5">
          Período
        </p>
        {periodItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] text-gray-600 mb-0.5 hover:bg-gray-100 transition-colors"
          >
            <span className="w-4 h-4">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3.5 border-t border-gray-200">
        <p className="text-[11px] text-gray-400 leading-relaxed">
          Última actualización:
          <br />
          <strong>{time || "–"} hs</strong>
        </p>
      </div>
    </aside>
  );
}