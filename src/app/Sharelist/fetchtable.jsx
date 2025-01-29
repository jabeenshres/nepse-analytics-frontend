"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiSearchAlt } from "react-icons/bi";

export default function FetchTable({
  datas,
  searchTerm: initialSearchTerm,
  gainer: initialGainer,
}) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || "");
  const [gainer, setGainer] = useState(initialGainer === "1"); // Convert gainer to boolean
  const [isChecklistChecked, setIsChecklistChecked] = useState(initialGainer === "1"); // Set initial state based on gainer
  const router = useRouter();

  // Handle Search Button Click
  const handleSearch = () => {
    const queryParams = new URLSearchParams(window.location.search);

    if (searchTerm) queryParams.set("search", searchTerm);
    else queryParams.delete("search");

    queryParams.delete("page"); // Reset pagination on search
    router.push(`?${queryParams.toString()}`);
  };

  // Handle Gainer Toggle
  const handleGainerToggle = (isChecked) => {
    const queryParams = new URLSearchParams(window.location.search);

    queryParams.set("gainer", isChecked ? "1" : "0"); // Set gainer to 1 or 0
    queryParams.delete("page"); // Reset pagination on toggle
    router.push(`?${queryParams.toString()}`);
  };

  // Handle Pagination (next/prev)
  const handlePagination = (newPage) => {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set("page", newPage); // Set the new page number

    // Keep the gainer filter in the query string
    if (gainer) queryParams.set("gainer", "1");
    else queryParams.delete("gainer"); // Remove gainer if unchecked

    router.push(`?${queryParams.toString()}`);
  };

  // Handle Checklist Toggle
  const handleChecklistToggle = (isChecked) => {
    setIsChecklistChecked(isChecked);

    const queryParams = new URLSearchParams(window.location.search);

    if (!isChecked) {
      // Remove gainer from the query string if disabled
      queryParams.delete("gainer");
      setGainer(false); // Reset gainer state
    }

    queryParams.delete("page"); // Reset pagination
    router.push(`?${queryParams.toString()}`);
  };

  return (
    <div className="container mx-auto p-4 rounded-lg">
      {/* Search and Gainer Controls */}
      <div className="flex justify-between items-center mb-4 w-full bg-gray-100 h-16 text-2xl rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold ml-10">Stock Price List</h1>
        <div className="flex items-center mr-4 space-x-4">

          {/* Checklist and Gainer Toggle */}
          <div className="flex items-center space-x-4">
            {/* Checklist */}
            <div className="flex items-center space-x-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecklistChecked}
                  onChange={(e) => handleChecklistToggle(e.target.checked)}
                  className="hidden"
                />
                <div
                  className={`w-10 h-5 rounded-full ${isChecklistChecked ? "bg-yellow-300" : "bg-gray-300"
                    } relative`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-md absolute top-0.5 transform ${isChecklistChecked ? "translate-x-5" : "translate-x-0.5"
                      } transition-transform`}
                  />
                </div>
              </label>
              <span className="text-sm">Enable Filter</span>
            </div>

            {/* Gainer Toggle */}
            {/* Gainer Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm">Gainer:</span>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={gainer}
                  onChange={(e) => {
                    setGainer(e.target.checked); // Update local state
                    handleGainerToggle(e.target.checked); // Update URL
                  }}
                  disabled={!isChecklistChecked} // Disable if checklist is not checked
                  className="hidden"
                />
                <div
                  className={`w-10 h-5 rounded-full ${isChecklistChecked
                      ? gainer
                        ? "bg-green-500"
                        : "bg-red-500"
                      : "bg-gray-300"
                    } relative ${isChecklistChecked ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                    }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-md absolute top-0.5 transform ${gainer ? "translate-x-5" : "translate-x-0.5"
                      } transition-transform`}
                  />
                </div>  
              </label>
            </div>

          </div>
          {/* Search Input */}
          <div className="flex items-center">
            <input type="text" placeholder="Search Stocks..." className="border border-gray-300 text-sm rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-300" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <button onClick={handleSearch} className="ml-2 px-4 py-2 hover:bg-red-500 hover:text-gray-900 rounded-full bg-green-500 text-white rounded-md">
              <BiSearchAlt />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto relative bg-white p-4 shadow-md">
        <table className="min-w-full shadow-xl rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border border-gray-300 text-left">
                Stocks
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left">
                Company Name
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left">
                Open Price
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left">
                High Price
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left">
                Low Price
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left">
                Close Price
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left">
                LTP
              </th>
            </tr>
          </thead>
          <tbody>
            {datas.map((stock) => (
              <tr
                key={stock.id}
                className={`font-mono text-white ${stock.data[0].close_price > stock.data[0].open_price
                  ? "bg-green-600"
                  : "bg-red-600"
                  } cursor-pointer`}
                onClick={() => router.push(`/Sharelist/${stock.id}`)}
              >
                <td
                  className={`px-4 py-2 border border-gray-300 bg-white ${stock.data[0].close_price > stock.data[0].open_price
                    ? "text-green-600"
                    : "text-red-600"
                    }`}
                >
                  {stock.symbol}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {stock.security_name}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {stock.data[0].open_price}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {stock.data[0].high_price}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {stock.data[0].low_price}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {stock.data[0].close_price}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {stock.data[0].last_updated_price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
   </div>
  );
}
