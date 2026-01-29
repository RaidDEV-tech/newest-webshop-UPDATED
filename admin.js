import { auth, db } from "./firebase.js";
import { Toast } from "./utils.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { addDoc, collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const ADMIN_EMAIL = "chougnayt@gmail.com";

onAuthStateChanged(auth, user => {
  if (!user || user.email !== ADMIN_EMAIL) {
    Toast.error("Access Denied", "Admin access required");
    setTimeout(() => location.href = "index.html", 1500);
  } else {
    Toast.success("Welcome Admin!", "You have access to this panel");
    loadProducts();
  }
});

/* ===== TAB SWITCHING ===== */
window.switchTab = (tabName) => {
  // Hide all tabs
  document.getElementById("coursesTab").classList.remove("active");
  document.getElementById("productsTab").classList.remove("active");
  document.getElementById("ordersTab").classList.remove("active");
  
  // Remove active class from all buttons
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  
  // Show selected tab
  if (tabName === "courses") {
    document.getElementById("coursesTab").classList.add("active");
    document.querySelectorAll(".tab-btn")[0].classList.add("active");
  } else if (tabName === "products") {
    document.getElementById("productsTab").classList.add("active");
    document.querySelectorAll(".tab-btn")[1].classList.add("active");
    loadProducts();
  } else if (tabName === "orders") {
    document.getElementById("ordersTab").classList.add("active");
    document.querySelectorAll(".tab-btn")[2].classList.add("active");
    loadOrders();
  }
};

/* ===== COURSE MANAGEMENT ===== */
window.addCourse = async () => {
  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const img = document.getElementById("img").value;
  const desc = document.getElementById("desc").value;

  if (!title || !price || !img) {
    Toast.error("Validation Error", "Please fill in title, price, and image");
    return;
  }

  try {
    await addDoc(collection(db, "courses"), {
      title: title,
      price: Number(price),
      img: img,
      desc: desc,
      createdAt: new Date()
    });
    
    Toast.success("Course Added!", "The course has been added successfully");
    document.getElementById("title").value = "";
    document.getElementById("price").value = "";
    document.getElementById("img").value = "";
    document.getElementById("desc").value = "";
  } catch (error) {
    Toast.error("Error", error.message);
  }
};

/* ===== PRODUCT MANAGEMENT ===== */
window.addProduct = async () => {
  const name = document.getElementById("productName").value.trim();
  const price = document.getElementById("productPrice").value;
  const stock = document.getElementById("productStock").value;
  const category = document.getElementById("productCategory").value;
  const img = document.getElementById("productImg").value.trim();
  const desc = document.getElementById("productDesc").value.trim();
  const sku = document.getElementById("productSku").value.trim();

  if (!name || !price || !stock || !img) {
    Toast.error("Validation Error", "Please fill in name, price, stock, and image");
    return;
  }

  try {
    await addDoc(collection(db, "products"), {
      name: name,
      price: Number(price),
      stock: Number(stock),
      category: category,
      img: img,
      desc: desc,
      sku: sku || null,
      createdAt: new Date(),
      updated: new Date()
    });
    
    Toast.success("Product Added!", `${name} has been added to your store`);
    
    // Clear form
    document.getElementById("productName").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productStock").value = "";
    document.getElementById("productImg").value = "";
    document.getElementById("productDesc").value = "";
    document.getElementById("productSku").value = "";
    
    // Reload products list
    loadProducts();
  } catch (error) {
    Toast.error("Error Adding Product", error.message);
  }
};

window.loadProducts = async () => {
  try {
    const snap = await getDocs(collection(db, "products"));
    const productsList = document.getElementById("productsList");
    
    if (snap.empty) {
      productsList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--muted); padding: 40px;">No products yet. Create your first product above!</p>';
      return;
    }

    productsList.innerHTML = "";
    snap.forEach(doc => {
      const p = doc.data();
      const categoryEmojis = {
        electronics: "🔌",
        components: "🔩",
        boards: "📱",
        accessories: "🎧",
        other: "📦"
      };

      productsList.innerHTML += `
        <div class="product-item">
          <img src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300x180?text=Product'">
          <div class="product-item-content">
            <h4>${p.name}</h4>
            <div style="font-size: 0.8rem; color: var(--muted); margin-bottom: 8px;">
              ${categoryEmojis[p.category] || "📦"} ${p.category}
            </div>
            <div class="product-item-price">€${p.price.toFixed(2)}</div>
            <div class="product-item-stock">
              📦 Stock: <strong>${p.stock}</strong>
              ${p.stock < 10 ? '<span style="color: #f43f5e;">⚠️ Low stock</span>' : ''}
            </div>
            <div class="product-item-actions">
              <button class="btn-edit" onclick="editProduct('${doc.id}')">✏️ Edit</button>
              <button class="btn-delete" onclick="deleteProduct('${doc.id}', '${p.name}')">🗑️ Delete</button>
            </div>
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error loading products:", error);
    Toast.error("Error", "Failed to load products");
  }
};

window.deleteProduct = async (id, name) => {
  if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

  try {
    await deleteDoc(doc(db, "products", id));
    Toast.success("Deleted!", `${name} has been removed`);
    loadProducts();
  } catch (error) {
    Toast.error("Error", "Failed to delete product");
  }
};

window.editProduct = (id) => {
  Toast.info("Coming Soon", "Product editing will be available soon");
  // TODO: Implement product editing
};

/* ===== ORDERS MANAGEMENT ===== */
window.loadOrders = () => {
  // TODO: Implement order management
  const totalOrders = document.getElementById("totalOrders");
  const totalRevenue = document.getElementById("totalRevenue");
  const pendingOrders = document.getElementById("pendingOrders");
  const completedOrders = document.getElementById("completedOrders");

  // Sample data for now
  totalOrders.innerText = "0";
  totalRevenue.innerText = "€0";
  pendingOrders.innerText = "0";
  completedOrders.innerText = "0";

  const ordersList = document.getElementById("ordersList");
  ordersList.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 40px;">No orders yet. When customers purchase, they will appear here!</p>';
};
