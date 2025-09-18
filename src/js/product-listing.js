import { loadHeaderFooter, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

// Load header and footer
loadHeaderFooter();
// Get category from URL parameters (default to "tents" if not provided)
const category = getParam("category") || "tents";

// Initialize product data and create a data source for tents (points to tents.json)
const dataSource = new ProductData();

// Find the <ul class="product-list"> element in your index.html
const listElement = document.querySelector(".product-list");

// Create an instance of ProductList
// parameter order: (category, dataSource, listElement)
const productList = new ProductList(category, dataSource, listElement);
// Update title
document.querySelector(".title").textContent = category;

// Initialize it (this will fetch JSON + render products)
productList.init();