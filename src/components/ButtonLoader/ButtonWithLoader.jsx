import React from "react";

const ButtonWithLoader = ({ onClick, loading }) => {
  return (
    <div className="mt-4 flex justify-center">
      <button
        onClick={onClick}
        disabled={loading}
        className="px-4 py-4 bg-blue-300 text-white rounded-full shadow-lg hover:bg-black transition">
        {loading && (
          <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
        )}
        Predict Stock
      </button>
    </div>
  );
};

export default ButtonWithLoader;
