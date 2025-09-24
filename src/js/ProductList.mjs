
import { renderListWithTemplate, getResponsiveImage } from "./utils.mjs";

// Template for a single product card
function productCardTemplate(product) {
  const isDiscounted = product.FinalPrice < product.SuggestedRetailPrice;

  return `<li class="product-card">
    <a href="/product_pages/?product=${product.Id}">
      <img src="${getResponsiveImage(product)}" alt="Image of ${product.Name}">
      <h2 class="card__brand">${product.Brand.Name}</h2>
      <h3 class="card__name">${product.Name}</h3>
      <p class="product-card__price">
        $${product.FinalPrice}
        ${isDiscounted ? `<span class="discount-flag">Discount!</span>` : ""}
      </p>
    </a>
  </li>`;
}

// ProductList class
export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const productList = await this.dataSource.getData();
    if (!productList || productList.length === 0) {
      this.listElement.innerHTML = "<p>No products found.</p>";
      return;
    }
    this.renderList(productList);

    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
  }

  renderList(productList) {
    renderListWithTemplate(this.productCardTemplate, this.listElement, productList);
  }
  // Template for a single product card
  productCardTemplate(product) {
    const discountAmount = product.SuggestedRetailPrice - product.FinalPrice;
    const isDiscounted = discountAmount > 0;
    const discountPercent = isDiscounted
      ? Math.round((discountAmount / product.SuggestedRetailPrice) * 100)
      : 0;

    return `
      <li class="product-card" id="${product.Id}">
        <a href="/product_pages/?product=${product.Id}">
          <div class="product-image-wrapper">
            <!-- Use PrimaryMedium image from API for listing -->
            <img src="${product.Images?.PrimaryMedium}" 
                 alt="${product.NameWithoutBrand || product.Name}" />
            ${
              isDiscounted
                ? `<span class="discount-badge">Save ${discountPercent}%</span>`
                : ""
            }
          </div>
          <h3>${product.Brand?.Name || ""}</h3>
          <h2>${product.NameWithoutBrand || product.Name}</h2>
          <p class="product-card__priceDiscount">$${product.FinalPrice}</p>
          <del><p class="product-card__price">$${product.SuggestedRetailPrice}</p></del>
        </a>
      </li>
    `;
  }
}
