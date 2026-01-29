import { auth } from "./firebase.js";
import { Toast } from "./utils.js";
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInAnonymously,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateEmail,
  verifyBeforeUpdateEmail
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

/* --------------------
   🎁 SHOW LOGIN BONUS
-------------------- */
window.showLoginBonus = () => {
  const modal = document.createElement("div");
  modal.className = "bonus-modal show";
  modal.innerHTML = `
    <div class="bonus-card">
      <h2>🎉 Welcome!</h2>
      <p>You've unlocked a special welcome bonus!</p>
      <div class="discount-badge">5%</div>
      <p><strong>5% Welcome Discount</strong></p>
      <p>Use this on your first course purchase</p>
      <button class="btn" onclick="this.parentElement.parentElement.remove()">Awesome! Let's Go 🚀</button>
    </div>
  `;
  document.body.appendChild(modal);
  
  // Auto-close after 8 seconds
  setTimeout(() => {
    if (modal.parentElement) modal.remove();
  }, 8000);
};

/* --------------------
   🔹 GOOGLE LOGIN
-------------------- */
const provider = new GoogleAuthProvider();
window.googleLogin = async () => {
  try {
    await signInWithPopup(auth, provider);
    Toast.success("Welcome!", "Successfully logged in with Google");
    showLoginBonus();
    setTimeout(() => location.href = "index.html", 500);
  } catch (error) {
    Toast.error("Login Failed", error.message);
  }
};

/* --------------------
   🔹 EMAIL/PASSWORD LOGIN
-------------------- */
window.emailLogin = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  if (!email || !password) {
    Toast.error("Validation Error", "Please enter email and password");
    return;
  }
  try {
    await signInWithEmailAndPassword(auth, email, password);
    Toast.success("Welcome Back!", "Successfully logged in");
    showLoginBonus();
    setTimeout(() => location.href = "index.html", 500);
  } catch (error) {
    Toast.error("Login Failed", error.message);
  }
};

/* --------------------
   🔹 EMAIL/PASSWORD REGISTER
-------------------- */
window.emailRegister = async () => {
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const passwordConfirm = document.getElementById("regPasswordConfirm").value;

  if (!email || !password || !passwordConfirm) {
    Toast.error("Validation Error", "Please fill in all fields");
    return;
  }

  if (password !== passwordConfirm) {
    Toast.error("Password Mismatch", "Passwords do not match");
    return;
  }

  if (password.length < 6) {
    Toast.error("Weak Password", "Password must be at least 6 characters");
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    Toast.success("Account Created!", "Welcome to RaidServices!");
    showLoginBonus();
    setTimeout(() => location.href = "index.html", 500);
  } catch (error) {
    Toast.error("Registration Failed", error.message);
  }
};

/* --------------------
   🔹 PASSWORD RESET - MODAL
-------------------- */
window.openPasswordResetModal = () => {
  const modal = document.getElementById("resetModal");
  if (modal) {
    modal.style.display = "flex";
    const emailInput = document.getElementById("resetEmail");
    if (emailInput) emailInput.focus();
  }
};

window.closePasswordResetModal = () => {
  const modal = document.getElementById("resetModal");
  if (modal) {
    modal.style.display = "none";
    const resetEmail = document.getElementById("resetEmail");
    if (resetEmail) resetEmail.value = "";
  }
};

window.resetPassword = async () => {
  const email = document.getElementById("resetEmail")?.value.trim();
  
  if (!email) {
    Toast.error("Email Required", "Please enter your email address");
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Toast.error("Invalid Email", "Please enter a valid email address");
    return;
  }

  try {
    const btn = event?.target;
    if (btn) {
      btn.disabled = true;
      btn.innerText = "Sending...";
    }

    // Send reset email with custom action URL
    await sendPasswordResetEmail(auth, email, {
      url: window.location.origin + "/login.html",
      handleCodeInApp: false
    });

    Toast.success("✓ Email Sent!", 
      `Password reset link sent to:\n${email}\n\n📥 Check your Inbox first\n📨 Then check Spam/Junk folder\n📧 Look in Promotions tab if using Gmail`);
    
    // Close modal after 2 seconds
    setTimeout(() => {
      window.closePasswordResetModal();
    }, 2000);

  } catch (error) {
    console.error("Password reset error:", error);

    if (error.code === 'auth/user-not-found') {
      Toast.error("User Not Found", `No account found for: ${email}\n\nPlease register first or use correct email`);
    } else if (error.code === 'auth/invalid-email') {
      Toast.error("Invalid Email", "The email format is invalid");
    } else if (error.code === 'auth/too-many-requests') {
      Toast.error("Too Many Attempts", "Please wait 5 minutes before trying again");
    } else {
      Toast.error("Reset Failed", error.message || "Unable to send reset email");
    }

  } finally {
    const btn = event?.target;
    if (btn) {
      btn.disabled = false;
      btn.innerText = "Send Reset Email";
    }
  }
};

