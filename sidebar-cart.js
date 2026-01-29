import { db } from "./firebase.js";
import { Toast } from "./utils.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const sidebar = document.getElementById("cartSidebar");
const list = document.getElementById("cartSidebarList");
const totalEl = document.getElementById("cartSidebarTotal");
const cartCount = document.getElementById("cartCount");

window.toggleCart = async () => {
  if (sidebar) {
    sidebar.classList.toggle("show");
    await loadCart();
  }
};

window.goToCheckout = () => location.href = "cart.html";

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  if (cartCount) cartCount.innerText = `(${cart.length})`;
}

async function loadCart() {
  if (!list || !totalEl) return;
  list.innerHTML = "";
  let total = 0;
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  if (cart.length === 0) {
    list.innerHTML = "<p style='color: var(--muted); text-align: center; padding: 20px;'>Your cart is empty</p>";
    totalEl.innerText = "Totaal: €0";
    return;
  }

  for (const item of cart) {
    try {
      let itemData = null;
      let itemId = null;
      let itemPrice = 0;
      let itemName = "";

      // Check if it's an object (project) or string (course ID)
      if (typeof item === 'object' && item.id) {
        // Project item
        itemData = item;
        itemId = item.id;
        itemPrice = item.price || 0;
        itemName = item.name || "Unknown";
      } else {
        // Course ID - fetch from Firestore
        itemId = item;
        const snap = await getDoc(doc(db, "courses", itemId));
        if (!snap.exists()) continue;
        itemData = snap.data();
        itemPrice = itemData.price || 0;
        itemName = itemData.title || "Unknown";
      }

      total += itemPrice;
      list.innerHTML += `<div style="padding: 10px 0; border-bottom: 1px solid var(--border);"><strong>${itemName}</strong><br>€${itemPrice.toFixed(2)}<button onclick="removeFromCart('${itemId}')" style="float: right; background: none; border: none; color: #f87171; cursor: pointer;">✕</button></div>`;
    } catch (error) {
      console.error("Error loading item:", error);
    }
  }
  totalEl.innerText = "Totaal: €" + total.toFixed(2);
}

window.removeFromCart = (id) => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  
  // Handle both string IDs and object items
  const filtered = cart.filter(item => {
    if (typeof item === 'object') {
      return item.id !== id;
    }
    return item !== id;
  });

  localStorage.setItem("cart", JSON.stringify(filtered));
  updateCartCount();
  Toast.success("Removed", "Item removed from cart");
  loadCart();
};

// Update cart count on page load
updateCartCount();

