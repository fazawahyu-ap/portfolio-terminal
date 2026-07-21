"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import MenuBar from "@/components/MenuBar";
import TerminalWindow from "@/components/TerminalWindow";
import ProfileWindow from "@/components/ProfileWindow";
import AlertDialog from "@/components/AlertDialog";
import TickerBar from "@/components/TickerBar";

const MOBILE_BREAKPOINT = 768;

export default function Desktop() {
  const [isMobile, setIsMobile] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);

  const [isProfileOpen, setIsProfileOpen] = useState(true);
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);
  const [isProfileMinimized, setIsProfileMinimized] = useState(false);
  const [isTerminalMinimized, setIsTerminalMinimized] = useState(false);

  const [activeWindow, setActiveWindow] = useState<"profile" | "terminal">("terminal");
  const constraintsRef = useRef(null);
  
  // Ref untuk memaksa video berjalan (mengatasi stuck/freeze)
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const checkViewport = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkViewport();
    window.addEventListener("resize", checkViewport);
    
    // Paksa video autoplay saat website pertama dimuat
    if (videoRef.current) {
      videoRef.current.play().catch(err => console.log("Autoplay dicegah oleh browser:", err));
    }

    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  const showAlert = isMobile && !alertDismissed;

  const restoreWindows = () => {
    setIsProfileOpen(true);
    setIsTerminalOpen(true);
    setIsProfileMinimized(false);
    setIsTerminalMinimized(false);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/wallpaper.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      {/* Melempar fungsi dari Desktop ke MenuBar */}
      <MenuBar 
        onReset={restoreWindows} 
        onToggleTerminal={() => setIsTerminalOpen(!isTerminalOpen)}
        onToggleProfile={() => setIsProfileOpen(!isProfileOpen)}
      />

      <div
        ref={constraintsRef}
        className={`relative z-10 w-full h-[calc(100vh-28px)] flex flex-col md:flex-row items-center justify-center gap-6 px-8 pt-4 pb-12 overflow-hidden transition-all duration-500 ${
          showAlert ? "pointer-events-none" : ""
        }`}
        aria-hidden={showAlert}
      >
        {isProfileOpen && (
          <motion.div
            drag
            dragConstraints={constraintsRef}
            dragMomentum={false}
            onPointerDownCapture={() => setActiveWindow("profile")} /* Ubah ke onPointerDownCapture */
            style={{ zIndex: activeWindow === "profile" ? 30 : 20 }}
            className={`absolute md:relative cursor-auto transition-all duration-500 ease-in-out flex justify-center ${isTerminalOpen ? 'w-full max-w-sm shrink-0' : 'w-full max-w-2xl'}`}
          >
            <ProfileWindow 
              onClose={() => setIsProfileOpen(false)}
              onMinimize={() => setIsProfileMinimized(!isProfileMinimized)}
              isMinimized={isProfileMinimized}
              isExpanded={!isTerminalOpen}
            />
          </motion.div>
        )}
        
        {isTerminalOpen && (
          <motion.div
            drag
            dragConstraints={constraintsRef}
            dragMomentum={false}
            onPointerDownCapture={() => setActiveWindow("terminal")} /* Ubah ke onPointerDownCapture */
            style={{ zIndex: activeWindow === "terminal" ? 30 : 20 }}
            className={`absolute md:relative cursor-auto transition-all duration-500 ease-in-out flex justify-center ${isProfileOpen ? 'w-full max-w-3xl flex-1' : 'w-full max-w-5xl'}`}
          >
            <TerminalWindow 
              onClose={() => setIsTerminalOpen(false)}
              onMinimize={() => setIsTerminalMinimized(!isTerminalMinimized)}
              isMinimized={isTerminalMinimized}
              isExpanded={!isProfileOpen}
            />
          </motion.div>
        )}

        {!isProfileOpen && !isTerminalOpen && (
          <button 
            onClick={restoreWindows}
            className="px-6 py-3 bg-[#1e1e1e]/80 text-emerald-400 font-mono text-sm border border-emerald-500/30 rounded-xl backdrop-blur-md hover:bg-[#2b2b2b] transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] animate-pulse absolute z-50"
          >
            $ system_halted --click_to_restore
          </button>
        )}
      </div>

      {showAlert && <AlertDialog onAcknowledge={() => setAlertDismissed(true)} />}
      <TickerBar />
    </main>
  );
}