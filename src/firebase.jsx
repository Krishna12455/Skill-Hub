

// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// // ✅ Corrected storageBucket value
// const firebaseConfig = {
//   apiKey: "AIzaSyDyrmT_Wnpvtd1d5IZHa-IBpYZU4zngVj8",
//   authDomain: "react-project-df594.firebaseapp.com",
//   projectId: "react-project-df594",
//   storageBucket: "react-project-df594.appspot.com", // ✅ FIXED
//   messagingSenderId: "26574254829",
//   appId: "1:26574254829:web:57fa5b7f6a40a1c16792e4",
//   measurementId: "G-PNCVQRLLDQ"
// };

// // Initialize Firebase App
// const app = initializeApp(firebaseConfig);

// // Export Auth and Firestore DB
// export const authentication = getAuth(app);
// export const db = getFirestore(app);



// // src/firebase.js
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyDyrmT_Wnpvtd1d5IZHa-IBpYZU4zngVj8",
//   authDomain: "react-project-df594.firebaseapp.com",
//   projectId: "react-project-df594",
//   storageBucket: "react-project-df594.appspot.com", // ✅ Corrected
//   messagingSenderId: "26574254829",
//   appId: "1:26574254829:web:57fa5b7f6a40a1c16792e4",
//   measurementId: "G-PNCVQRLLDQ"
// };

// const app = initializeApp(firebaseConfig);
// export const authentication = getAuth(app);
// export const db = getFirestore(app);


// // src/firebase.js
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyDyrmT_Wnpvtd1d5IZHa-IBpYZU4zngVj8",
//   authDomain: "react-project-df594.firebaseapp.com",
//   projectId: "react-project-df594",
//   storageBucket: "react-project-df594.appspot.com", // ✅ Correct domain
//   messagingSenderId: "26574254829",
//   appId: "1:26574254829:web:57fa5b7f6a40a1c16792e4",
//   measurementId: "G-PNCVQRLLDQ"
// };

// const app = initializeApp(firebaseConfig);
// export const authentication = getAuth(app);
// export const db = getFirestore(app);



// // src/firebase.js
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";
// // import { getAnalytics } from "firebase/analytics"; // Optional

// const firebaseConfig = {
//   apiKey: "AIzaSyDyrmT_Wnpvtd1d5IZHa-IBpYZU4zngVj8",
//   authDomain: "react-project-df594.firebaseapp.com",
//   projectId: "react-project-df594",
//   storageBucket: "react-project-df594.appspot.com",
//   messagingSenderId: "26574254829",
//   appId: "1:26574254829:web:57fa5b7f6a40a1c16792e4",
//   measurementId: "G-PNCVQRLLDQ"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Firebase services
// const authentication = getAuth(app);
// const db = getFirestore(app);
// const storage = getStorage(app);
// // const analytics = getAnalytics(app); // Optional for web analytics

// export { app, authentication, db, storage };



// // src/firebase.js

// import { initializeApp, getApp, getApps } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";

// // ✅ Firebase Configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDyrmT_Wnpvtd1d5IZHa-IBpYZU4zngVj8",
//   authDomain: "react-project-df594.firebaseapp.com",
//   projectId: "react-project-df594",
//   storageBucket: "react-project-df594.appspot.com",
//   messagingSenderId: "26574254829",
//   appId: "1:26574254829:web:57fa5b7f6a40a1c16792e4",
//   measurementId: "G-PNCVQRLLDQ"
// };

// // ✅ Initialize Firebase App (ensure single instance)
// const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// // ✅ Firebase Services
// const authentication = getAuth(app);
// const db = getFirestore(app);
// const storage = getStorage(app);

// export { app, authentication, db, storage };



// src/firebase.js

import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDyrmT_Wnpvtd1d5IZHa-IBpYZU4zngVj8",
  authDomain: "react-project-df594.firebaseapp.com",
  projectId: "react-project-df594",
  storageBucket: "react-project-df594.appspot.com",
  messagingSenderId: "26574254829",
  appId: "1:26574254829:web:57fa5b7f6a40a1c16792e4",
  measurementId: "G-PNCVQRLLDQ"
};

// ✅ Initialize Firebase App (ensure single instance)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ✅ Firebase Services
const authentication = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// This is the ONLY export statement needed for these variables
export { app, authentication, db, storage };
