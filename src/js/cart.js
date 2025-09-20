import { getLocalStorage } from "./utils.mjs";
import CartList from "./shoppingCart.mjs";

const listElement = document.querySelector(".cart-list");

const cartList = new CartList("so-cart", listElement);

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  //check if cart is empty
  if (!cartItems || cartItems.length === 0) {
    document.querySelector(".cart-list").innerHTML =
      "<p>Your cart is empty.</p>";
    return;
  }

  // if cart not empty, render the cart items and calculate total
  cartList.init();

  const cartTotal = () => {
    let total = 0;
    cartItems.forEach((item) => {
      total += item.FinalPrice;
    });
    return total.toFixed(2);
  };

  const totalAmount = cartTotal();

  document.getElementById("total").innerHTML = `${totalAmount}`;
}

renderCartContents();

// When the cart page loads, and after it has pulled any cart items from local storage check to see if there is anything in the cart
// If there are items in the cart, show the html element added above, then calculate the total of the items, create some HTML to display it ($${total}) and insert it into the element.
