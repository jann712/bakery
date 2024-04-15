"use client";

import Image from "next/image";
import { useState } from "react";

async function getPaymentLink(iceCount: number, cakeCount: number) {
  const res = await fetch("http://localhost:3000/api/stripe/payment-link", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      { id: 1, quantity: iceCount },
      { id: 2, quantity: cakeCount },
    ]),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default function Home() {
  const [iceCount, setIce] = useState(0);
  const [cakeCount, setCake] = useState(0);

  return (
    <main className="text-center p-10">
      <h1 className="text-4xl mb-4 font-bold mt-4">Sweet Dreams</h1>
      <div className="flex flex-1 justify-center space-x-7 mt-28">
        <div className="text-center">
          <Image src={"/ice-cream.jpg"} width={200} height={200} alt="Icecream"
          className=" transition ease-in-out rounded-full border-4 border-orange-400 hover:scale-110 hover:border-8 hover:border-orange-500"/>
          <h2 className="mt-3 font-bold text-2xl">Ice cream</h2>
          <span>Delicious and fresh.</span>
          <div className="flex flex-1 justify-center space-x-6 items-center mt-3">
            {iceCount > 0 && <button
            className="rounded p-2 bg-orange-400 text-white"
            onClick={() => setIce(iceCount - 1)}>-</button>}
            <span>{iceCount}</span>
            <button 
            className="rounded p-2 bg-orange-400 text-white"
            onClick={() => setIce(iceCount + 1)}>+</button>
          </div>
        </div>
        <div>
        <Image src={"/cake.jpg"} width={200} height={200} alt="Cake"
          className="transition ease-in-out rounded-full border-4 border-orange-400 hover:scale-110 hover:border-8 hover:border-orange-500"/>
          <h2 className="mt-3 font-bold text-2xl">Cake</h2>
          <span>Sweet and light.</span>
          <div className="flex flex-1 justify-center space-x-6 items-center mt-3">
            {cakeCount > 0 && <button 
            className="rounded p-2 bg-orange-400 text-white"
            onClick={() => setCake(cakeCount - 1)}>-</button>}
            <span>{cakeCount}</span>
            <button 
            className="rounded p-2 bg-orange-400 text-white"
            onClick={() => setCake(cakeCount + 1)}>+</button>
          </div>
        </div>
        
      </div>
      <button
        type="button"
        className="mt-12 rounded bg-yellow-800 text-white p-3 hover:bg-yellow-600 transition"
        onClick={async () => {
          const paymentLink = await getPaymentLink(iceCount, cakeCount);
          window.location.assign(paymentLink);
        }}
      >
        Proceed to payment
      </button>
    </main>
  );
}
