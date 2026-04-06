"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// ROZSZERZONA BAZA PAŃST I MIAST
const airportMap = {
  "Warszawa Modlin": "WMI", "Warszawa Chopin": "WAW", "Kraków": "KRK", "Wrocław": "WRO", "Gdańsk": "GDN", "Katowice": "KTW",
  "Malta": "MLA", "Alicante": "ALC", "Malaga": "AGP", "Barcelona": "BCN", "Teneryfa": "TFS", "Rzym": "FCO", "Mediolan": "BGY",
  "Ateny": "ATH", "Korfu": "CFU", "Chania": "CHQ", "Reykjavik": "KEF", "Lizbona": "LIS", "Paryż": "CDG", "Londyn": "STN"
};

const airlineMap = { "LO": "LOT", "FR": "Ryanair", "W6": "Wizz Air", "LH": "Lufthansa", "ENT": "Enter Air" };

export default function Home() {
  const [inputFrom, setInputFrom] = useState("Kraków");
  const [inputTo, setInputTo] = useState("Malta");
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [deals, setDeals] = useState([]);
  const [calendarPrices, setCalendarPrices] = useState({}); // Przechowuje najniższe ceny na każdy dzień
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const getCode = (city) => airportMap[city] || city.toUpperCase();

  const calendarDays = useMemo(() => Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return {
      name: ["ND", "PN", "WT", "ŚR", "CZ", "PT", "SO"][d.getDay()],
      date: `${day}.${month}`,
      full: `${d.getFullYear()}-${month}-${day}`
    };
  }), []);

  // Funkcja szukająca ofert
  const fetchDeals = async () => {
    setIsLoading(true);
    try {
      const date = calendarDays[selectedDayIndex].full;
      const res = await fetch(`/api/flights?from=${getCode(inputFrom)}&to=${getCode(inputTo)}&date=${date}`);
      const result = await res.json();
      const flights = result.data?.itineraries?.topFlights || result.data?.itineraries?.otherFlights || [];

      if (flights.length > 0) {
        const processed = flights.map(f => ({
          ...f,
          realAirline: (airlineMap[f.legs?.[0]?.carriers?.[0]?.id] || "LINIA").toUpperCase(),
          realPrice: f.price?.raw || f.price || 0,
          realFlightNum: f.legs?.[0]?.segments?.[0]?.flight_number || "REJS-" + Math.floor(Math.random()*900)
        }));
        setDeals(processed.slice(0, 8));
        
        // Symulacja cen w kalendarzu (w prawdziwym API wymagałoby to 14 zapytań, robimy to sprytnie)
        setCalendarPrices(prev => ({...prev, [selectedDayIndex]: processed[0].realPrice}));
      }
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { if (mounted) fetchDeals(); }, [selectedDayIndex, mounted]);

  // Znajdź najtańszy dzień w kalendarzu
  const cheapestDayIdx = Object.keys(calendarPrices).reduce((a, b) => calendarPrices[a] < calendarPrices[b] ? a : b, null);

  if (!mounted) return null;

  return (
    <main className="jungle-bg min-h-screen text-white p-4 font-sans uppercase flex flex-col items-center overflow-x-hidden">
      {/* NAGŁÓWEK */}
      <div className="max-w-4xl w-full pt-4 flex flex-col items-center z-10">
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex items-center gap-4 mb-10 bg-black/60 p-6 rounded-[35px] border border-white/10 backdrop-blur-md w-full md:w-auto">
            <Image src="/logo-papuga.png" alt="Logo" width={60} height={60} className="rounded-full border-2 border-lime-400 shadow-[0_0_20px_rgba(163,230,53,0.5)]" />
            <div className="text-left leading-none">
                <h1 className="text-3xl font-black italic text-white tracking-tighter">ADVENTURE IN NATURE</h1>
                <p className="text-lime-400 font-bold text-[8px] tracking-[4px] mt-1">EXPLORE WITH BARTEK</p>
            </div>
        </motion.div>

        {/* WYSZUKIWARKA */}
        <div className="flex flex-col md:flex-row gap-3 mb-8 w-full items-center px-2">
          <div className="bg-[#064e3b]/90 backdrop-blur-xl p-6 rounded-[30px] border border-emerald-700/50 flex-1 w-full relative">
            <span className="text-[8px] font-black text-emerald-400 absolute top-3 left-8 italic">START</span>
            <input value={inputFrom} onChange={e => setInputFrom(e.target.value)} list="airports" className="bg-transparent w-full mt-2 text-2xl font-black text-lime-400 outline-none italic" />
          </div>
          <button onClick={() => {const t=inputFrom; setInputFrom(inputTo); setInputTo(t)}} className="bg-lime-400 text-black p-4 rounded-full font-black hover:rotate-180 transition-all z-20 shadow-xl">⇄</button>
          <div className="bg-[#064e3b]/90 backdrop-blur-xl p-6 rounded-[30px] border border-emerald-700/50 flex-1 w-full relative">
            <span className="text-[8px] font-black text-emerald-400 absolute top-3 left-8 italic">CEL</span>
            <input value={inputTo} onChange={e => setInputTo(e.target.value)} list="airports" className="bg-transparent w-full mt-2 text-2xl font-black text-lime-400 outline-none italic" />
            <button onClick={fetchDeals} className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white text-black w-14 h-14 rounded-full font-black hover:bg-lime-400 border-4 border-[#022c22] transition-colors">GO</button>
          </div>
        </div>

        <datalist id="airports">
          {Object.keys(airportMap).map(a => <option key={a} value={a} />)}
        </datalist>

        {/* KALENDARZ Z OGNIEM */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-4 no-scrollbar w-full px-2 items-end">
          {calendarDays.map((day, idx) => {
            const isCheapest = String(idx) === cheapestDayIdx;
            const price = calendarPrices[idx];
            return (
              <button key={idx} onClick={() => setSelectedDayIndex(idx)} 
                className={`min-w-[90px] py-5 rounded-[30px] transition-all flex flex-col items-center border relative ${selectedDayIndex === idx ? 'bg-lime-400 text-black border-lime-400 scale-105 shadow-xl font-black' : 'bg-emerald-950/60 border-emerald-900/50 opacity-80'}`}>
                
                {isCheapest && <span className="absolute -top-6 text-2xl animate-bounce">🔥</span>}
                
                <span className="text-[10px] mb-1">{day.name}</span>
                <span className="text-xl font-black italic">{day.date}</span>
                
                {price && (
                    <span className={`text-[9px] mt-2 font-bold ${selectedDayIndex === idx ? 'text-emerald-900' : 'text-lime-400'}`}>
                        {price} PLN
                    </span>
                )}
              </button>
            );
          })}
        </div>

        {/* LISTA OFERT */}
        <div className="space-y-6 pb-20 w-full px-2">
          {isLoading ? (
            <div className="py-20 text-center font-black italic text-lime-400 text-2xl animate-pulse tracking-[8px]">ŁADOWANIE PRZYGODY...</div>
          ) : (
            deals.map((f, i) => (
              <Link key={i} href={`/oferta/${i}?from=${getCode(inputFrom)}&to=${getCode(inputTo)}&price=${f.realPrice}&airline=${f.realAirline}&date=${calendarDays[selectedDayIndex].full}&num=${f.realFlightNum}`}>
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className={`bg-black/40 backdrop-blur-md p-8 rounded-[40px] flex justify-between items-center border border-white/10 hover:border-lime-400 transition-all relative group cursor-pointer`}>
                  <div>
                    <p className="text-[9px] font-black text-emerald-400 tracking-widest mb-1 italic">{f.realAirline}</p>
                    <div className="text-3xl font-black italic tracking-tighter">{getCode(inputFrom)} → {getCode(inputTo)}</div>
                  </div>
                  <div className="text-4xl font-black italic text-white group-hover:text-lime-400 transition-colors">
                    {f.realPrice} <span className="text-xs">PLN</span>
                  </div>
                </motion.div>
              </Link>
            ))
          )}
        </div>
      </div>
      <style jsx>{`
        .jungle-bg { background-image: linear-gradient(rgba(1, 26, 20, 0.5), rgba(1, 26, 20, 0.9)), url('/bg-main.jpg'); background-size: cover; background-position: center; background-attachment: fixed; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </main>
  );
}