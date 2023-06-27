import { useEffect, useState, useRef, KeyboardEvent } from "react";
import { FiSearch, FiArrowUp, FiArrowDown } from "react-icons/fi";
import { AiOutlineEnter } from "react-icons/ai";
import { HiOutlineBackspace } from "react-icons/hi";
import { LuLayoutList } from "react-icons/lu";

// api
import fetchProducts from "./api";
import Categories from "./Categories";
import Price from "./Price";

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

  // categories state
  const [selectedCategory, setSelectedCategory] = useState("");

  // price prop and state
  const { priceValue } = props;
  const [price, setPrice] = useState(priceValue);

  // handle category value change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // function for price change
  const handlePriceChange = (value: string) => {
    setPrice(value);
  };

  // navigation effect
  useEffect(() => {
    // up and down arrows
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
      } else if (
        (event.ctrlKey || event.key === "Control") && //CTRL K
        event.key === "k"
      ) {
        event.preventDefault();
        setSearchBarStatus(true);

        if (inputRef.current) {
          inputRef.current.focus();
        }
      } else if (event.key === "Enter") {
        //ENTER KEY
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

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    setFilteredProducts([]); // clear filtered products
  };

  // filter and search
  const handleSearch = () => {
    const searchTerm = inputRef.current?.value || "";
    const filteredProducts = products.filter((product) => {
      let isMatched = true;
      // Category filter
      if (selectedCategory !== "None" && product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        isMatched = false;
      }
      // Price filter
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
      // Title filter
      if (searchTerm !== "") {
        isMatched = isMatched && product.title.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return isMatched;
    });
  
    setFilteredProducts(filteredProducts);
  
    if (searchTerm === "" && selectedCategory === "None" && price === "") {
      setFilteredProducts([]);
    }
  
    setSelectedItem(-1);
  };
  
  // click on input ref
  const handleClick = () => {
    setSearchBarStatus(true);
  };

  return (
    <div className={` flex justify-center w-full`} ref={searchBarRef}>
      <div
        className={`p-1 rounded-lg flex justify-between flex-col ${
          searchBarStatus ? "w-full h-auto border-2 p-3" : ""
        }`}
      >
        {/* DIV CONTAINING CATEGORIES AND KBD */}
        <div className="relative flex justify-between items-center">
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
            <span className="text-gray-500 text-xs cursor-pointer">
              <LuLayoutList className="h-4 w-5 text-black cursor-pointer" />
            </span>

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
        {/* navigation instructions */}
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

      <div className={`flex h-full m-3 ${searchBarStatus ? "" : "hidden"}`}>
        <Categories
          category={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        <Price price={price} onPriceChange={handlePriceChange} />
      </div>
    </div>
  );
}
