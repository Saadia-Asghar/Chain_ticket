import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAsrI22hKv1GlT156l8IEmDPjnQGiumaHE",
    authDomain: "chainticket-5ef44.firebaseapp.com",
    projectId: "chainticket-5ef44",
    storageBucket: "chainticket-5ef44.firebasestorage.app",
    messagingSenderId: "241741545704",
    appId: "1:241741545704:web:8ca65e8e35f2d2aeaa895d",
    measurementId: "G-FHLXE2PBX1"
};

// Initialize Firebase
// Check if firebase app is already initialized to avoid errors in development (hot-reload)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

// Analytics (only supported in browser environment)
let analytics;
if (typeof window !== "undefined") {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}

export { app, db, auth, analytics };
