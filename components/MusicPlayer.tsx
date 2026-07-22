"use client";

import { useState, useRef, useEffect } from "react";

// Daftar playlist kustom Faza
const PLAYLIST = [
  { title: "airplane thoughts", artist: "Dhruv", youtubeId: "DMmDSv-IIjQ" },
  { title: "no song without you", artist: "HONNE", youtubeId: "WXOlNBDVt0o" },
  { title: "BYE", artist: "Jaden", youtubeId: "1pBiCChscGY" },
  { title: "Fiction", artist: "Lund", youtubeId: "Nqcj292A1ic" },
  { title: "Love Yourself", artist: "Justin Bieber", youtubeId: "oyEuk8j8imI" },
  { title: "always, i’ll care", artist: "Jeremy Zucker", youtubeId: "N6SQ9QoSjCI" },
  { title: "death bed", artist: "Powfu (feat. Beabadoobee)", youtubeId: "hNqdxGsbQsA" },
  { title: "i'm just a ghost", artist: "yaeow", youtubeId: "oUfgV5CMUFM" },
  { title: "drunk", artist: "keshi", youtubeId: "4HLumkaPcCI" },
  { title: "Feelings", artist: "Ollie", youtubeId: "qkwPmJ9hIDk" },
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const playerRef = useRef<any>(null);

  // Load YouTube API
  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    (window as any).onYouTubeIframeAPIReady = () => {
      playerRef.current = new (window as any).YT.Player("youtube-audio-player", {
        height: "0",
        width: "0",
        videoId: PLAYLIST[currentTrack].youtubeId,
        playerVars: { autoplay: 0, controls: 0 },
        events: {
          onStateChange: (event: any) => {
            if (event.data === 1) setIsPlaying(true);
            if (event.data === 2) setIsPlaying(false);
          },
        },
      });
    };
  }, []);

  // FUNGSI KONTROL MUSIK
  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    const nextIndex = (currentTrack + 1) % PLAYLIST.length;
    setCurrentTrack(nextIndex);
    if (playerRef.current) {
      playerRef.current.loadVideoById(PLAYLIST[nextIndex].youtubeId);
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) playerRef.current.unMute();
    else playerRef.current.mute();
    setIsMuted(!isMuted);
  };

  // FITUR BARU: MENDENGARKAN PERINTAH DARI TERMINAL
  useEffect(() => {
    const handleTerminalCommand = (e: Event) => {
      const customEvent = e as CustomEvent;
      const action = customEvent.detail?.action;
      
      if (action === "play" || action === "toggle") togglePlay();
      else if (action === "next") nextTrack();
      else if (action === "mute") toggleMute();
    };

    window.addEventListener("terminal-music", handleTerminalCommand);
    return () => window.removeEventListener("terminal-music", handleTerminalCommand);
  }, [isPlaying, isMuted, currentTrack]); // Dependency ini penting agar state selalu sinkron

  return (
    <div className="fixed top-10 right-4 z-40 bg-[#1e1e1e]/80 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-2xl text-white font-mono flex items-center gap-3 text-xs select-none">
      <div id="youtube-audio-player" className="absolute w-0 h-0 opacity-0 pointer-events-none -z-50"></div>

      <div className={`w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center shrink-0 ${isPlaying ? "animate-spin" : ""}`}>
        🎵
      </div>

      <div className="flex flex-col max-w-[120px] truncate">
        <span className="font-semibold truncate">{PLAYLIST[currentTrack].title}</span>
        <span className="text-white/50 text-[10px] truncate">{PLAYLIST[currentTrack].artist}</span>
      </div>

      <div className="flex items-center gap-2 ml-1">
        <button onClick={togglePlay} className="w-7 h-7 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-full flex items-center justify-center transition-all">
          {isPlaying ? "❚❚" : "▶"}
        </button>
        <button onClick={nextTrack} className="w-7 h-7 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-full flex items-center justify-center transition-all" title="Next Track">
          ⏭
        </button>
        <button onClick={toggleMute} className="text-white/60 hover:text-white text-xs ml-1">
          {isMuted ? "🔇" : "🔊"}
        </button>
      </div>
    </div>
  );
}