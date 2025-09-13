import { getLocalStorage, setLocalStorage, getResponsiveImage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // fetch product data
    this.product = await this.dataSource.findProductById(this.productId);

    if (!this.product) {
      document.querySelector(".product-detail").innerHTML =
        "<p>Product not found.</p>";
      return;
    }

    // render page
    this.renderProductDetails();

    // hook up Add to Cart button
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    const productId = this.product.Id;

    // check if already in cart
    const existingIndex = cartItems.findIndex((item) => item.Id === productId);

    if (existingIndex > -1) {
      cartItems[existingIndex].Quantity =
        (cartItems[existingIndex].Quantity || 1) + 1;
    } else {
      const newItem = { ...this.product, Quantity: 1 };
      cartItems.push(newItem);
    }

    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  const discountAmount = product.SuggestedRetailPrice - product.FinalPrice;
  const isDiscounted = discountAmount > 0;

  // update ribbon
  const ribbonElement = document.getElementById("discountRibbon");
  if (ribbonElement) {
    if (isDiscounted) {
      ribbonElement.textContent = `SAVE $${discountAmount.toFixed(2)}!`;
      ribbonElement.style.display = "block";
    } else {
      ribbonElement.style.display = "none";
    }
  }

  // brand + name
  document.querySelector("h3").textContent = product.Brand?.Name || "";
  document.querySelector("h2.divider").textContent =
    product.NameWithoutBrand || product.Name || "";

  // image
  const productImage = document.getElementById("productImage");
  productImage.src = getResponsiveImage(product);
  productImage.alt = product.NameWithoutBrand || product.Name || "";

  // prices
  document.querySelector("#productFinalPrice").textContent = `$${product.FinalPrice}`;
  document.querySelector("#productPrice").textContent = `$${product.SuggestedRetailPrice}`;
  document.querySelector("#savePrice").textContent = isDiscounted
    ? `You save $${discountAmount.toFixed(2)}`
    : "";

  // color + description
  document.querySelector("#productColor").textContent =
    product.Colors?.[0]?.ColorName || "";
  document.querySelector("#productDesc").innerHTML =
    product.DescriptionHtmlSimple || product.Description || "";

  // button
  document.getElementById("addToCart").dataset.id = product.Id;
}
