"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from "react-icons/fi";

export default function Pagination({ currentPage, totalPages }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);

    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {/* First Page */}
      <button
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg transition-colors ${
          currentPage === 1
            ? "text-[var(--foreground-muted)] cursor-not-allowed"
            : "text-[var(--foreground)] hover:bg-[var(--background-tertiary)]"
        }`}
        title="First Page"
      >
        <FiChevronsLeft className="w-5 h-5" />
      </button>

      {/* Previous Page */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-lg transition-colors ${
          currentPage === 1
            ? "text-[var(--foreground-muted)] cursor-not-allowed"
            : "text-[var(--foreground)] hover:bg-[var(--background-tertiary)]"
        }`}
        title="Previous Page"
      >
        <FiChevronLeft className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`min-w-[40px] h-10 rounded-lg font-medium transition-colors ${
              page === currentPage
                ? "bg-[var(--color-accent)] text-white"
                : "text-[var(--foreground-secondary)] hover:bg-[var(--background-tertiary)] hover:text-[var(--foreground)]"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Page */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg transition-colors ${
          currentPage === totalPages
            ? "text-[var(--foreground-muted)] cursor-not-allowed"
            : "text-[var(--foreground)] hover:bg-[var(--background-tertiary)]"
        }`}
        title="Next Page"
      >
        <FiChevronRight className="w-5 h-5" />
      </button>

      {/* Last Page */}
      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-lg transition-colors ${
          currentPage === totalPages
            ? "text-[var(--foreground-muted)] cursor-not-allowed"
            : "text-[var(--foreground)] hover:bg-[var(--background-tertiary)]"
        }`}
        title="Last Page"
      >
        <FiChevronsRight className="w-5 h-5" />
      </button>

      {/* Page Info */}
      <span className="ml-4 text-sm text-[var(--foreground-muted)]">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
}
