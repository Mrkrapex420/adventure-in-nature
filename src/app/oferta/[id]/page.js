"use client";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

function OfertaContent() {
  const searchParams = useSearchParams();

  const flight = {
    from: searchParams.get("from") || "---",
    to: searchParams.get("to") || "---",
    price: searchParams.get("price") || "0",
    airline: searchParams.get("airline") || "LINIA LOTNICZA",
    date: searchParams.get("date") || "---",
    flightNum: searchParams.get("num") || "REJS"
  };

  const handleBooking = () => {
    const { from, to, date } = flight;
    
    // NAJPEWNIEJSZY LINK: Google Flights otwiera konkretne wyszukiwanie bez blokad 404
    // Google "przepchnie" użytkownika bezpośrednio do zakupu
    const googleUrl = `https://www.google.com/travel/flights?q=Flights%20to%20${to}%20from%20${from}%20on%20${date}%20oneway`;
    
    window.open(googleUrl, '_blank');
  };

  return (
    <main className="jungle-offer-bg min-h-screen text-white p-6 font-sans uppercase relative flex flex-col items-center">
      <div className="max-w-xl w-full pt-10 text-center flex flex-col items-center z-10">
        <Link href="/" className="text-emerald-400 font-black text-xs hover:text-lime-400 italic mb-10 bg-black/60 px-8 py-3 rounded-full border border-white/10 backdrop-blur-md">
            ← POWRÓT DO PRZYGODY
        </Link>
        
        <div className="flex items-center gap-6 mb-12 bg-black/70 p-8 rounded-[40px] border border-white/10 backdrop-blur-lg w-full shadow-2xl">
            <Image src="/logo-papuga.png" alt="Logo" width={80} height={80} className="rounded-full border-4 border-lime-400 shadow-lg" />
            <div className="text-left leading-none">
                <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white">Adventure In Nature</h1>
                <p className="text-lime-400 font-black italic text-[10px] tracking-[4px] mt-2 uppercase">Wild Travel by Bartek</p>
            </div>
        </div>

        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-[#064e3b]/95 backdrop-blur-3xl p-10 rounded-[60px] border border-emerald-700/50 shadow-2xl w-full"
        >
           <h2 className="text-left text-emerald-500 font-black italic text-[10px] mb-8 tracking-widest uppercase border-b border-emerald-900 pb-2">KARTA POKŁADOWA: {flight.flightNum}</h2>
           
           <ul className="text-left space-y-6 mb-12">
              <li className="flex items-center gap-5 font-black italic text-lg"><span className="text-2xl">🌍</span> TRASA: {flight.from} → {flight.to}</li>
              <li className="flex items-center gap-5 font-black italic text-lg"><span className="text-2xl">✈️</span> LINIA: {flight.airline}</li>
              <li className="flex items-center gap-5 font-black italic text-lg"><span className="text-2xl">📅</span> TERMIN: {flight.date}</li>
           </ul>

           <div className="bg-black/60 p-12 rounded-[50px] border border-emerald-800 shadow-inner mb-10">
              <p className="text-[10px] font-black text-emerald-700 mb-2 tracking-widest italic uppercase">CENA TOTALNA</p>
              <div className="text-7xl font-black italic tracking-tighter drop-shadow-lg">{flight.price} <span className="text-xl text-lime-400 font-bold">PLN</span></div>
           </div>

           <button onClick={handleBooking} className="w-full bg-lime-400 text-black p-8 rounded-full font-black text-2xl italic hover:scale-105 transition-all shadow-[0_20px_50px_rgba(163,230,53,0.4)] active:scale-95">
             SPRAWDŹ DOSTĘPNOŚĆ →
           </button>
           <p className="text-[8px] text-emerald-600 mt-4 italic font-bold">PRZEKIEROWANIE DO BEZPIECZNEGO SYSTEMU REZERWACJI</p>
        </motion.div>
      </div>

      <style jsx>{` .jungle-offer-bg { background-image: linear-gradient(rgba(1, 26, 20, 0.6), rgba(1, 26, 20, 0.9)), url('/bg-offer.jpg'); background-size: cover; background-position: center; background-attachment: fixed; } `}</style>
    </main>
  );
}

export default function OfertaDetails() {
  return (
    <Suspense fallback={<div className="bg-[#022c22] min-h-screen"></div>}>
      <OfertaContent />
    </Suspense>
  );
}