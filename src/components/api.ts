import axios from "axios";

const fetchProducts = () => {
  return axios.get("https://fakestoreapi.com/products");
};

export default fetchProducts;
