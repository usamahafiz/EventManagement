// Import Firebase services
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDCuU7pAIRVcgYfpK2yQLTN7HNu2IOmTGs",
  authDomain: "todo-with-firebase-7.firebaseapp.com",
  projectId: "todo-with-firebase-7",
  storageBucket: "todo-with-firebase-7.appspot.com",
  messagingSenderId: "919987213554",
  appId: "1:919987213554:web:78ae78af9074641cd1ac6b",
  measurementId: "G-GVVCM8G69M",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const fireStore = getFirestore(app);
export const storage = getStorage(app);


