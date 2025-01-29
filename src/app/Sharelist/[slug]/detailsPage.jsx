"use client"
import React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import CandlestickChart from '@/components/CandleStick/candlestick';

const ShareDataDisplay = ({ sharedata }) => {
  // console.log("Sharedata:", sharedata);

  if (!sharedata || !sharedata.data || !Array.isArray(sharedata.data) || sharedata.data.length === 0) {
    return <div>No data available</div>;
  }

  const validatedata = sharedata.data;
  const initialvisible = 3 ;
  const [visibleCount, setVisibleCount] = useState(initialvisible)
  const StockCandle = validatedata.map((item) => ({
    x: new Date(item.date),
    y: [item.open_price, item.high_price, item.low_price, item.close_price],
  }));

  return (
    <div className="p-4">
      {/* Stock Details */}
      <div className=" flex justify-between mb-6 p-4 border rounded-lg shadow-lg bg-gray-100">
        <h1 className="text-3xl font-bold mb-2">{sharedata.security_name} ({sharedata.symbol})</h1>
        <button className='bg-blue-700 rounded-full hover:bg-blue-500 text-white font-bold py-2 px-4 rounded '>
        <Link href="../Sharelist" className="flex flex-row items-center gap-2 mr-20 text-lg font-bold">
            <FaArrowLeft />
            Back To ShareList
        </Link>
        </button>
       
      </div>

      {/* Stock Trading Data */}
      <h2 className="text-2xl font-bold mb-4">Stock Trading Data</h2>
      <table className="table-auto w-full bg-gray-200 text-left border-collapse mt-2">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Open Price</th>
              <th className="px-4 py-2">High Price</th>
              <th className="px-4 py-2">Low Price</th>
              <th className="px-4 py-2">Close Price</th>
              <th className="px-4 py-2">LTP</th>
              <th className="px-4 py-2">Market Cap.</th>
            </tr>
          </thead>
          <tbody>
            {validatedata.slice(0, visibleCount).map((entry) => (
              <tr
                key={entry.id}
                className={`border-b font-mono text-black bg-gray-300 cursor-pointer`}
              >
                <td className="px-4 py-2">{entry.date}</td>
                <td className="px-4 py-2">{entry.open_price}</td>
                <td className="px-4 py-2">{entry.high_price}</td>
                <td className="px-4 py-2">{entry.low_price}</td>
                <td className="px-4 py-2">{entry.close_price}</td>
                <td className="px-4 py-2">{entry.total_traded_quantity}</td>
                <td className="px-4 py-2">{entry.market_capitalization}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='flex justify-between mt-4 space-x-4'>
        {visibleCount < validatedata.length && (
        <div className="text-center mt-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 transition" onClick={() => setVisibleCount(visibleCount + 5)} > {/* Increase visible count by 5 */}
            See More
          </button>
        </div>
      )}
        {
          visibleCount > initialvisible && (
            <div className="text-center mt-4">
              <button className="px-4 py-2 bg-red-600 text-white rounded-md shadow-lg hover:bg-red-700 transition" onClick={() => setVisibleCount(initialvisible)} > {/* Reset visible count to initial value */}
                See Less
              </button>
            </div>
          )
        }
        </div>

      {/* Stock Candlestick Chart */}
        <div className="mt-20">
        <CandlestickChart data={StockCandle} />
      </div>
    </div>
  );
};

export default ShareDataDisplay;
