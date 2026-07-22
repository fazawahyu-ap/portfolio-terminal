"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  COMMAND_LIST,
  PROJECTS,
  SOCIALS,
  MEDIA,
  BIO,
  EXPERIENCE,
  CERTIFICATIONS,
} from "@/lib/terminal-data";

interface HistoryLine {
  id: number;
  type: "input" | "output";
  content: ReactNode;
}

interface TerminalWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize?: () => void; // Prop baru untuk tombol hijau
  isMinimized: boolean;
  isExpanded: boolean;
}

const PROMPT_USER = "root@faza-terminal";

const WELCOME_MESSAGE: ReactNode = (
  <div className="space-y-1">
    <p>Welcome. This is an interactive portfolio terminal.</p>
    <p>
      Type{" "}
      <span className="text-emerald-400 font-semibold">help</span> to see
      available commands.
    </p>
  </div>
);

// --- [ BAGIAN RENDER FUNCTIONS STATIS ] ---

function renderHelp(): ReactNode {
  return (
    <div className="space-y-1">
      <p className="text-white/70">Available commands:</p>
      <ul className="pl-4">
        <li><span className="text-emerald-400 font-semibold w-24 inline-block">help</span> <span className="text-white/60">— show this list</span></li>
        <li><span className="text-emerald-400 font-semibold w-24 inline-block">whoami</span> <span className="text-white/60">— short bio</span></li>
        <li><span className="text-emerald-400 font-semibold w-24 inline-block">projects</span> <span className="text-white/60">— recent work</span></li>
        <li><span className="text-emerald-400 font-semibold w-24 inline-block">experience</span> <span className="text-white/60">— work experience</span></li>
        <li><span className="text-emerald-400 font-semibold w-24 inline-block">certifications</span><span className="text-white/60">— achievements</span></li>
        <li><span className="text-emerald-400 font-semibold w-24 inline-block">socials</span> <span className="text-white/60">— contact links</span></li>
        <li><span className="text-emerald-400 font-semibold w-24 inline-block">media</span> <span className="text-white/60">— currently on Spotify/Letterboxd</span></li>
        <li><span className="text-emerald-400 font-semibold w-24 inline-block">cv</span> <span className="text-white/60">— download my resume/CV</span></li>
        
        <li className="mt-3 mb-1 text-white/40 text-[11px] uppercase tracking-wider border-b border-white/10 pb-1 w-max">--- Live API Integrations ---</li>
        <li><span className="text-emerald-400 font-semibold w-24 inline-block">network-scan</span> <span className="text-white/60">— run IP geolocation scan</span></li>
        <li><span className="text-emerald-400 font-semibold w-24 inline-block">github</span> <span className="text-white/60">— fetch latest public repos</span></li>
        <li><span className="text-emerald-400 font-semibold w-24 inline-block">weather</span> <span className="text-white/60">— meteorological data</span></li>
        <li><span className="text-emerald-400 font-semibold w-24 inline-block">crypto</span> <span className="text-white/60">— live cryptocurrency market prices</span></li>
        <li><span className="text-emerald-400 font-semibold w-24 inline-block">joke</span> <span className="text-white/60">— print a random programming joke</span></li>
        <li><span className="text-emerald-400 font-semibold w-24 inline-block">vercel</span> <span className="text-white/60">— live deployment status</span></li>
        
        <li className="mt-2"><span className="text-emerald-400 font-semibold w-24 inline-block">clear</span> <span className="text-white/60">— clear screen</span></li>
      </ul>
    </div>
  );
}

