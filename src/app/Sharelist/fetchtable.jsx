"use client";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function FetchTable({ datas }) {
  const [searchTerm, setSearchTerm] = useState("")
  const filterdata = datas.filter((data) => {
    if (searchTerm === "") {
      return data
    } else if (data.security_name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return data
    }
  })  

  return (
    <div className="container mx-auto p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4border w-full border-black-100 mx-auto mb-4 bg-gray-100 h-16 text-2xl rounded rounded-lg shadow-xl ">
        <h1 className="text-2xl font-bold ml-10">Stock Price List</h1>
        {/* <label for="default-search" class="mb-2 text-sm font-sm text-gray-900 sr-only text-white"></label> */}
        <input
          type="text"
          placeholder="Search Stocks..."
          className="border border-gray-300 mr-4 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-auto relative bg-white p-4 shadow-md h-screen">
        <table className="min-w-full shadow-xl rounded-lg">
          <thead className="bg-gray-200  top-0 z-10">
            <tr>
                <th className="px-4 py-2 border border-gray-300 text-left">Stocks</th>
              <th className="px-4 py-2 border border-gray-300 text-left">
                Company Name
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left">
                Open Price
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left">
                Hgh Price
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left">
                Low Price
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left">
                Close Price
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left">LTP</th>
              {/* <th className="px-4 py-2 border border-gray-300 text-left">Turnover ($)</th> */}
            </tr>
          </thead>
          <tbody>
            {filterdata.map((stock) => (
              <tr key={`${stock.id}}`}
                className={`font-mono text-white ${stock.data[0].close_price > stock.data[0].open_price
                  ? "bg-green-600"
                  : "bg-red-600"
                  } cursor-pointer`}
                onClick={() => redirect(`Sharelist/${stock.id}`)}
              >
                <td className={`px-4 py-2 hover:bg-gray-100 border border-gray-300 bg-white ${stock.data[0].close_price > stock.data[0].open_price
                  ? "text-green-600"
                  : "text-red-600"
                  } cursor-pointer`}>{stock.symbol}</td>
                <td className="px-4 py-2 border border-gray-300">
                  {stock.security_name}
                </td>
                {stock.data.map((stockdata) => (
                  <td className="px-4 py-2 border border-gray-300">
                    {stockdata.open_price}
                  </td>
                ))}
                {stock.data.map((stockdata) => (
                  <td className="px-4 py-2 border border-gray-300">
                    {stockdata.high_price}
                  </td>
                ))}
                {stock.data.map((Stockdata) => (
                  <td className="px-4 py-2 border border-gray-300">
                    {Stockdata.low_price}
                  </td>
                ))}
                {stock.data.map((stockdata) => (
                  <td className="px-4 py-2 border border-gray-300">
                    {stockdata.close_price}
                  </td>
                ))}
                {stock.data.map((stockdata) => (
                  <td className="px-4 py-2 border border-gray-300">
                    {stockdata.last_updated_price}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}