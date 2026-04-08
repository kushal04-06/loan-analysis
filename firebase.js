// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAXjVDLxQu-LDRa1P66Ujpy2yql_hWNG8",
  authDomain: "loan-analysis.firebaseapp.com",
  projectId: "loan-analysis",
  storageBucket: "loan-analysis.firebasestorage.app",
  messagingSenderId: "705960558452",
  appId: "1:705960558452:web:4de40dba3adf8267bb621"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };