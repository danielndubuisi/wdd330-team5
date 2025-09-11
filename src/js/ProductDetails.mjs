import { 
  getLocalStorage, 
  setLocalStorage, 
  productIsInArray, 
  findProductIndexInArrayById, 
  getResponsiveImage 
} from "./utils.mjs";

export default class ProductDetails {

  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // Fetch product data by Id
    this.product = await this.dataSource.findProductById(this.productId);

    // Render details on the page
    this.renderProductDetails();

    // Attach add-to-cart button listener
    document
      .getElementById('addToCart')
      .addEventListener('click', this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    const productId = this.product.Id;

    if (cartItems.length !== 0 && productIsInArray(productId, cartItems)) {
      // If product already exists in cart, increase quantity
      const itemIndex = findProductIndexInArrayById(productId, cartItems);
      cartItems[itemIndex].Quantity++;
      setLocalStorage("so-cart", cartItems);
    } else {
      // Otherwise add it as a new item with Quantity = 1
      this.product.Quantity = 1;
      cartItems.push(this.product);
      setLocalStorage("so-cart", cartItems);
    }
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

// Template for product details
function productDetailsTemplate(product) {
  document.querySelector('h2').textContent = product.Brand.Name;
  document.querySelector('h3').textContent = product.NameWithoutBrand;

  const productImage = document.getElementById('productImage');
  productImage.src = getResponsiveImage(product);
  productImage.alt = product.NameWithoutBrand;

  document.getElementById('productFinalPrice').textContent = `$${product.FinalPrice}`;
  document.getElementById('productDesc').innerHTML = product.DescriptionHtmlSimple;
  document.getElementById('addToCart').dataset.id = product.Id;
}
