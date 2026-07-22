"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BIO, SOCIALS } from "@/lib/terminal-data";

interface ProfileWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize?: () => void;
  isMinimized: boolean;
  isExpanded: boolean;
}

export default function ProfileWindow({ onClose, onMinimize, onMaximize, isMinimized, isExpanded }: ProfileWindowProps) {
  const [displayedBio, setDisplayedBio] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < BIO.length) {
        setDisplayedBio(BIO.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 30);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const cursorTimer = setInterval(() => setShowCursor((prev) => !prev), 500);
    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <div className={`transition duration-500 ease-in-out origin-top-left overflow-hidden flex flex-col bg-[#1e1e1e]/95 backdrop-blur-xl border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)] rounded-xl group hover:shadow-[0_0_40px_rgba(16,185,129,0.2)] ${
      isMinimized 
        ? "opacity-0 scale-[0.2] -translate-y-[45vh] -translate-x-[15vw] pointer-events-none absolute resize-none" 
        : "opacity-100 scale-100 translate-y-0 translate-x-0 relative"
    } ${
      isExpanded 
        ? "fixed inset-4 md:inset-10 z-[100] !max-w-none !w-auto !h-auto resize-none" 
        : "w-[90vw] md:w-[400px] min-w-[300px] h-[520px] min-h-[300px] max-h-[85vh] resize"
    }`}>
      
      {/* Title bar */}
      <div className="flex items-center h-10 px-4 bg-[#2b2b2b] border-b border-black/40 shrink-0 select-none cursor-grab active:cursor-grabbing">
        
        <div className="flex items-center gap-2" onPointerDown={(e) => e.stopPropagation()}>
          <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#ff5f57] border border-black/10 hover:brightness-110 active:brightness-90 transition-all"></button>
          <button onClick={onMinimize} className="w-3 h-3 rounded-full bg-[#febc2e] border border-black/10 hover:brightness-110 active:brightness-90 transition-all"></button>
          <button onClick={onMaximize} className="w-3 h-3 rounded-full bg-[#28c840] border border-black/10 hover:brightness-110 active:brightness-90 transition-all"></button>
        </div>
        
        <div className="flex-1 text-center text-[13px] text-white/50 -ml-14 pointer-events-none">
          system — info
        </div>
      </div>

      {/* Konten */}
      <div 
        onPointerDown={(e) => e.stopPropagation()} 
        className={`flex-1 overflow-y-auto p-6 font-mono text-[13px] leading-relaxed text-white/90 flex-col items-center transition-opacity duration-300 ${isMinimized ? 'opacity-0 hidden' : 'opacity-100 flex'}`}
      >
        <div className={`w-24 h-24 shrink-0 rounded-full border-2 border-emerald-400/50 p-1 animate-[bounce_4s_infinite] shadow-[0_0_15px_rgba(52,211,153,0.3)] ${isExpanded ? 'mb-8' : 'mb-4'}`}>
          <div className="w-full h-full rounded-full bg-[#2b2b2b] overflow-hidden flex items-center justify-center relative">
            <Image src="/profile.jpg" alt="Foto Profil Faza" fill className="object-cover" priority />
          </div>
        </div>

        <div className="w-full text-left mb-4">
          <span className="text-emerald-400 font-semibold">root@faza-terminal:</span>
          <span className="text-blue-400">~</span>
          <span className="text-white/50 mr-2">$ cat bio.txt</span>
          <br />
          <p className="mt-2 text-white/80">
            {displayedBio}
            <span className={`inline-block w-[2px] h-4 bg-emerald-400 ml-1 align-middle ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
          </p>
        </div>

        <div className="w-full mt-auto">
           <div className="border-t border-white/10 pt-4">
             <p className="text-white/50 mb-2">Contact :</p>
             <div className={`space-y-2 ${isExpanded ? 'grid grid-cols-2 gap-4 space-y-0' : ''}`}>
               {SOCIALS.map((social) => (
                 <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group/link hover:bg-white/5 p-2 rounded transition-colors">
                   <span className="text-emerald-400 font-semibold group-hover/link:text-emerald-300">{social.label}</span>
                   <span className="text-blue-400 truncate max-w-[180px]">{social.value}</span>
                 </a>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}