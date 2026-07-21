"use client";

import { useEffect, useState } from "react";

interface MenuBarProps {
  onReset: () => void;
  onToggleTerminal: () => void;
  onToggleProfile: () => void;
}

export default function MenuBar({ onReset, onToggleTerminal, onToggleProfile }: MenuBarProps) {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date, timeZone: string) => {
    return new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);
  };

  if (!time) {
    return <div className="h-7 bg-[#1e1e1e]/80 backdrop-blur-md border-b border-black/50 shrink-0"></div>;
  }

  const WorldClocks = () => (
    <>
      <span className="mx-6"><span className="text-white/50">LOCAL (WIB)</span> <span className="text-emerald-400 font-mono">{formatTime(time, "Asia/Jakarta")}</span></span>
      <span className="mx-6"><span className="text-white/50">TOKYO</span> <span className="text-white font-mono">{formatTime(time, "Asia/Tokyo")}</span></span>
      <span className="mx-6"><span className="text-white/50">LONDON</span> <span className="text-white font-mono">{formatTime(time, "Europe/London")}</span></span>
      <span className="mx-6"><span className="text-white/50">NEW YORK</span> <span className="text-white font-mono">{formatTime(time, "America/New_York")}</span></span>
      <span className="mx-6"><span className="text-white/50">SAN FRANCISCO</span> <span className="text-white font-mono">{formatTime(time, "America/Los_Angeles")}</span></span>
    </>
  );

  return (
    <div className="h-7 bg-[#1e1e1e]/80 backdrop-blur-md text-[13px] font-medium flex items-center border-b border-black/50 z-50 relative shrink-0 overflow-hidden">
      
      {/* Kiri: Menu Statis (Sekarang Interaktif) */}
      <div className="flex items-center gap-1 z-10 bg-[#1e1e1e] px-4 h-full shadow-[10px_0_15px_-3px_rgba(30,30,30,1)]">
        <button 
          onClick={onReset}
          className="font-semibold text-emerald-400 px-2 py-0.5 rounded hover:bg-white/10 active:bg-white/20 transition-colors"
        >
          Faza_OS
        </button>
        <button 
          onClick={onToggleTerminal}
          className="hidden sm:inline text-white/80 hover:text-white px-2 py-0.5 rounded hover:bg-white/10 active:bg-white/20 transition-colors"
        >
          Terminal
        </button>
        <button 
          onClick={onToggleProfile}
          className="hidden sm:inline text-white/80 hover:text-white px-2 py-0.5 rounded hover:bg-white/10 active:bg-white/20 transition-colors"
        >
          Network
        </button>
      </div>

      {/* Tengah & Kanan: Running Text */}
      <div className="flex-1 overflow-hidden h-full flex items-center">
        <div className="animate-marquee flex whitespace-nowrap">
          <div><WorldClocks /></div>
          <div><WorldClocks /></div>
        </div>
      </div>

    </div>
  );
}