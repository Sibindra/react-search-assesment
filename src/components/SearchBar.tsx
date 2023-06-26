import { useEffect, useState, useRef } from "react";
import { FiSearch, FiArrowUp, FiArrowDown } from "react-icons/fi";
import { AiOutlineEnter } from "react-icons/ai";
import { HiOutlineBackspace } from "react-icons/hi";
import { LuLayoutList } from "react-icons/lu";

export default function SearchBar(): JSX.Element {
  const [searchBarStatus, setsearchBarStatus] = useState(false);
  //   useref for ts
  const inputRef = useRef<HTMLInputElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setsearchBarStatus(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleCtrlKey = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === "k") {
      event.preventDefault();
      setsearchBarStatus(true);
    }
  };

  const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setsearchBarStatus(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleCtrlKey);
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleCtrlKey);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  //   CLICK HANDLE
  const handleClick = () => {
    setsearchBarStatus(true);
  };

  //   CLEAR BUTTON
  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div
      className={`p-1 rounded-lg flex justify-between flex-col ${
        searchBarStatus ? "w-full h-auto border-2 p-3" : ""
      }`}
    >
      <div className="relative" ref={searchBarRef}>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <FiSearch className="h-5 w-5 text-gray-500" />
        </div>
        <input
          type="text"
          id="search-input"
          onClick={handleClick}
          ref={inputRef}
          className={`pl-10 pr-10 py-3 text-sm text-gray-900 border-none bg-gray-100 rounded-md outline-blue-600
            ${searchBarStatus ? "w-full" : ""}
          `}
          placeholder="Search"
          required
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 ">
          <span className="text-gray-500 text-xs">
            <kbd
              className={`border border-gray-300 px-2 py-1 rounded-md font-sans ${
                searchBarStatus ? "hidden" : ""
              }`}
            >
              Ctrl K
            </kbd>
          </span>
        </div>

        <div
          className={`w-24 justify-between p-2 absolute inset-y-0 right-0 flex items-center pr-3 ${
            searchBarStatus ? "" : "hidden"
          }`}
        >
          <LuLayoutList className="h-4 w-5 text-black" />
          {/* clear button */}
          <HiOutlineBackspace
            className="h-4 w-5 text-gray-500 cursor-pointer"
            onClick={handleClear}
          />
        </div>
      </div>

      {/* List of components matching text */}
      {searchBarStatus && (
        <div className="border-2 my-2">{/* items list here */}</div>
      )}
      {/* navigation ins */}
      {searchBarStatus && (
        <div className="border-2">
          <div className="flex items-center w-1/2 justify-start">
            <div className="flex mr-3">
              <FiArrowUp className="h-6 w-6 p-1 border border-gray-300 rounded mx-1 drop-shadow-sm bg-[#f5f5f5]" />
              <FiArrowDown className="h-6 w-6 p-1 border border-gray-300 rounded mx-1 drop-shadow-sm bg-[#f5f5f5]" />
              <p>to navigate</p>
            </div>

            <div className="flex mr-3">
              <AiOutlineEnter className="h-6 w-6 p-1 border border-gray-300 rounded mx-1 drop-shadow-sm bg-[#f5f5f5]" />
              <p>to select</p>
            </div>

            <div className="flex">
              <kbd className="h-6 w-8 border border-gray-300 rounded-md font-sans text-sm p-1 flex justify-center items-center mx-1 drop-shadow-sm bg-[#f5f5f5]">
                esc
              </kbd>
              <p>to close</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
