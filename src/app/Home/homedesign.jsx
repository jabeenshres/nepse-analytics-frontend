"use client";
import { redirect } from "next/navigation";
import Link from "next/link";
import React from "react";

function Homedesign({username, gainer, looser }) {
  const handleRowClick = (id) => {
    redirect(`/Sharelist/${id}`);
  };
  const handlegainer = ()=>{
    redirect(`/Sharelist?gainer=1`);
  }
  const handlelooser = ()=>{
    redirect(`/Sharelist?gainer=0`);
  }

  return (
    <div>
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 z-10 relative">
          <Link href="./Sharelist" className="inline-flex justify-between items-center py-1 px-1 pe-4 mb-7 text-sm text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800">
            <span className="text-xs bg-blue-600 rounded-full text-white px-4 py-1.5 me-3">New</span> <span className="text-sm font-medium">Today's Stock Market</span>
            <svg className="w-2.5 h-2.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
            </svg>
          </Link>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">We invest in the world’s potential</h1>
          <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-200">Invest Today, Prosper Tomorrow</p>
          <button className="relative px-6 py-3 font-bold text-lg text-[#06c8d9] uppercase tracking-wider border-4 border-[#06c8d9] transition-all duration-700 overflow-hidden">
            Explore Trends
            <div className="absolute inset-0 flex">
              <div className="w-1/3 h-full bg-[#06c8d9] rounded-full transform scale-[1.4] translate-y-[125%] transition-all duration-700"></div>
              <div className="w-1/3 h-full bg-[#06c8d9] rounded-full transform scale-[1.4] translate-y-[125%] transition-all duration-700 delay-75"></div>
              <div className="w-1/3 h-full bg-[#06c8d9] rounded-full transform scale-[1.4] translate-y-[125%] transition-all duration-700 delay-50"></div>
            </div>
          </button>
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" className="hidden">
            <defs>
              <filter id="goo">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"></feGaussianBlur>
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo"></feColorMatrix>
                <feBlend in="SourceGraphic" in2="goo"></feBlend>
              </filter>
            </defs>
          </svg>

        </div>
         <div className="bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 z-[-1]">
        </div>
      </section>


      

      <div className="flex flex-row justify-center space-x-60 p-10">
        {/* Gainers Table */}
        <div>
          <table className="table-auto text-left border-collapse">
            <thead>
              <tr><th colSpan="3" className="text-lg font-semibold pb-2">Top Gainers</th></tr>
              <tr className="bg-green-300">
                <th className="border px-4 py-2">Symbol</th>
                <th className="border px-4 py-2">Price</th>
                <th className="border px-4 py-2">Change (%)</th>
              </tr>
            </thead>
            <tbody>
              {gainer.results.slice(0, 5).map((gain, index) => {
                const currentClosePrice = gain.data[0]?.close_price;
                const previousClosePrice = gain.data[0]?.open_price;
                const percentageChange =
                  currentClosePrice && previousClosePrice
                    ? ((currentClosePrice - previousClosePrice) / previousClosePrice) * 100
                    : null;

                return (
                  <tr
                    key={index}
                    onClick={() => handleRowClick(gain.id)}
                    className="cursor-pointer hover:bg-gray-200"
                  >
                    <td className="border px-4 py-2">{gain.symbol}</td>
                    <td className="border px-4 py-2">{currentClosePrice}</td>
                    <td className="border px-4 py-2">
                      {percentageChange !== null ? percentageChange.toFixed(2) : "N/A"}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="text-center mt-4">
              <button className="px-4 py-2 bg-green-400 text-gray-700 rounded hover:bg-green-600" onClick={handlegainer}>
                See More
              </button>
            
          </div>
        </div>

        {/* Losers Table */}
        <div>
          <table className="table-auto text-left border-collapse">
            <thead>
              <tr><th colSpan="3" className="text-lg font-semibold pb-2">Top Losers</th></tr>
              <tr className="bg-red-300">
                <th className="border px-4 py-2">Symbol</th>
                <th className="border px-4 py-2">Price</th>
                <th className="border px-4 py-2">Change (%)</th>
              </tr>
            </thead>
            <tbody>
              {looser.results.slice(0, 5).map((loss, index) => {
                const currentClosePrice = loss.data[0]?.close_price;
                const previousClosePrice = loss.data[0]?.open_price;
                const percentageChange =
                  currentClosePrice && previousClosePrice
                    ? ((currentClosePrice - previousClosePrice) / previousClosePrice) * 100
                    : null;

                return (
                  <tr
                    key={index}
                    onClick={() => handleRowClick(loss.id)}
                    className="cursor-pointer hover:bg-gray-200"
                  >
                    <td className="border px-4 py-2">{loss.symbol}</td>
                    <td className="border px-4 py-2">{currentClosePrice}</td>
                    <td className="border px-4 py-2">
                      {percentageChange !== null ? percentageChange.toFixed(2) : "N/A"}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="text-center mt-4">
              <button className="px-4 py-2 bg-red-400 text-gray-700 rounded hover:bg-red-600" onClick={handlelooser}>  
                See More
              </button>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homedesign;
