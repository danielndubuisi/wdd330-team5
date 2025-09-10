// ProductList.mjs
export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData();
    console.log("Full product list from JSON:", list);
    this.renderList(list);
  }

  renderList(productList) {
    this.listElement.innerHTML = "";
    productList.forEach((product) => {
      this.listElement.innerHTML += this.productCardTemplate(product);
    });
  }

  productCardTemplate(product) {
    return `
      <li class="product-card">
        <a href="product_pages/product-detail.html?product=${product.Id}">
          <img src="${product.Image}" alt="${product.Name}">
          <h2 class="card__name">${product.Name}</h2>
          <p class="card__price">$${product.FinalPrice}</p>
        </a>
      </li>
    `;
  }
}
