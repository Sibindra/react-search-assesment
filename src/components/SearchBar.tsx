import { useEffect, useState, useRef, KeyboardEvent } from "react";
import { FiSearch, FiArrowUp, FiArrowDown } from "react-icons/fi";
import { AiOutlineEnter } from "react-icons/ai";
import { HiOutlineBackspace } from "react-icons/hi";
import { LuLayoutList } from "react-icons/lu";

// select components
import Categories from "./Categories";
import Price from "./Price";

// fetch component
import fetchProducts from "./api";

interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
}

interface SearchBarProps {
  priceValue: string;
}

export default function SearchBar(props: SearchBarProps): JSX.Element {
  // search bar pop up 
  const [searchBarStatus, setSearchBarStatus] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  // filtering search results
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // selected items for up and down navigation with up and down keys
  const [selectedItem, setSelectedItem] = useState(-1);

  // ref's
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);

  // category 
  const [selectedCategory, setSelectedCategory] = useState("");

  // price prop from price component
  const { priceValue } = props;

  // price state
  const [price, setPrice] = useState(priceValue);

  // categories and price ref's
  const categoriesRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);

  // ref to div below search bar div
  const emptyDivRef = useRef<HTMLInputElement>(null);

  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handlePriceChange = (value: string) => {
    setPrice(value);
  };


  // navigation and keyboard handles
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
      } else if (
        (event.ctrlKey || event.key === "Control") && //CTRL K
        event.key === "k"
      ) {
        event.preventDefault();
        setSearchBarStatus(true);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      } else if (event.key === "Enter") { //enter on focus
        event.preventDefault();
        setSearchBarStatus(true);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      } else if (event.key === "Escape") { //esc
        event.preventDefault();
        setSearchBarStatus(false);
        setFilteredProducts([]);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown as unknown as EventListener
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown as unknown as EventListener
      );
    };
  }, [filteredProducts, selectedItem]);


  // api 
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

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setFilteredProducts([]);
  };

  // search filterations
  useEffect(() => {
    handleSearch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, price]);

  const handleSearch = () => {
    const searchTerm = inputRef.current?.value || "";
    const filteredProducts = products.filter((product) => {
      let isMatched = true;
      if (
        selectedCategory !== "None" &&
        selectedCategory !== "" &&
        product.category.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        isMatched = false;
      }
      if (price !== "") {
        switch (price) {
          case "<20":
            if (product.price >= 20) {
              isMatched = false;
            }
            break;
          case "<50":
            if (product.price >= 50) {
              isMatched = false;
            }
            break;
          case "<100":
            if (product.price >= 100) {
              isMatched = false;
            }
            break;
          case "<200":
            if (product.price >= 200) {
              isMatched = false;
            }
            break;
          case "<500":
            if (product.price >= 500) {
              isMatched = false;
            }
            break;
          case "<700":
            if (product.price >= 700) {
              isMatched = false;
            }
            break;
          case "<1000":
            if (product.price >= 1000) {
              isMatched = false;
            }
            break;
          case "<5000":
            if (product.price >= 5000) {
              isMatched = false;
            }
            break;
          default:
            break;
        }
      }
      if (searchTerm !== "") {
        isMatched =
          isMatched &&
          product.title.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return isMatched;
    });

    setFilteredProducts(filteredProducts);

    if (searchTerm === "" && selectedCategory === "None" && price === "") {
      setFilteredProducts([]);
    }

    setSelectedItem(-1);
  };

  // click to searchbar
  const handleClick = () => {
    setSearchBarStatus(true);
  };

  // handle click outside
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchBarRef.current &&
      !searchBarRef.current.contains(event.target as Node) &&
      categoriesRef.current &&
      !categoriesRef.current.contains(event.target as Node) &&
      priceRef.current &&
      !priceRef.current.contains(event.target as Node)
    ) {
      setSearchBarStatus(false);
    }
  };

  const handleMainDivClick = () => {
    setSearchBarStatus(false);
  };

  document.addEventListener("click", handleClickOutside);
  emptyDivRef.current?.addEventListener("click", handleMainDivClick);

  return () => {
    document.removeEventListener("click", handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    emptyDivRef.current ?.removeEventListener("click", handleMainDivClick);
  };
}, [setSearchBarStatus]);


// RETURN HERE
  return (
    // main div with flex-col and 2 child div 
    <div className="flex flex-col w-full h-full"> 

    {/* searchbar div */}
    <div className="flex flex-1 justify-center w-full" ref={searchBarRef}>
      <div
        className={`p-1 rounded-lg flex justify-between flex-col ${
          searchBarStatus ? "w-full h-auto border-2 p-3" : ""
        }`}
      >

        <div className="relative flex justify-between items-center">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <FiSearch className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            id="search-input"
            onClick={handleClick}
            onChange={handleSearch}
            ref={inputRef}
            className={`pl-10 pr-10 py-3 text-sm text-gray-900 border-none bg-gray-100 rounded-md outline-blue-600 ${
              searchBarStatus ? "w-full" : ""
            }`}
            placeholder="Search"
            required
          />
  
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
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
            <span className="text-gray-500 text-xs cursor-pointer">
              <LuLayoutList className="h-4 w-5 text-black cursor-pointer" />
            </span>
  
            <HiOutlineBackspace
              className="h-4 w-5 text-gray-500 cursor-pointer"
              onClick={handleClear}
            />
          </div>
        </div>
  
  {/* pop up div for searchbar */}
        {searchBarStatus && (
          <div className="my-2 h-40 overflow-y-auto overflow-x-hidden" ref={listRef}>
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
  
  {/* navigation information div  */}
        {searchBarStatus && (
          <div className="">
            <div className="flex items-center w-full justify-start">
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
  
  {/* div containing select items */}
      <div className={`flex flex-col md:flex-row h-full m-3 ${searchBarStatus ? "" : "hidden"}`}>
        <Categories
          category={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
  
        <Price price={price} onPriceChange={handlePriceChange} />
      </div>
    </div>
    {/* empty div : when clicked closes pop up searchbar */}
    <div className="flex-1" ref={emptyDivRef}>
      {/* empty div */}
    </div>
  </div>
  

  );
}
