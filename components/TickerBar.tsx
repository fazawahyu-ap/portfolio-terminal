"use client";

import { useEffect, useState } from "react";

// Tipe data untuk ticker
type Ticker = {
  symbol: string;
  price: string;
  change: string;
  up: boolean;
};

// Data statis untuk saham (Baris Atas)
const MOCK_STOCKS: Ticker[] = [
  { symbol: "AAPL", price: "189.43", change: "-1.20%", up: false },
  { symbol: "TSLA", price: "210.50", change: "+3.45%", up: true },
  { symbol: "NVDA", price: "850.10", change: "+4.50%", up: true },
  { symbol: "MSFT", price: "415.20", change: "+0.85%", up: true },
  { symbol: "AMZN", price: "178.15", change: "+1.12%", up: true },
  { symbol: "GOOGL", price: "142.65", change: "-0.50%", up: false },
  { symbol: "META", price: "485.90", change: "+2.30%", up: true },
  { symbol: "NFLX", price: "612.30", change: "+1.75%", up: true },
  { symbol: "AMD", price: "165.20", change: "-2.10%", up: false },
  { symbol: "INTC", price: "38.45", change: "-0.80%", up: false },
];

// Status awal crypto (Baris Bawah)
const INITIAL_CRYPTO: Ticker[] = [
  { symbol: "BTC/USDT", price: "Loading...", change: "0.00%", up: true },
  { symbol: "ETH/USDT", price: "Loading...", change: "0.00%", up: true },
  { symbol: "SOL/USDT", price: "Loading...", change: "0.00%", up: true },
  { symbol: "BNB/USDT", price: "Loading...", change: "0.00%", up: true },
  { symbol: "XRP/USDT", price: "Loading...", change: "0.00%", up: true },
  { symbol: "ADA/USDT", price: "Loading...", change: "0.00%", up: true },
  { symbol: "DOGE/USDT", price: "Loading...", change: "0.00%", up: true },
  { symbol: "AVAX/USDT", price: "Loading...", change: "0.00%", up: true },
  { symbol: "LINK/USDT", price: "Loading...", change: "0.00%", up: true },
  { symbol: "DOT/USDT", price: "Loading...", change: "0.00%", up: true },
];

// Komponen pembantu agar kode tidak berulang-ulang
const TickerItems = ({ items }: { items: Ticker[] }) => (
  <>
    {items.map((ticker, idx) => (
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

export default function TickerBar() {
  const [cryptoData, setCryptoData] = useState<Ticker[]>(INITIAL_CRYPTO);

  useEffect(() => {
    // Koneksi WebSocket Real-time Binance
    const ws = new WebSocket(
      "wss://stream.binance.com:9443/ws/btcusdt@ticker/ethusdt@ticker/solusdt@ticker/bnbusdt@ticker/xrpusdt@ticker/adausdt@ticker/dogeusdt@ticker/avaxusdt@ticker/linkusdt@ticker/dotusdt@ticker"
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const symbol = data.s.replace("USDT", "/USDT");
      
      let maxDecimals = 2;
      if (symbol.includes("DOGE") || symbol.includes("XRP") || symbol.includes("ADA")) {
        maxDecimals = 4;
      }
      
      const price = parseFloat(data.c).toLocaleString("en-US", { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: maxDecimals 
      });
      
      const changePercent = parseFloat(data.P);
      const change = `${changePercent > 0 ? "+" : ""}${changePercent.toFixed(2)}%`;
      const up = changePercent >= 0;

      setCryptoData((prevData) =>
        prevData.map((coin) =>
          coin.symbol === symbol ? { symbol, price, change, up } : coin
        )
      );
    };

    ws.onerror = (error) => console.error("WebSocket terputus:", error);

    return () => ws.close();
  }, []);

  return (
    // Kontainer utama: Dibuat flex-col (atas bawah) dan menghapus batasan h-8 agar mengikuti isi di dalamnya
    <div className="absolute bottom-0 w-full bg-[#1e1e1e]/90 backdrop-blur-md border-t border-black/50 z-50 flex flex-col overflow-hidden text-[13px] shadow-[0_-5px_15px_rgba(0,0,0,0.3)]">
      
      {/* BARIS 1: SAHAM (Bergerak ke Kanan) */}
      <div className="h-8 flex items-center border-b border-white/10 bg-black/20">
        <div 
          className="animate-ticker flex whitespace-nowrap" 
          style={{ animationDirection: "reverse" }} // Trik CSS agar animasinya berjalan mundur (ke kanan)
        >
          <TickerItems items={MOCK_STOCKS} />
          <TickerItems items={MOCK_STOCKS} />
          <TickerItems items={MOCK_STOCKS} />
          <TickerItems items={MOCK_STOCKS} />
        </div>
      </div>

      {/* BARIS 2: KRYPTO (Bergerak ke Kiri) */}
      <div className="h-8 flex items-center">
        <div className="animate-ticker flex whitespace-nowrap">
          <TickerItems items={cryptoData} />
          <TickerItems items={cryptoData} />
          <TickerItems items={cryptoData} />
          <TickerItems items={cryptoData} />
        </div>
      </div>

    </div>
  );
}