// This class is responsible for rendering a list of products into HTML
// We export it as default so it can be imported in main.js

export default class ProductList {
  constructor(category, dataSource, listElement) {
    // Store constructor parameters for later use
    this.category = category;   // ex: "tents"
    this.dataSource = dataSource; // instance of ProductData
    this.listElement = listElement; // target DOM element (like <ul class="product-list">)
  }

  // init() loads data and then renders it
  async init() {
    // fetch product data using dataSource (returns a Promise)
    const list = await this.dataSource.getData();

    // call renderList to display products
    this.renderList(list);
  }

  // render the entire product list
  renderList(list) {
    // clear any old content first
    this.listElement.innerHTML = "";

    // loop through each product and render a card
    list.forEach(product => {
      const item = this.renderProductCard(product);
      this.listElement.appendChild(item);
    });
  }

  // render a single product card (HTML element)
  renderProductCard(product) {
    const li = document.createElement("li");
    li.classList.add("product-card");

    li.innerHTML = `
      <a href="product.html?id=${product.Id}">
        <img src="${product.Image}" alt="${product.Name}">
        <h2>${product.Name}</h2>
        <p class="price">$${product.FinalPrice}</p>
      </a>
    `;

    return li;
  }
}
// This class is responsible for rendering a list of products into HTML
// We export it as default so it can be imported in main.js