import { db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
import { Toast } from "./utils.js";

const cartList = document.getElementById("cartList");
const totalEl = document.getElementById("total");

let total = 0;

async function displayCart() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  if (!cartList) return;

  if (cart.length === 0) {
    cartList.innerHTML = "<p style='text-align: center; color: var(--muted); padding: 40px;'>Your cart is empty. <a href='courses.html' style='color: var(--primary); text-decoration: none;'>Continue shopping</a></p>";
    if (totalEl) totalEl.innerText = "Totaal: €0";
    return;
  }

  cartList.innerHTML = "";
  total = 0;

  for (const item of cart) {
    try {
      let itemData = null;
      let itemId = null;
      let itemPrice = 0;

      // Check if it's an object (project) or string (course ID)
      if (typeof item === 'object' && item.id) {
        // Project item
        itemData = item;
        itemId = item.id;
        itemPrice = item.price || 0;
      } else {
        // Course ID - fetch from Firestore
        itemId = item;
        const snap = await getDoc(doc(db, "courses", itemId));
        if (!snap.exists()) continue;
        itemData = snap.data();
        itemPrice = itemData.price || 0;
      }

      total += itemPrice;

      const displayName = itemData.name || itemData.title || "Unknown Item";
      const displayImage = itemData.image || itemData.img || 'https://via.placeholder.com/300?text=Product';
      const displayDesc = itemData.description || itemData.desc || "No description";

      cartList.innerHTML += `
        <div class="card">
          <img src="${displayImage}" alt="${displayName}" style="width: 100%; height: 200px; object-fit: cover;" onerror="this.src='https://via.placeholder.com/300?text=Product'">
          <div class="card-body">
            <h3>${displayName}</h3>
            <p class="card-desc">${displayDesc}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <strong class="card-price">€${itemPrice.toFixed(2)}</strong>
              <button class="btn secondary" onclick="removeFromCart('${itemId}')">Remove</button>
            </div>
          </div>
        </div>
      `;
    } catch (error) {
      console.error("Error loading item:", error);
    }
  }

  if (totalEl) {
    totalEl.innerText = "Totaal: €" + total.toFixed(2);
  }
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
  Toast.success("Removed", "Item removed from cart");
  setTimeout(() => location.reload(), 500);
};

window.checkout = () => {
  Toast.info("Stripe", "Payment integration coming soon! 🔜");
};

// Display cart on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', displayCart);
} else {
  displayCart();
}
