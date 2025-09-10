// Import ProductData and ProductList classes
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

// Create a data source for tents (points to tents.json)
const dataSource = new ProductData("tents");

// Find the <ul class="product-list"> element in your index.html
const listElement = document.querySelector(".product-list");

// Create an instance of ProductList
const productList = new ProductList("tents", dataSource, listElement);

// Initialize it (this will fetch JSON + render products)
productList.init();
