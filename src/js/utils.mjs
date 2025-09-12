// src/js/utils.mjs

// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (e) {
    return null;
  }
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// set a listener for both touchend and click (utility)
export function setClick(selector, callback) {
  const el = qs(selector);
  if (!el) return;
  el.addEventListener("touchend", (event) => {
    event.preventDefault();
    callback(event);
  });
  el.addEventListener("click", callback);
}

// getParam - return a URL query parameter by name, e.g. getParam('product')
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// getResponsiveImage - small helper to choose an image path (fallbacks)
// product: the product object from JSON
export function getResponsiveImage(product) {
  if (!product) return "";
  // prefer an Images.PrimaryMedium if present (common convention)
  if (product.Images && product.Images.PrimaryMedium) return product.Images.PrimaryMedium;
  if (product.Image) return product.Image;
  return "";
}