/* --------------------
   🔹 PASSWORD RESET - OLD
-------------------- */
window.sendResetEmail = async () => {
  const email = document.getElementById("email")?.value.trim();
  
  if (!email) {
    Toast.error("Email Required", "Please enter your email address");
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Toast.error("Invalid Email", "Please enter a valid email address");
    return;
  }

  try {
    const btn = event?.target;
    if (btn) {
      btn.disabled = true;
      btn.innerText = "Sending...";
    }

    // Configure reset email with custom action URL
    await sendPasswordResetEmail(auth, email, {
      url: window.location.origin + "/login.html",
      handleCodeInApp: false
    });

    Toast.success("Email Sent!", `Password reset link sent to:\n${email}\n\nCheck your inbox or spam folder.`);
    
    // Clear email field
    const emailInput = document.getElementById("email");
    if (emailInput) emailInput.value = "";

  } catch (error) {
    console.error("Password reset error:", error);

    // Specific error handling
    if (error.code === 'auth/user-not-found') {
      Toast.error("User Not Found", `No account found for: ${email}`);
    } else if (error.code === 'auth/invalid-email') {
      Toast.error("Invalid Email", "The email format is invalid");
    } else if (error.code === 'auth/too-many-requests') {
      Toast.error("Too Many Attempts", "Please try again later (wait a few minutes)");
    } else {
      Toast.error("Reset Failed", error.message || "Unable to send reset email. Please check your email is correct.");
    }

  } finally {
    const btn = event?.target;
    if (btn) {
      btn.disabled = false;
      btn.innerText = "Send Reset Email";
    }
  }
};

/* --------------------
   🔹 ANONYMOUS LOGIN
-------------------- */
window.anonymousLogin = async () => {
  try {
    await signInAnonymously(auth);
    Toast.success("Welcome!", "Logged in as guest");
    showLoginBonus();
    setTimeout(() => location.href = "index.html", 500);
  } catch (error) {
    Toast.error("Login Failed", error.message);
  }
};

/* --------------------
   🔹 PHONE LOGIN WITH MFA
-------------------- */
window.initRecaptcha = () => {
  if (window.recaptchaVerifier) return;
  
  const container = document.getElementById('recaptcha-container');
  if (!container) {
    Toast.error("Error", "reCAPTCHA container not found");
    return;
  }

  window.recaptchaVerifier = new RecaptchaVerifier(container, {
    'size': 'normal',
    'callback': (token) => {
      Toast.success("reCAPTCHA", "Verification complete");
    },
    'expired-callback': () => {
      Toast.warning("reCAPTCHA", "Challenge expired, please try again");
      resetRecaptcha();
    }
  }, auth);

  window.recaptchaVerifier.render().then(widgetId => {
    window.recaptchaWidgetId = widgetId;
  }).catch(error => {
    console.error("reCAPTCHA render error:", error);
    Toast.error("reCAPTCHA Error", "Failed to load reCAPTCHA");
    window.recaptchaVerifier = null;
  });
};

window.resetRecaptcha = () => {
  if (window.recaptchaWidgetId !== undefined && window.grecaptcha) {
    try {
      grecaptcha.reset(window.recaptchaWidgetId);
    } catch (e) {
      console.error("Reset error:", e);
    }
  }
};

window.showPhoneSection = () => {
  const phoneSection = document.getElementById("phoneSection");
  if (phoneSection) {
    phoneSection.style.display = "block";
    initRecaptcha();
    // Auto-focus phone input
    const phoneInput = document.getElementById("phoneNumber");
    if (phoneInput) phoneInput.focus();
  }
};