function renderWhoami(): ReactNode { return <p>{BIO}</p>; }
function renderProjects(): ReactNode {
  return (
    <div className="space-y-3">
      {PROJECTS.map((project) => (
        <div key={project.name}>
          <p className="text-emerald-400 font-semibold">{project.name}</p>
          <p className="text-white/80">{project.description}</p>
          {project.url ? (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-[12px] hover:underline">
              [Link: {project.url}]
            </a>
          ) : null}
          <p className="text-white/50 text-[12px]">stack: {project.stack}</p>
        </div>
      ))}
    </div>
  );
}
function renderExperience(): ReactNode {
  return (
    <div className="space-y-3">
      {EXPERIENCE.map((exp, index) => (
        <div key={index}>
          <p className="text-emerald-400 font-semibold">{exp.company}</p>
          <p className="text-white/80">{exp.role}</p>
          <p className="text-white/50 text-[12px]">{exp.period}</p>
        </div>
      ))}
    </div>
  );
}
function renderCertifications(): ReactNode {
  return (
    <div className="space-y-1">
      <ul className="list-disc pl-4 text-white/90 marker:text-emerald-400">
        {CERTIFICATIONS.map((cert, index) => <li key={index}>{cert}</li>)}
      </ul>
    </div>
  );
}
function renderSocials(): ReactNode {
  return (
    <div className="space-y-1">
      {SOCIALS.map((social) => (
        <p key={social.label}>
          <span className="text-emerald-400 font-semibold w-24 inline-block">{social.label}:</span>{" "}
          <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{social.value}</a>
        </p>
      ))}
    </div>
  );
}
function renderMedia(): ReactNode {
  return (
    <div className="space-y-1">
      {MEDIA.map((item) => (
        <p key={item.label}>
          <span className="text-emerald-400 font-semibold w-24 inline-block">{item.label}:</span>{" "}
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{item.value}</a>
        </p>
      ))}
    </div>
  );
}

// --- [ KOMPONEN LIVE API INTEGRATION ] ---

function NetworkScanOutput() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse text-[#febc2e]">Scanning network perimeter...</div>;
  if (!data || data.error) return <div className="text-[#ff5f57]">Scan failed. Connection blocked by firewall.</div>;

  return (
    <div className="space-y-1 text-white/80 border border-white/10 p-3 rounded bg-black/20">
      <p><span className="text-emerald-400">IP Address:</span> {data.ip}</p>
      <p><span className="text-emerald-400">Location:</span> {data.city}, {data.region}, {data.country_name}</p>
      <p><span className="text-emerald-400">ISP / ASN:</span> {data.org}</p>
      <p className="text-blue-400 mt-2 text-[11px] uppercase tracking-wider animate-pulse">Target acquired. Access logged.</p>
    </div>
  );
}

