import { useState, useCallback } from "react";
import debounce from 'lodash/debounce';

const TableSearch = ({ search, setSearch }) => {
  const [inputValue, setInputValue] = useState(search);
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search function using useCallback
  const debouncedSearch = useCallback(
    debounce((value) => {
      setIsLoading(true);  // Optional: show loading state when search is triggered
      setSearch(value);    // Update search state with the debounced value
      setIsLoading(false); // Optional: hide loading after search completes
    }, 500),  // 500ms debounce delay
    [setSearch] // Memoize to avoid re-creating the function on each render
  );

  // Handle input change and debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setInputValue(value);      // Immediately update the input value
    debouncedSearch(value);    // Call debounced search function after a delay
  };
  return (
    <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2 text-white">
    <img src="/search.png" alt="search" width={14} height={14} />
    <input
      type="text"
      placeholder="Search..."
      className="w-[200px] p-2 bg-transparent outline-none"
      value={inputValue}
      onChange={handleSearchChange}
    />
    {isLoading && <div>Loading...</div>}
  </div>
  )
}

export default TableSearch