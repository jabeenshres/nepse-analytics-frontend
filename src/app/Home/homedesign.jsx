// import StockLineChart from '@/components/StockLineChart/stockline';
// import StockOHLCChart from '@/components/StockLineChart/stockline';
import Link from 'next/link'
import React from 'react'

function Homedesign({result}) {  


  return (
    <div>
          <section className='text-center p-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white'>
        <h1 className='text-4xl font-bold'>Stock Market Analysis</h1>
        <p className='mt-2 text-lg'>
          Real-time data and insights to make smarter investment decisions.
        </p>
        <button className='mt-5 px-5 py-2 text-lg bg-white text-blue-500 rounded hover:bg-gray-200'>
            <Link href="/Sharelist">Explore Trends</Link>
            </button>
      </section>

      <div className='flex flex-row justify-between p-10'>
        <table className='table-auto text-left border-collapse'>
        <thead>
          <tr>
            <th>Table For Gainers</th>
          </tr>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Symbol</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Change (%)</th>
          </tr>
        </thead>
        </table>

        <table className='table-auto text-left border-collapse'>
        <thead>
        <tr>
            <th>Table For Losers</th>
          </tr>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Symbol</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Change (%)</th>
          </tr>
        </thead>
        </table>

      </div>

    </div>
  )
}

export default Homedesign