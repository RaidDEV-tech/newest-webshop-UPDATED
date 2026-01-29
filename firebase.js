import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCuYO2osJYS_GtbJDe3ymDKKHOKaI0klZ8",
  authDomain: "mijn-courses-website.firebaseapp.com",
  projectId: "mijn-courses-website",
  appId: "1:1000611150399:web:0b58ef9be3117edff9568a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Use device language for emails, SMS, reCAPTCHA
auth.useDeviceLanguage();

export const db = getFirestore(app);
