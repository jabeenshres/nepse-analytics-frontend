import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function Pagination({ currentPage, totalPages }) {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div>
      <div className="flex justify-around my-4 space-x-2">
        <div className="flex items-center px-4 py-2 text-lg space-x-5 rounded-md">
          {/* Conditional rendering for buttons */}
          {currentPage - 2 >= 1 && (
            <button className="bg-gray-300 text-black font-bold rounded-lg flex items-center justify-center w-20">
              <a href={`?page=${currentPage - 2}`}>
                <div className="flex items-center px-2 space-x-3">
                  <div>{currentPage - 2}</div>
                </div>
              </a>
            </button>
          )}

          {currentPage - 1 >= 1 && (
            <button className="bg-gray-300 text-black font-bold rounded-lg flex items-center justify-center w-20">
              <a href={`?page=${currentPage - 1}`}>
                <div className="flex items-center px-2 space-x-3">
                  <div>{currentPage - 1}</div>
                </div>
              </a>
            </button>
          )}

          {/* Current Page */}
          <button className="bg-gray-800 text-white font-bold rounded-lg flex items-center justify-center w-20">
            {currentPage}
          </button>

          {currentPage + 1 <= totalPages && (
            <button className="bg-gray-300 text-black font-bold rounded-lg flex items-center justify-center w-20">
              <a href={`?page=${currentPage + 1}`}>
                <div className="flex items-center px-2 space-x-3">
                  <div>{currentPage + 1}</div>
                </div>
              </a>
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
