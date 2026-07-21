"use client";

// Data simulasi (Mock Data) agar tidak terkena limit API
const MOCK_TICKERS = [
  { symbol: "BTC/USD", price: "64,230.50", change: "+5.42%", up: true },
  { symbol: "ETH/USD", price: "3,450.80", change: "+2.15%", up: true },
  { symbol: "SOL/USD", price: "145.20", change: "+8.70%", up: true },
  { symbol: "AAPL", price: "189.43", change: "-1.20%", up: false },
  { symbol: "TSLA", price: "210.50", change: "+3.45%", up: true },
  { symbol: "NVDA", price: "850.10", change: "+4.50%", up: true },
  { symbol: "MSFT", price: "415.20", change: "+0.85%", up: true },
  { symbol: "DOGE/USD", price: "0.154", change: "-5.50%", up: false },
];

export default function TickerBar() {
  const TickerItems = () => (
    <>
      {MOCK_TICKERS.map((ticker, idx) => (
        <div key={idx} className="flex items-center mx-6 gap-2">
          <span className="text-white/70 font-semibold">{ticker.symbol}</span>
          <span className="text-white font-mono">${ticker.price}</span>
          <span className={`font-mono text-xs font-bold ${ticker.up ? "text-[#28c840]" : "text-[#ff5f57]"}`}>
            {ticker.up ? "▲" : "▼"} {ticker.change}
          </span>
        </div>
      ))}
    </>
  );

  return (
    <div className="absolute bottom-0 w-full h-8 bg-[#1e1e1e]/90 backdrop-blur-md border-t border-black/50 z-50 flex items-center overflow-hidden text-[13px] shadow-[0_-5px_15px_rgba(0,0,0,0.3)]">
      {/* Kontainer digandakan 4 kali agar perulangannya (looping) sangat panjang dan mulus */}
      <div className="animate-ticker flex whitespace-nowrap">
        <TickerItems />
        <TickerItems />
        <TickerItems />
        <TickerItems />
      </div>
    </div>
  );
}