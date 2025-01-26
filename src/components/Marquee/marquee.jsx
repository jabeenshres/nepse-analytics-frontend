import React from "react";
import { fetchData } from "@/app/lib/api";

export const revalidate = 60;

export default async function Marquee() {
  // const data = await fetchData(); // Ensure fetchData fetches the correct data structure
  const data = []
  return (
    <div className="group relative overflow-hidden bg-gray-100 py-3">
      <div className="flex w-full animate-marquee group-hover:[animation-play-state:paused] animate-infinite animate-duration-1000 items-center space-x-10">
        {data?.results?.map((item, index) => (
          <div className="flex flex-col items-center space-y-1" key={index}>
            <span className="text-sm font-extrabold text-gray-600">{item.symbol}</span>
            {item.data.map((shareData, subIndex) => (
              <span key={subIndex} className={`text-sm font-semibold text-gray-600 font-mono ${
                shareData.close_price > shareData.open_price ? `text-green-500` : `text-red-500`
              }`}>
                {shareData.close_price}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}