window.sendOTP = async () => {
  const phoneNumber = document.getElementById("phoneNumber")?.value.trim();
  
  if (!phoneNumber) {
    Toast.error("Phone Required", "Please enter your phone number");
    return;
  }

  // Validate international format
  if (!phoneNumber.startsWith("+") || phoneNumber.length < 10) {
    Toast.error("Invalid Format", "Use international format: +31612345678 or +1234567890");
    return;
  }

  // Initialize reCAPTCHA if not already done
  if (!window.recaptchaVerifier) {
    initRecaptcha();
  }

  const appVerifier = window.recaptchaVerifier;
  if (!appVerifier) {
    Toast.error("Error", "reCAPTCHA is not ready. Please try again.");
    return;
  }

  try {
    const sendButton = event.target;
    sendButton.disabled = true;
    sendButton.innerText = "Sending...";

    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    window.confirmationResult = confirmationResult;
    
    // Start countdown timer
    let timeLeft = 60;
    const timerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        sendButton.disabled = false;
        sendButton.innerText = "Resend SMS Code";
        Toast.info("Expired", "Code expired. Click to request a new one.");
      }
    }, 1000);

    Toast.success("Code Sent!", `Check your phone for the SMS code (expires in 60 seconds)`);
    
    // Auto-focus OTP input
    const otpInput = document.getElementById("otp");
    if (otpInput) otpInput.focus();

  } catch (error) {
    console.error("SMS Error:", error);
    
    // Specific error handling
    if (error.code === 'auth/invalid-phone-number') {
      Toast.error("Invalid Phone", "The phone number format is invalid");
    } else if (error.code === 'auth/too-many-requests') {
      Toast.error("Too Many Attempts", "Please try again later");
    } else {
      Toast.error("SMS Error", error.message || "Failed to send SMS");
    }

    // Reset button
    const sendButton = event.target;
    if (sendButton) {
      sendButton.disabled = false;
      sendButton.innerText = "Send SMS Code";
    }

    // Reset reCAPTCHA for retry
    resetRecaptcha();
  }
};

window.verifyOTP = async () => {
  const code = document.getElementById("otp")?.value.trim();

  if (!window.confirmationResult) {
    Toast.error("Error", "Please send an SMS code first");
    return;
  }

  if (!code || code.length < 6) {
    Toast.error("Invalid Code", "Please enter a 6-digit verification code");
    return;
  }

  try {
    const verifyButton = event.target;
    verifyButton.disabled = true;
    verifyButton.innerText = "Verifying...";

    const result = await window.confirmationResult.confirm(code);
    const user = result.user;

    Toast.success("Login Successful!", `Welcome ${user.phoneNumber || 'User'}`);
    console.log("User logged in via SMS:", user.phoneNumber);
    
    // Clear stored data
    window.confirmationResult = null;
    window.recaptchaVerifier = null;

    setTimeout(() => location.href = "index.html", 1000);

  } catch (error) {
    console.error("OTP Verification Error:", error);

    // Specific error handling
    if (error.code === 'auth/invalid-verification-code') {
      Toast.error("Invalid Code", "The verification code is incorrect");
    } else if (error.code === 'auth/code-expired') {
      Toast.error("Code Expired", "Please request a new SMS code");
      window.confirmationResult = null;
    } else {
      Toast.error("Verification Failed", error.message || "Unable to verify code");
    }

    // Reset button
    const verifyButton = event.target;
    if (verifyButton) {
      verifyButton.disabled = false;
      verifyButton.innerText = "Verify Code";
    }
  }
};

/* --------------------
   🔹 LOGOUT / NAV UI
-------------------- */
window.logout = async () => {
  try {
    await auth.signOut();
    Toast.success("Goodbye!", "You have been logged out");
    setTimeout(() => location.href = "index.html", 500);
  } catch (error) {
    Toast.error("Logout Failed", error.message);
  }
};

/* --------------------
   💰 CHECK PREMIUM STATUS
-------------------- */
import { db } from "./firebase.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

window.isPremiumUser = async (user) => {
  if (!user) return false;
  
  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data().subscription === "premium";
    }
  } catch (error) {
    console.error("Error checking premium status:", error);
  }
  return false;
};

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

onAuthStateChanged(auth, user => {
  const loginLink = document.getElementById("loginLink");
  const registerLink = document.getElementById("registerLink");
  const logoutLink = document.getElementById("logoutLink");

  if (!loginLink || !registerLink || !logoutLink) return;

  if (user) {
    loginLink.style.display = "none";
    registerLink.style.display = "none";
    logoutLink.style.display = "inline";
  } else {
    loginLink.style.display = "inline";
    registerLink.style.display = "inline";
    logoutLink.style.display = "none";
  }
});
