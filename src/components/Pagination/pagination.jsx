"use client";
import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

export default function Pagination({ totalPages, currentPage }) {
  const router = useRouter();
  // toast.configure();

  const current = currentPage;

  //   total number of pages
  const total = totalPages;

  //   number of button to show at the side of the pagination
  const marginPage = 3;

  //   number of button to show at the middle of the pagination
  const midPageRange = 3;

  //   array that holds the value of btn of left
  const frontPages = [];

  //   array that holds the value of btn at middle
  const middle = [];

  //   array that holds the value of btn at right
  const lastPages = [];

  //   function that set the value of the page
  const handleClick = (value) => {
    try {
      const queryParams = new URLSearchParams(window.location.search);
      queryParams.set("page", value);
      router.push(`?${queryParams.toString()}`);
    } catch (error) {
      console.error("Error in handleClick:", error);
      // toast.error("Failed to change page!", { position: "top-right" });
    }
  };
  

  //   pushing value into frontpage array while i is less than the given marginPage value
  //   and while i is less than the total page value (to avoid filling front page when marginpage is greater than the total )
  for (let i = 1; i <= marginPage && i <= total; i++) {
    frontPages.push(
      // on  click set the current page to i
      <button
        onClick={() => handleClick(i)}
        className={`ml-2 px-4 py-2 hover:bg-red-500 hover:text-gray-900 rounded-full  text-white ${
          current == i ? "bg-red-500" : "bg-green-500"
        }`}
        key={i}
      >
        {i}
      </button>
    );
  }

  //   pushing value into lastpage array while i is greater than the given total-marginPage value
  //   and while i is less than the marginpage value (to avoid refilling last page with same frontpage value when marginpage is greater than the total )
  for (let i = total; i > total - marginPage && i > marginPage; i--) {
    lastPages.unshift(
      // on  click set the current page to i
      <button
        onClick={() => handleClick(i)}
        className={`ml-2 px-4 py-2 hover:bg-red-500 hover:text-gray-900 rounded-full  text-white ${
          current == i ? "bg-red-500" : "bg-green-500"
        }`}
        key={i}
      >
        {i}
      </button>
    );
  }

  //   pushing value into middlepage btn
  for (
    let i = current;
    i < current + midPageRange && i < total - marginPage + 1;
    i++
  ) {
    // check if i is smaller than margin page and if i is greater than total-marginPage then reject
    if (i > marginPage && i <= total - marginPage) {
      middle.push(
        // on  click set the current page to i
        <button
          onClick={() => handleClick(i)}
          className={`ml-2 px-4 py-2 hover:bg-red-500 hover:text-gray-900 rounded-full  text-white ${
            current == i ? "bg-red-500" : "bg-green-500"
          }`}
          key={i}
        >
          {i}
        </button>
      );
    }
  }

  //   getting the middle page length
  let midlength = middle.length;

  return (
    <div className="join rounded-lg">
      {/* previous btn  */}
      {/* disabled when on current page is 1  */}
      {/* on click set the current page to current page -1  */}
      <button
        onClick={() => handleClick(current - 1)}
        disabled={current == 1 ? true : false}
        className="ml-2 px-4 py-2 hover:bg-red-500 hover:text-gray-900 rounded-full  text-white bg-green-500
        "
      >
        prev
      </button>

      {/* front pages button are shown here  */}
      {frontPages}

      {/* show more button when total is greater than 2 times marginvalue and current page number is greater than the marginvalue  */}
      {total > 2 * marginPage && current > marginPage + 1 && (
        // on click decrease the current page by midpageRange value if decreasing doesnt cause the current page to go less than zero
        <button
          className="ml-2 px-4 py-2 hover:bg-red-500 hover:text-gray-900 rounded-full  text-white bg-green-500
        "
          onClick={() =>
            handleClick(
              current - midPageRange < 0 ? current : current - midPageRange
            )
          }
        >
          ...
        </button>
      )}

      {/* mid pages button are shown here  */}
      {/* when current page is greater than marginpage value and current is less than the (total-marginvalue) then display  */}
      {current > marginPage && current < total - marginPage + 1 && (
        <>{middle}</>
      )}

      {/* show more button when total is greater than 2 times marginvalue and current page number is less than the total-margin-midlength  */}
      {total > 2 * marginPage && current <= total - marginPage - midlength && (
        // on click increase the current page by midpageRange value if increasing doesnt cause the current page to go more than total value
        <button
          className="ml-2 px-4 py-2 hover:bg-red-500 hover:text-gray-900 rounded-full  text-white bg-green-500
        "
          onClick={() =>
            handleClick(
              current + midPageRange > total ? current : current + midPageRange
            )
          }
        >
          ...
        </button>
      )}

      {/* last page button are displayed here  */}
      {lastPages}

      {/* next button  */}
      {/* disabled at current page =total page  */}
      {/* on click sets current page value to current page +1 */}
      <button
        onClick={() => handleClick(current + 1)}
        disabled={current == total ? true : false}
        className="ml-2 px-4 py-2 hover:bg-red-500 hover:text-gray-900 rounded-full  text-white bg-green-500
        "
      >
        next
      </button>
    </div>
  );
}
