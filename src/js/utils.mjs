// =========================
// Utility Functions
// =========================

// wrapper for querySelector...returns the first matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// -------------------------
// LocalStorage Helpers
// -------------------------

// retrieve data from localStorage and parse it as JSON
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// save data to localStorage as JSON
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// -------------------------
// Event Listener Helpers
// -------------------------

// set a listener for both touchend (mobile) and click (desktop)
// ensures compatibility across devices
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// -------------------------
// URL Parameter Helper
// -------------------------

// get a query parameter from the URL (e.g. ?product=123 → returns "123")
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product;
}

// -------------------------
// Rendering Helpers
// -------------------------

// render a list of items using a template function
// inserts all items into a parentElement at a chosen position
export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false) {
  clear ? parentElement.innerHTML = "" : 0;
  const htmlStrings = list.map(templateFn);
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// render a single template with optional callback
// usually used for header/footer or single product details
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

// -------------------------
// Template Loader
// -------------------------

// load an external HTML file and return it as text (async)
//export async function loadTemplate(path) {
 // const item = await fetch(path);
 // const template = item.text();
 // return template;
//}
export async function loadTemplate(path, elementId) {
  try {
    // Fetch the template file
    const response = await fetch(path);
    const template = await response.text();

    // Insert into the placeholder
    document.getElementById(elementId).innerHTML = template;
  } catch (err) {
    console.error(`Error loading in template ${path}:`, err);
  }
}
// -------------------------
// Header & Footer Loader
// -------------------------

// load header and footer templates, render them, and update cart count
export async function loadHeaderFooter() {
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");
  const headerContent = await loadTemplate("../partials/header.html");
  const footerContent = await loadTemplate("../partials/footer.html");

  renderWithTemplate(headerContent, header);
  renderWithTemplate(footerContent, footer);

  updateCartCount();
}

// update cart count shown in header (based on items in localStorage)
function updateCartCount() {
  const countElement = document.querySelector(".cart-count");
  const cart = JSON.parse(localStorage.getItem("so-cart")) || [];
  if (countElement) {
    countElement.textContent = cart.length;
  }
}

// -------------------------
// Array Helpers
// -------------------------

// find index of an object in an array by matching a specific attribute and value
export function getLocalStorageItemIndex(array, attr, value) {
  let i = array.length;
  let indexNumber = 0;
  while (i--) {
    if (array[i] && array[i].hasOwnProperty(attr) && (arguments.length > 2 && array[i][attr] === value)) {
      indexNumber = i;
    }
  }
  return indexNumber;
}

// capitalize the first letter of a string
export function capitalizeFirstLetter(text) {
  return String(text).charAt(0).toUpperCase() + String(text).slice(1);
}

// check if a product is already in an array (by product Id)
export function productIsInArray(productId, array) {
  let IsTrue = false;
  array.forEach(item => {
    if (item.Id == productId) {
      IsTrue = true;
    }
  });
  return IsTrue;
}

// find the index of a product in an array (by product Id)
export function findProductIndexInArrayById(productId, array) {
  let i = 0;
  let index = 0;
  array.forEach(item => {
    if (item.Id == productId) {
      index = i;
    } else {
      i++;
    }
  });
  return index;
}

// remove a key completely from localStorage
export function removeLocalStorageKey(key) {
  localStorage.removeItem(key);
}

// -------------------------
// Image Helpers
// -------------------------

// get the correct product image depending on screen width
// uses responsive sizes (Small, Medium, Large, ExtraLarge)
// also fixes relative paths like "../images/" → "/images/"
export function getResponsiveImage(product) {
  const width = window.innerWidth;

  /**
   * Normalize relative image paths.
   * Many product images are stored with "../" at the beginning (e.g. "../images/product.jpg"),
   * which breaks when loaded in the browser. This helper strips "../" and replaces it with "/",
   * turning it into a valid absolute path (e.g. "/images/product.jpg").
   *
   * Example:
   *   fixPath("../images/item.png") → "/images/item.png"
   *   fixPath("images/item.png")    → "images/item.png"  (unchanged)
   */
  function fixPath(path) {
    if (!path) return "";
    return path.replace(/^\.\.\//, "/");
  }

  let images = product.Images || {};

  if (width < 600 && images?.PrimarySmall) {
    return fixPath(images.PrimarySmall);
  }
  if (width < 800 && images?.PrimaryMedium) {
    return fixPath(images.PrimaryMedium);
  }
  if (width < 1440 && images?.PrimaryLarge) {
    return fixPath(images.PrimaryLarge);
  }
  return fixPath(
    images?.PrimaryExtraLarge || product.PrimaryExtraLarge || product.Image
  );
}
