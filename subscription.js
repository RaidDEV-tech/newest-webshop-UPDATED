import { db, auth } from "./firebase.js";
import { setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { Toast } from "./utils.js";

let isYearly = false;

// Toggle between monthly and yearly billing
window.toggleBilling = () => {
  isYearly = !isYearly;
  const toggle = document.getElementById("billingToggle");
  const monthlyLabel = document.querySelector(".toggle-label.monthly-active");
  const yearlyLabel = document.querySelectorAll(".toggle-label")[1];
  const premiumPrice = document.getElementById("premiumPrice");
  const premiumPeriod = document.getElementById("premiumPeriod");
  const planSubtext = document.getElementById("planSubtext");
  
  if (isYearly) {
    toggle.classList.add("yearly");
    monthlyLabel.classList.remove("monthly-active");
    yearlyLabel.classList.add("monthly-active");
    premiumPrice.innerText = "175";
    premiumPeriod.innerText = "/year";
    planSubtext.innerText = "Billed annually (Save €5!)";
  } else {
    toggle.classList.remove("yearly");
    monthlyLabel.classList.add("monthly-active");
    yearlyLabel.classList.remove("monthly-active");
    premiumPrice.innerText = "15";
    premiumPeriod.innerText = "/month";
    planSubtext.innerText = "Billed monthly";
  }
};

// Handle plan selection
window.selectPlan = async (plan) => {
  const currentUser = auth.currentUser;

  if (plan === "basic") {
    Toast.success("Welcome", "You're on the Basic plan. Start exploring!");
    return;
  }

  if (plan === "premium") {
    if (!currentUser) {
      showSubscriptionModal("premium");
      return;
    }

    try {
      // Get current subscription status
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.subscription === "premium") {
          Toast.info("Already Premium", "You already have a premium subscription!");
          return;
        }
      }

      // Calculate price
      const price = isYearly ? 175 : 15;
      const billingPeriod = isYearly ? "yearly" : "monthly";

      // Save subscription to Firebase
      await setDoc(userRef, {
        subscription: "premium",
        subscriptionPrice: price,
        subscriptionBillingPeriod: billingPeriod,
        subscriptionStartDate: new Date().toISOString(),
        premiumFeatures: {
          allCourses: true,
          downloadMaterials: true,
          projectAccess: true,
          unlimitedChatbot: true,
          prioritySupport: true,
          certificates: true
        }
      }, { merge: true });

      Toast.success("Premium Activated!", `Welcome to Premium! You now have access to all courses, projects, and unlimited chatbot support.`);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = "profile.html";
      }, 2000);

    } catch (error) {
      console.error("Error upgrading subscription:", error);
      Toast.error("Error", "Failed to upgrade subscription: " + error.message);
    }
  }
};

// Show subscription modal for non-logged-in users
window.showSubscriptionModal = (plan) => {
  const modal = document.getElementById("subscriptionModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalText = document.getElementById("modalText");

  if (plan === "premium") {
    modalTitle.innerText = "Upgrade to Premium";
    modalText.innerText = "To subscribe to our Premium plan, please log in or create an account first.";
  }

  modal.style.display = "flex";
};

// Close subscription modal
window.closeSubscriptionModal = () => {
  const modal = document.getElementById("subscriptionModal");
  modal.style.display = "none";
};

// Toggle FAQ items
window.toggleFAQ = (element) => {
  const faqItem = element.parentElement;
  faqItem.classList.toggle("active");
};

// Close modal when clicking outside
window.addEventListener("click", (e) => {
  const modal = document.getElementById("subscriptionModal");
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Check user subscription status on page load
document.addEventListener("DOMContentLoaded", () => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      checkUserSubscription(user);
    }
  });
});

async function checkUserSubscription(user) {
  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      if (userData.subscription === "premium") {
        // Show premium user info
        console.log("User is premium member");
      }
    }
  } catch (error) {
    console.error("Error checking subscription:", error);
  }
}
