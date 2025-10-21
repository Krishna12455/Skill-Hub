import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { signInWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { authentication, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ onClose, switchToSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedPassword = password.trim();

    // Log Firebase project info for debugging
    console.log("Firebase project ID:", authentication.app.options.projectId);
    console.log("Attempting login with email:", sanitizedEmail);

    // Try sign-in first; if it fails, we will clarify using sign-in methods
    try {
      const userCredential = await signInWithEmailAndPassword(authentication, sanitizedEmail, sanitizedPassword);
      const user = userCredential.user;
      console.log("Login successful, user UID:", user.uid);

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        console.error("User document not found in Firestore for UID:", user.uid);
        throw new Error("User profile not found in Firestore. Please contact support.");
      }

      const userData = userDocSnap.data();
      console.log("User data from Firestore:", userData);
      
      const userWithRole = {
        uid: user.uid,
        email: user.email,
        name: userData.name,
        role: userData.role || "student", // Default to student if missing
        photoURL: userData.photoURL || null,
      };

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(userWithRole));
      console.log("User data saved to localStorage:", userWithRole);

      // Navigate based on role
      if (userWithRole.role === "teacher") {
        navigate("/teacherDashboard");
      } else if (userWithRole.role === "admin") {
        navigate("/adminDashboard"); // Create route if needed
      } else {
        navigate("/studentDashboard"); // Create route if needed
      }

      if (onClose) onClose(); // close modal
    } catch (error) {
      console.error("Login error:", error);
      let message = error?.message || "Login failed. Please try again.";
      if (error?.code === "auth/invalid-credential") {
        message = "Invalid email or password.";
        try {
          const methods = await fetchSignInMethodsForEmail(authentication, sanitizedEmail);
          if (!methods || methods.length === 0) {
            message = "No account found with this email.";
          } else if (!methods.includes("password")) {
            message = "This email is registered with a different sign-in method.";
          }
        } catch (_) {}
      } else if (error?.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      } else if (error?.code === "auth/user-disabled") {
        message = "This account has been disabled.";
      } else if (error?.code === "auth/too-many-requests") {
        message = "Too many attempts. Please try again later.";
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  // no reset password flow per request

  return (
    <div>
      <h4 className="text-center mb-3">Login to Skill Hub</h4>
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Login"}
        </Button>

        

        <div className="text-center mt-3">
          <span>
            Don't have an account?{" "}
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={switchToSignup}
            >
              Sign Up
            </button>
          </span>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;



// import React, { useState } from "react";
// import { Form, Button, Alert, Spinner } from "react-bootstrap";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { authentication, db } from "../../firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";

// const LoginForm = ({ onClose, switchToSignup, setUser }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setErrorMsg("");
//     setLoading(true);

//     try {
//       const userCredential = await signInWithEmailAndPassword(authentication, email.trim(), password.trim());
//       const userDocRef = doc(db, "users", userCredential.user.uid);
//       const userDocSnap = await getDoc(userDocRef);

//       if (!userDocSnap.exists()) {
//         throw new Error("User profile not found in Firestore.");
//       }

//       const userData = userDocSnap.data();
//       const userWithRole = {
//         uid: userCredential.user.uid,
//         email: userCredential.user.email,
//         name: userData.name,
//         role: userData.role
//       };

//       localStorage.setItem("user", JSON.stringify(userWithRole));
//       if (setUser) setUser(userWithRole);

//       const routeMap = {
//         student: "/studentDashboard",
//         teacher: "/teacherDashboard",
//         admin: "/adminDashboard"
//       };
//       navigate(routeMap[userWithRole.role]);

//       if (onClose) onClose();
//     } catch (error) {
//       console.error("Login error:", error);
//       let message = "Login failed. Please try again.";
//       if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
//         message = "Incorrect email or password.";
//       } else if (error.code === "auth/invalid-email") {
//         message = "Please enter a valid email address.";
//       }
//       setErrorMsg(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Form onSubmit={handleLogin}>
//       <h4 className="text-center mb-3">Login to Skill Hub</h4>
//       {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

//       <Form.Group className="mb-3">
//         <Form.Label>Email address</Form.Label>
//         <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//       </Form.Group>

//       <Form.Group className="mb-4">
//         <Form.Label>Password</Form.Label>
//         <Form.Control type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//       </Form.Group>

//       <Button variant="primary" type="submit" className="w-100" disabled={loading}>
//         {loading ? <Spinner animation="border" size="sm" /> : "Login"}
//       </Button>

//       <div className="text-center mt-3">
//         <span>
//           Don't have an account?{" "}
//           <button type="button" className="btn btn-link p-0" onClick={switchToSignup}>
//             Sign Up
//           </button>
//         </span>
//       </div>
//     </Form>
//   );
// };

// export default LoginForm;
