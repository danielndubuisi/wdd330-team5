// Class that loads a single product by id and renders the product detail HTML
import { getLocalStorage, setLocalStorage, getparam } from "./utils.mjs";

const productId = getParam("product"); 

export default class ProductDetails {
  constructor(productId, dataSource) {
    // productId (string), dataSource is instance of ProductData
    this.productId = productId;
    this.dataSource = dataSource;
    this.product = {}; // will hold the fetched product object
  }

  // initialize: fetch product then render and attach handlers
  async init() {
    // 1) fetch the product by id (findProductById returns a Promise)
    this.product = await this.dataSource.findProductById(this.productId);

    // 2) if product not found, show a simple error and exit
    if (!this.product) {
      console.error(`Product not found: ${this.productId}`);
      document.querySelector(".product-detail").innerHTML = "<p>Product not found.</p>";
      return;
    }

    // 3) render the product details into the DOM
    this.renderProductDetails();

    // 4) attach Add to Cart button listener (bind this so method sees correct `this`)
    const addBtn = document.getElementById("addToCart");
    if (addBtn) {
      addBtn.addEventListener("click", this.addProductToCart.bind(this));
    }
  }

  // add current product to cart in localStorage
  addProductToCart() {
    // get current cart array (or empty array if not present)
    const cartKey = "so-cart";
    const cart = getLocalStorage(cartKey) || [];

    // find existing item
    const existingIndex = cart.findIndex((item) => item.Id === this.product.Id);

    if (existingIndex > -1) {
      // increment quantity
      cart[existingIndex].Quantity = (cart[existingIndex].Quantity || 1) + 1;
    } else {
      // add new product copy with Quantity = 1
      const newItem = { ...this.product, Quantity: 1 };
      cart.push(newItem);
    }

    // save back to localStorage
    setLocalStorage(cartKey, cart);

    // optional: quick visual feedback
    // alert(`${this.product.NameWithoutBrand} added to cart`);
  }

  // Render product details into the page
  renderProductDetails() {
    // Fill brand / name / image / price / description
    const brandEl = document.getElementById("productBrand");
    const nameEl = document.getElementById("productName");
    const imgEl = document.getElementById("productImage");
    const priceEl = document.getElementById("productFinalPrice");
    const descEl = document.getElementById("productDesc");

    // Use safe property names depending on your JSON structure
    brandEl.textContent = this.product.Brand ? this.product.Brand.Name : "";
    nameEl.textContent = this.product.NameWithoutBrand || this.product.Name || "";
    // Image: try Images.PrimaryMedium, fallback to Image
    imgEl.src = (this.product.Images && this.product.Images.PrimaryMedium) || this.product.Image || "";
    imgEl.alt = this.product.NameWithoutBrand || this.product.Name || "";

    priceEl.textContent = `$${this.product.FinalPrice != null ? this.product.FinalPrice : ""}`;

    // Use DescriptionHtmlSimple if present, otherwise plain Description or empty string
    descEl.innerHTML = this.product.DescriptionHtmlSimple || this.product.Description || "";
  }
}
