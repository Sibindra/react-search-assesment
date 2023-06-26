import { useEffect, useState, useRef, KeyboardEvent } from "react";
import { FiSearch, FiArrowUp, FiArrowDown } from "react-icons/fi";
import { AiOutlineEnter } from "react-icons/ai";
import { HiOutlineBackspace } from "react-icons/hi";
import { LuLayoutList } from "react-icons/lu";

// api
import fetchProducts from "./api";

interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
}

export default function SearchBar(): JSX.Element {
  // search toggle state
  const [searchBarStatus, setSearchBarStatus] = useState(false);
  // api data state
  const [products, setProducts] = useState<Product[]>([]);
  // filtered api products by search on input field
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // for navigation using up and down arrows
  const listRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState(-1);

  // useref for ts
  const inputRef = useRef<HTMLInputElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);

// navigation effect
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();

      const listItems = filteredProducts.length;
      if (listItems === 0) return;

      let newIndex = selectedItem;

      if (event.key === "ArrowUp") {
        newIndex = (newIndex - 1 + listItems) % listItems;
      } else if (event.key === "ArrowDown") {
        newIndex = (newIndex + 1) % listItems;
      }

      setSelectedItem(newIndex);

      // Scroll to the selected item in the list
      if (listRef.current) {
        const selectedElements = Array.from(
          listRef.current.children
        ) as HTMLElement[];
        const selectedElement = selectedElements[newIndex];
        if (selectedElement) {
          selectedElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }
    } else if ((event.ctrlKey || event.key === "Control") && event.key === "k") {
      event.preventDefault();
      setSearchBarStatus(true);
    } else if (event.key === "Enter") {
      event.preventDefault();

      // open when pressing enter when input is focused
      setSearchBarStatus(true);

      // focus on input <search-bar>
      if (inputRef.current) {
        inputRef.current.focus();
      }

      // Handle selection logic here
    } else if (event.key === "Escape") {
      event.preventDefault();
      setSearchBarStatus(false);
      setFilteredProducts([]);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  document.addEventListener("keydown", handleKeyDown as unknown as EventListener);

  return () => {
    document.removeEventListener("keydown", handleKeyDown as unknown as EventListener);
  };
}, [filteredProducts, selectedItem]);


  // api request
  useEffect(() => {
    fetchProducts()
      .then((response) => {
        console.log(response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.log("error msg: ", error);
      });
  }, []);

  // clicks functions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setSearchBarStatus(false);
        // remove input value when pop up closes
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    setFilteredProducts([]); // clear filtered products
  };

  const handleSearch = () => {
    const searchTerm = inputRef.current?.value || "";
    const filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filteredProducts); // Update filtered products

    if (searchTerm === "") {
      setFilteredProducts([]); // Clear filtered products
    }

    setSelectedItem(-1); // Reset selected item when search term changes
  };

  const handleClick = () => {
    setSearchBarStatus(true);
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
        {/* INPUT HERE */}
        <input
          type="text"
          id="search-input"
          onClick={handleClick}
          onChange={handleSearch}
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
        <div
          className="my-2 h-40 overflow-y-auto overflow-x-hidden"
          ref={listRef}
        >
          {/* PRODUCTS LIST  */}
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`flex border p-2 m-2 rounded-sm w-full items-center ${
                index === selectedItem ? "border-blue-500" : ""
              }`}
            >
              <span className="text-blue-600 mr-2">#</span>
              <h2>{product.title}</h2>
              <p className="hidden">Category: {product.category}</p>
              <p className="hidden">Price: {product.price}</p>
            </div>
          ))}
        </div>
      )}
      {/* navigation ins */}
      {searchBarStatus && (
        <div className="">
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
