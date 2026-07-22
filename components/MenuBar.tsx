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

  // Komponen khusus untuk Running Text (Hanya Jam Luar Negeri)
  const WorldClocks = () => (
    <>
      <span className="mx-6"><span className="text-white/50">SYDNEY</span> <span className="text-white font-mono">{formatTime(time, "Australia/Sydney")}</span></span>
      <span className="mx-6"><span className="text-white/50">TOKYO</span> <span className="text-white font-mono">{formatTime(time, "Asia/Tokyo")}</span></span>
      <span className="mx-6"><span className="text-white/50">SEOUL</span> <span className="text-white font-mono">{formatTime(time, "Asia/Seoul")}</span></span>
      <span className="mx-6"><span className="text-white/50">BEIJING</span> <span className="text-white font-mono">{formatTime(time, "Asia/Shanghai")}</span></span>
      <span className="mx-6"><span className="text-white/50">DUBAI</span> <span className="text-white font-mono">{formatTime(time, "Asia/Dubai")}</span></span>
      <span className="mx-6"><span className="text-white/50">MOSCOW</span> <span className="text-white font-mono">{formatTime(time, "Europe/Moscow")}</span></span>
      <span className="mx-6"><span className="text-white/50">PARIS</span> <span className="text-white font-mono">{formatTime(time, "Europe/Paris")}</span></span>
      <span className="mx-6"><span className="text-white/50">LONDON</span> <span className="text-white font-mono">{formatTime(time, "Europe/London")}</span></span>
      <span className="mx-6"><span className="text-white/50">NEW YORK</span> <span className="text-white font-mono">{formatTime(time, "America/New_York")}</span></span>
      <span className="mx-6"><span className="text-white/50">CHICAGO</span> <span className="text-white font-mono">{formatTime(time, "America/Chicago")}</span></span>
      <span className="mx-6"><span className="text-white/50">LOS ANGELES</span> <span className="text-white font-mono">{formatTime(time, "America/Los_Angeles")}</span></span>
      <span className="mx-6"><span className="text-white/50">HONOLULU</span> <span className="text-white font-mono">{formatTime(time, "Pacific/Honolulu")}</span></span>
    </>
  );

  return (
    <div className="h-7 bg-[#1e1e1e]/80 backdrop-blur-md text-[13px] font-medium flex items-center border-b border-black/50 z-50 relative shrink-0 overflow-hidden">
      
      {/* Kiri: Menu Statis & Jam Indonesia */}
      <div className="flex items-center gap-1 z-10 bg-[#1e1e1e] px-4 h-full shadow-[15px_0_20px_-5px_rgba(30,30,30,1)] shrink-0">
        <button 
          onClick={onReset}
          className="font-semibold text-emerald-400 px-2 py-0.5 rounded hover:bg-white/10 active:bg-white/20 transition-colors"
        >
          Faza_
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

        {/* Garis Pemisah Vertikal */}
        <div className="hidden md:block w-[1px] h-3 bg-white/20 mx-2"></div>

        {/* Jam Indonesia Statis (WIB, WITA, WIT) */}
        <div className="hidden md:flex items-center gap-4 ml-1">
          <span className="flex gap-1.5 items-center">
            <span className="text-white/50 text-[11px] font-bold tracking-wider">WIB</span>
            <span className="text-emerald-400 font-mono">{formatTime(time, "Asia/Jakarta")}</span>
          </span>
          <span className="flex gap-1.5 items-center">
            <span className="text-white/50 text-[11px] font-bold tracking-wider">WITA</span>
            <span className="text-emerald-400 font-mono">{formatTime(time, "Asia/Makassar")}</span>
          </span>
          <span className="flex gap-1.5 items-center">
            <span className="text-white/50 text-[11px] font-bold tracking-wider">WIT</span>
            <span className="text-emerald-400 font-mono">{formatTime(time, "Asia/Jayapura")}</span>
          </span>
        </div>
      </div>

{/* Kanan: Running Text Jam Luar Negeri */}
      <div className="flex-1 overflow-hidden h-full flex items-center">
        <div 
          className="animate-marquee flex whitespace-nowrap"
          style={{ animationDuration: "120s" }} // SEMAKIN BESAR ANGKA INI, SEMAKIN LAMBAT
        >
          <div><WorldClocks /></div>
          <div><WorldClocks /></div>
          <div><WorldClocks /></div>
        </div>
      </div>

    </div>
  );
}