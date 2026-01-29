import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const ADMIN_EMAIL = "chougnayt@gmail.com";

onAuthStateChanged(auth, user => {
  const login = document.getElementById("loginLink");
  const register = document.getElementById("registerLink");
  const profile = document.getElementById("profileBox");
  const admin = document.getElementById("adminLink");
  const cart = document.getElementById("cartBtn");
  const pic = document.getElementById("profilePic");

  if (!user) {
    if (login) login.style.display = "inline";
    if (register) register.style.display = "inline";
    if (profile) profile.style.display = "none";
    if (admin) admin.style.display = "none";
    if (cart) cart.style.display = "none";
    if (pic) pic.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect fill='%23000000' width='40' height='40'/%3E%3C/svg%3E";
    return;
  }

  if (login) login.style.display = "none";
  if (register) register.style.display = "none";
  if (profile) profile.style.display = "flex";
  if (cart) cart.style.display = "inline-flex";

  if (pic) {
    if (user.photoURL) {
      pic.src = user.photoURL;
    } else {
      // Generate consistent avatar based on email
      const initial = user.email ? user.email.charAt(0).toUpperCase() : "U";
      const colors = ["7c3aed", "06b6d4", "10b981", "f59e0b", "ef4444"];
      const colorIndex = (user.email || "user").charCodeAt(0) % colors.length;
      pic.src = `https://ui-avatars.com/api/?name=${initial}&background=${colors[colorIndex]}&color=fff&bold=true&size=40`;
    }
  }

  if (user.email === ADMIN_EMAIL) {
    if (admin) admin.style.display = "inline";
  }
});
