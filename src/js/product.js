import { getLocalStorage, setLocalStorage, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");
const productId = getParam("product");  // ✅ fixed

// load and render the product
loadProduct(productId);

async function loadProduct(productId) {
  const product = await dataSource.findProductById(productId);
  renderProductDetails(product);
}

function renderProductDetails(product) {
  const container = document.querySelector(".product-detail");

  // calculate discount
  let discountHTML = "";
  if (product.SuggestedRetailPrice && product.FinalPrice) {
    const discount = Math.round(
      ((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100
    );
    if (discount > 0) {
      discountHTML = `<span class="product__discount">Save ${discount}%</span>`;
    }
  }

  container.innerHTML = `
    <h3>${product.Brand || ""}</h3>
    <h2 class="divider">${product.Name}</h2>
    <img class="divider" src="${product.Image}" alt="${product.Name}" />
    <p class="product-card__price">
      $${product.FinalPrice}
      ${
        product.SuggestedRetailPrice > product.FinalPrice
          ? `<span class="product__retail">Reg. $${product.SuggestedRetailPrice}</span>`
          : ""
      }
    </p>
    ${discountHTML}
    <p class="product__color">${product.Colors || ""}</p>
    <p class="product__description">${product.Description || ""}</p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div>
  `;

  document.getElementById("addToCart")
    .addEventListener("click", () => addProductToCart(product));
}

function addProductToCart(product) {
  let cart = getLocalStorage("so-cart");
  if (!Array.isArray(cart)) {
    cart = [];
  }
  cart.push(product);
  setLocalStorage("so-cart", cart);
}