function GitHubOutput() {
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.github.com/users/fazawahyu-ap/repos?sort=updated&per_page=6")
      .then(res => res.json())
      .then(d => {
        if (Array.isArray(d)) setRepos(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse text-[#febc2e]">Fetching live repositories from GitHub...</div>;
  if (repos.length === 0) return <div className="text-[#ff5f57]">No public repositories found or API limit reached.</div>;

  return (
    <div className="space-y-4">
      <p className="text-white/50 mb-2 border-b border-white/10 pb-1">Live GitHub Data (fazawahyu-ap):</p>
      {repos.map(repo => (
        <div key={repo.id} className="pl-2 border-l-2 border-emerald-500/30">
          <p className="text-emerald-400 font-semibold">{repo.name}</p>
          <p className="text-white/70 text-[12px]">{repo.description || "No description provided."}</p>
          <p className="text-white/40 text-[11px] mt-1">
            Language: {repo.language || "Mixed"} • Stars: {repo.stargazers_count}
          </p>
          <div className="flex gap-3 mt-1">
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-[12px] hover:underline">
              [git clone]
            </a>
            {repo.homepage && repo.homepage.trim() !== "" && (
              <a 
                href={repo.homepage.startsWith('http') ? repo.homepage : `https://${repo.homepage}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-emerald-400 text-[12px] hover:underline"
              >
                [Live Demo]
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function WeatherOutput() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=-6.8948&longitude=110.6386&current_weather=true")
      .then(res => res.json())
      .then(d => { setWeather(d.current_weather); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse text-[#febc2e]">Establishing satellite link to meteorology station...</div>;
  if (!weather) return <div className="text-[#ff5f57]">Failed to fetch weather data. Connection blocked.</div>;

  return (
    <div className="space-y-1">
      <p className="text-emerald-400 font-semibold">Live Meteorological Data (Demak):</p>
      <div className="text-white/90 font-mono bg-white/5 p-3 rounded inline-block border border-white/10">
        <p>Temperature : <span className="text-emerald-400">{weather.temperature}°C</span></p>
        <p>Wind Speed  : <span className="text-blue-400">{weather.windspeed} km/h</span></p>
      </div>
    </div>
  );
}

function CryptoOutput() {
  const [coins, setCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.coinlore.net/api/tickers/?limit=5")
      .then(res => res.json())
      .then(data => { setCoins(data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse text-[#febc2e]">Connecting to secure crypto exchange API...</div>;
  if (!coins.length) return <div className="text-[#ff5f57]">Failed to fetch market data. Network blocked.</div>;

  return (
    <div className="space-y-1">
      <p className="text-white/50 mb-2 border-b border-white/10 pb-1">Live Cryptocurrency Market (USD):</p>
      {coins.map((coin) => {
        const price = parseFloat(coin.price_usd).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        const change = parseFloat(coin.percent_change_24h);
        const isUp = change >= 0;
        return (
          <div key={coin.id} className="flex gap-4">
            <span className="text-emerald-400 font-semibold w-12">{coin.symbol}</span>
            <span className="text-white w-24">{price}</span>
            <span className={isUp ? "text-[#28c840]" : "text-[#ff5f57]"}>
              {isUp ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

function JokeOutput() {
  const [joke, setJoke] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit")
      .then(res => res.json())
      .then(data => {
        if (data.type === "single") {
          setJoke(data.joke);
        } else {
          setJoke(`${data.setup}\n\n${data.delivery}`);
        }
        setLoading(false);
      })
      .catch(() => {
        setJoke("Failed to fetch joke. The server is not laughing.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="animate-pulse text-[#febc2e]">Compiling humor...</div>;
  return (
    <div>
      <p className="text-white/50 mb-2 border-b border-white/10 pb-1">System Humor Protocol:</p>
      <div className="whitespace-pre-wrap text-emerald-300 italic">{joke}</div>
    </div>
  );
}

function VercelOutput() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/vercel")
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        if (data.projects) setProjects(data.projects);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="animate-pulse text-[#febc2e]">Authenticating and fetching Vercel projects...</div>;
  if (error) return <div className="text-[#ff5f57]">Fetch Failed: {error}</div>;
  if (projects.length === 0) return <div className="text-white/50">No projects found.</div>;

  return (
    <div className="space-y-4">
      <p className="text-white/50 mb-2 border-b border-white/10 pb-1">Live Vercel Projects:</p>
      {projects.map((proj) => {
        const latestDep = proj.latestDeployments?.[0];
        const state = latestDep?.readyState || "UNKNOWN";
        const url = latestDep?.url || "";

        let statusColor = "text-white/70";
        if (state === "READY") statusColor = "text-[#28c840]"; 
        if (state === "ERROR") statusColor = "text-[#ff5f57]"; 
        if (state === "BUILDING" || state === "QUEUED") statusColor = "text-[#febc2e] animate-pulse"; 

        return (
          <div key={proj.id} className="pl-2 border-l-2 border-white/20 mb-2">
            <p className="text-emerald-400 font-semibold">{proj.name}</p>
            <p className="text-[12px]">
              Status: <span className={`${statusColor} font-bold`}>{state}</span> 
              {proj.framework && <span className="text-white/40 ml-2">({proj.framework})</span>}
            </p>
            {url && (
              <a 
                href={`https://${url}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-400 text-[12px] hover:underline mt-1 inline-block"
              >
                [Visit Deployment]
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}

// --- [ KOMPONEN UTAMA TERMINAL ] ---

export default function TerminalWindow({ onClose, onMinimize, onMaximize, isMinimized, isExpanded }: TerminalWindowProps) {
  const [history, setHistory] = useState<HistoryLine[]>([
    { id: 0, type: "output", content: WELCOME_MESSAGE },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [commandLog, setCommandLog] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState<number | null>(null);
  
  const [activeLocation, setActiveLocation] = useState<string>("~");

  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(1);

  const LOCAL_COMMAND_LIST = [
    ...COMMAND_LIST, 
    "cv", 
    "network-scan", 
    "github", 
    "weather", 
    "crypto", 
    "joke",
    "vercel"
  ];

  useEffect(() => {
    if (!isMinimized) inputRef.current?.focus();
  }, [isMinimized]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [history]);

  const focusInput = () => {
    if (!isMinimized) inputRef.current?.focus();
  };

  const pushLine = (line: Omit<HistoryLine, "id">) => {
    setHistory((prev) => [...prev, { id: idCounter.current++, ...line }]);
  };

  const runCommand = (raw: string) => {
    const trimmed = raw.trim();
    const command = trimmed.toLowerCase();
    
    const currentPromptPath = activeLocation; 

    pushLine({
      type: "input",
      content: (
        <span>
          <span className="text-emerald-400">{PROMPT_USER}</span>
          <span className="text-white/50">:</span>
          <span className="text-blue-400">{currentPromptPath}</span>
          <span className="text-white/50">$ </span>
          <span className="text-white">{raw}</span>
        </span>
      ),
    });

    if (command === "") return;
    if (command === "clear") { 
      setHistory([]); 
      setActiveLocation("~"); 
      return; 
    }

    let output: ReactNode;
    switch (command) {
      case "help": output = renderHelp(); break;
      case "whoami": output = renderWhoami(); break;
      case "projects": output = renderProjects(); break;
      case "experience": output = renderExperience(); break;
      case "certifications": output = renderCertifications(); break;
      case "socials": output = renderSocials(); break;
      case "media": output = renderMedia(); break;
      
      case "cv": 
        output = <div className="text-blue-400 font-semibold animate-pulse">Initiating download: cv.pdf...</div>;
        window.open('/cv.pdf', '_blank');
        break;

      case "network-scan": 
        output = <NetworkScanOutput />; 
        setActiveLocation("~/network-scan"); 
        break;
      case "github": 
        output = <GitHubOutput />; 
        setActiveLocation("~/github"); 
        break;
      case "weather": 
        output = <WeatherOutput />; 
        setActiveLocation("~/weather"); 
        break;
      case "crypto": 
        output = <CryptoOutput />; 
        setActiveLocation("~/crypto"); 
        break;
      case "joke": 
        output = <JokeOutput />; 
        setActiveLocation("~/joke"); 
        break;
      case "vercel": 
        output = <VercelOutput />; 
        setActiveLocation("~/vercel"); 
        break;
      
      default:
        output = (
          <p className="text-[#ff5f57]">
            command not found: {trimmed}. Type <span className="text-emerald-400">help</span> for a list of commands.
          </p>
        );
    }
    pushLine({ type: "output", content: output });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const currentInput = inputValue.trim().toLowerCase();
      if (!currentInput) return;

      const matchedCommand = LOCAL_COMMAND_LIST.find((cmd) =>
        cmd.startsWith(currentInput)
      );

      if (matchedCommand) {
        setInputValue(matchedCommand);
      }
      return;
    }

    if (e.key === "Enter") {
      const value = inputValue;
      runCommand(value);
      if (value.trim() !== "") {
        setCommandLog((prev) => [...prev, value]);
      }
      setInputValue("");
      setHistoryPointer(null);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandLog.length === 0) return;
      setHistoryPointer((prev) => {
        const nextIndex =
          prev === null ? commandLog.length - 1 : Math.max(prev - 1, 0);
        setInputValue(commandLog[nextIndex]);
        return nextIndex;
      });
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (commandLog.length === 0 || historyPointer === null) return;
      setHistoryPointer((prev) => {
        if (prev === null) return null;
        const nextIndex = prev + 1;
        if (nextIndex >= commandLog.length) {
          setInputValue("");
          return null;
        }
        setInputValue(commandLog[nextIndex]);
        return nextIndex;
      });
      return;
    }
  };
  
  const handleReturnToHome = () => {
    setActiveLocation("~");
    setHistory([{ id: idCounter.current++, type: "output", content: WELCOME_MESSAGE }]);
    setTimeout(() => inputRef.current?.focus(), 10);
  };

  return (
    <div
      className={`transition duration-500 ease-in-out origin-top-left overflow-hidden flex flex-col bg-[#1e1e1e]/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl ${
        isMinimized 
          ? "opacity-0 scale-[0.2] -translate-y-[45vh] -translate-x-[35vw] pointer-events-none absolute resize-none" 
          : "opacity-100 scale-100 translate-y-0 translate-x-0 relative"
      } ${
        isExpanded 
          ? "fixed inset-4 md:inset-10 z-[100] !max-w-none !w-auto !h-auto resize-none" 
          : "w-[90vw] md:w-[768px] min-w-[320px] h-[520px] min-h-[300px] max-h-[85vh] resize"
      }`}
    >
      {/* Title bar */}
      <div className="flex items-center h-10 px-4 bg-[#2b2b2b] border-b border-black/40 shrink-0 select-none cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-2" onPointerDown={(e) => e.stopPropagation()}>
          <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#ff5f57] border border-black/10 hover:brightness-110 active:brightness-90 transition-all"></button>
          <button onClick={onMinimize} className="w-3 h-3 rounded-full bg-[#febc2e] border border-black/10 hover:brightness-110 active:brightness-90 transition-all"></button>
          <button onClick={onMaximize} className="w-3 h-3 rounded-full bg-[#28c840] border border-black/10 hover:brightness-110 active:brightness-90 transition-all"></button>
        </div>
        <div className="flex-1 text-center text-[13px] text-white/50 -ml-14 pointer-events-none">
          guest — terminal
        </div>
      </div>

      {/* Terminal body */}
      <div
        ref={bodyRef}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={focusInput}
        className={`terminal-scroll flex-1 overflow-y-auto px-4 py-3 font-mono text-[13px] leading-relaxed text-white/90 transition-opacity duration-300 ${isMinimized ? 'opacity-0 hidden' : 'opacity-100 block'}`}
      >
        {history.map((line) => (
          <div key={line.id} className={line.type === "input" ? "mt-2" : ""}>
            {line.content}
          </div>
        ))}

        <div className="flex items-center mt-2 pb-4">
          <span className="text-emerald-400">{PROMPT_USER}</span>
          <span className="text-white/50">:</span>
          <span className="text-blue-400">{activeLocation}</span>
          <span className="text-white/50 mr-2">$</span>
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none border-none text-white caret-emerald-400"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            aria-label="Terminal command input"
          />
        </div>
      </div>

      {/* TERMINAL STATUS BAR */}
      {!isMinimized && (
        <div className="flex items-center h-8 px-4 bg-[#2b2b2b]/80 border-t border-black/40 shrink-0 text-[11px] font-mono text-white/50 justify-between">
          <div className="flex gap-4">
            <span>sys.status: <span className="text-emerald-400 font-semibold">active</span></span>
            <span className="hidden sm:inline">user: guest</span>
          </div>
          
          <div>
            {activeLocation !== "~" ? (
              <button 
                onClick={handleReturnToHome}
                className="text-emerald-400 hover:text-[#ff5f57] hover:underline cursor-pointer transition-all flex items-center gap-1 font-semibold"
                title="Click to clear screen and return to root"
              >
                dir: {activeLocation} [ x Return ]
              </button>
            ) : (
              <span>dir: {activeLocation}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}