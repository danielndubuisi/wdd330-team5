// Import the utility function to load header and footer
// Other imports can go here as needed
import { loadTemplate,loadHeaderFooter } from "./utils.mjs";
import "../css/style.css";

loadHeaderFooter();

// Load header and footer when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  loadTemplate("../partials/header.html", "header-placeholder");
  loadTemplate("../partials/footer.html", "footer-placeholder");
});
