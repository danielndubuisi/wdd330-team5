// import the ProductData module (responsible for fetching product data from tents.json)
import ProductData from "./ProductData.mjs";
// import the ProductList module (responsible for rendering the product list to the page)
import ProductList from "./ProductList.mjs";

// Create a new data source for tents
const dataSource = new ProductData("tents");

// Find the <ul class="product-list"> in index.html where we want products to show
const listElement = document.querySelector(".product-list");

// Create an instance of ProductList (category, data source, output element)
const productList = new ProductList("tents", dataSource, listElement);
// Initialize the product list (this loads data and renders it)
productList.init();