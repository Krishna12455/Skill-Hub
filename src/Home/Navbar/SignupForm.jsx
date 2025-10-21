// // import React, { useState } from "react";
// // import { Form, Button } from "react-bootstrap";
// // import { authentication, db } from "../../firebase";
// // import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// // import { doc, setDoc } from "firebase/firestore";
// // import { toast } from "react-toastify";

// // const SignupForm = ({ onClose }) => {
// //   const [signupDetails, setSignupDetails] = useState({
// //     name: "",
// //     email: "",
// //     password: "",
// //     role: ""
// //   });

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setSignupDetails(prev => ({
// //       ...prev,
// //       [name]: value
// //     }));
// //   };

// //   const handleSignUpSubmit = async (e) => {
// //     e.preventDefault();
// //     const { name, email, password, role } = signupDetails;

// //     if (!name || !email || !password || !role) {
// //       toast.warn("Please fill all fields.");
// //       return;
// //     }

// //     try {
// //       const userCredential = await createUserWithEmailAndPassword(authentication, email, password);

// //       await updateProfile(userCredential.user, { displayName: name });

// //       await setDoc(doc(db, "users", userCredential.user.uid), {
// //         uid: userCredential.user.uid,
// //         name,
// //         email,
// //         role
// //       });

// //       toast.success("Account created successfully!");
// //       onClose();
// //     } catch (error) {
// //       if (error.code === "auth/email-already-in-use") {
// //         toast.error("You already have an account. Please login.");
// //       } else {
// //         toast.error(error.message);
// //       }
// //     }
// //   };

// //   return (
// //     <Form onSubmit={handleSignUpSubmit}>
// //       <h3 className="text-center mb-3">Create Account</h3>

// //       <Form.Group className="mb-3">
// //         <Form.Label>Full Name</Form.Label>
// //         <Form.Control
// //           type="text"
// //           name="name"
// //           placeholder="Enter your name"
// //           value={signupDetails.name}
// //           onChange={handleChange}
// //         />
// //       </Form.Group>

// //       <Form.Group className="mb-3">
// //         <Form.Label>Email address</Form.Label>
// //         <Form.Control
// //           type="email"
// //           name="email"
// //           placeholder="Enter email"
// //           value={signupDetails.email}
// //           onChange={handleChange}
// //         />
// //       </Form.Group>

// //       <Form.Group className="mb-3">
// //         <Form.Label>Password</Form.Label>
// //         <Form.Control
// //           type="password"
// //           name="password"
// //           placeholder="Password"
// //           value={signupDetails.password}
// //           onChange={handleChange}
// //         />
// //       </Form.Group>

// //       <Form.Group className="mb-4">
// //         <Form.Label>Select Role</Form.Label>
// //         <Form.Select name="role" value={signupDetails.role} onChange={handleChange}>
// //           <option value="">Select a role</option>
// //           <option value="student">Student</option>
// //           <option value="teacher">Teacher</option>
// //           <option value="admin">Admin</option>
// //         </Form.Select>
// //       </Form.Group>

// //       <Button type="submit" className="w-100" variant="primary">
// //         Sign Up
// //       </Button>

// //       <p className="text-center mt-3">
// //         Already have an account?{" "}
// //         <span style={{ color: "#ff6a00", cursor: "pointer" }} onClick={() => toast.info("Redirect to login coming soon!")}>
// //           Login
// //         </span>
// //       </p>
// //     </Form>
// //   );
// // };

// // export default SignupForm;




// import React, { useState } from "react";
// import { Form, Button, Spinner } from "react-bootstrap";
// import { authentication, db } from "../../firebase";
// import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";
// import { toast } from "react-toastify";

// const SignupForm = ({ onClose, switchToLogin }) => {
//   const [signupDetails, setSignupDetails] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: ""
//   });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setSignupDetails(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSignUpSubmit = async (e) => {
//     e.preventDefault();
//     const name = signupDetails.name.trim();
//     const email = signupDetails.email.trim();
//     const password = signupDetails.password.trim();
//     const role = signupDetails.role.trim();

//     if (!name || !email || !password || !role) {
//       toast.warn("Please fill all fields.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const userCredential = await createUserWithEmailAndPassword(authentication, email, password);
//       await updateProfile(userCredential.user, { displayName: name });

//       await setDoc(doc(db, "users", userCredential.user.uid), {
//         uid: userCredential.user.uid,
//         name,
//         email,
//         role
//       });

//       toast.success("Account created successfully!");
//       if (onClose) onClose();
//     } catch (error) {
//       let message = error?.message || "Signup failed. Please try again.";
//       if (error?.code === "auth/email-already-in-use") {
//         message = "You already have an account. Please login.";
//       } else if (error?.code === "auth/weak-password") {
//         message = "Password should be at least 6 characters.";
//       } else if (error?.code === "auth/invalid-email") {
//         message = "Please enter a valid email address.";
//       } else if (error?.code === "auth/operation-not-allowed") {
//         message = "Email/Password sign-in is disabled in Firebase Console.";
//       }
//       toast.error(message);
//     }
//     finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Form onSubmit={handleSignUpSubmit}>
//       <h3 className="text-center mb-3">Create Account</h3>

//       <Form.Group className="mb-3">
//         <Form.Label>Full Name</Form.Label>
//         <Form.Control type="text" name="name" placeholder="Enter your name" value={signupDetails.name} onChange={handleChange} />
//       </Form.Group>

//       <Form.Group className="mb-3">
//         <Form.Label>Email address</Form.Label>
//         <Form.Control type="email" name="email" placeholder="Enter email" value={signupDetails.email} onChange={handleChange} />
//       </Form.Group>

//       <Form.Group className="mb-3">
//         <Form.Label>Password</Form.Label>
//         <Form.Control type="password" name="password" placeholder="Password" value={signupDetails.password} onChange={handleChange} />
//       </Form.Group>

//       <Form.Group className="mb-4">
//         <Form.Label>Select Role</Form.Label>
//         <Form.Select name="role" value={signupDetails.role} onChange={handleChange}>
//           <option value="">Select a role</option>
//           <option value="student">Student</option>
//           <option value="teacher">Teacher</option>
//           <option value="admin">Admin</option>
//         </Form.Select>
//       </Form.Group>

//       <Button type="submit" className="w-100" variant="primary" disabled={loading}>
//         {loading ? <Spinner animation="border" size="sm" /> : "Sign Up"}
//       </Button>

//       <p className="text-center mt-3">
//         Already have an account?{" "}
//         <span style={{ color: "#ff6a00", cursor: "pointer" }} onClick={switchToLogin}>
//           Login
//         </span>
//       </p>
//     </Form>
//   );
// };

// export default SignupForm;


import React, { useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { authentication, db } from "../../firebase";
import { createUserWithEmailAndPassword, updateProfile, fetchSignInMethodsForEmail } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const SignupForm = ({ onClose, switchToLogin }) => {
  const [signupDetails, setSignupDetails] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const name = signupDetails.name.trim();
    const email = signupDetails.email.trim().toLowerCase();
    const password = signupDetails.password.trim();
    const role = signupDetails.role.trim();

    if (!name || !email || !password || !role) {
      toast.warn("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      // Check if an account already exists for this email and with which method
      const methods = await fetchSignInMethodsForEmail(authentication, email);
      if (methods && methods.length > 0) {
        if (methods.includes("password")) {
          toast.info("You already have an account. Please login.");
          if (switchToLogin) switchToLogin();
          return;
        } else {
          toast.error("This email is registered with a different sign-in method. Use that method to login.");
          return;
        }
      }
      const userCredential = await createUserWithEmailAndPassword(authentication, email, password);
      await updateProfile(userCredential.user, { displayName: name });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        name,
        email,
        role
      });

      toast.success("Account created successfully!");
      if (onClose) onClose();
    } catch (error) {
      let message = error?.message || "Signup failed. Please try again.";
      if (error?.code === "auth/email-already-in-use") {
        message = "An account already exists with this email.";
      } else if (error?.code === "auth/weak-password") {
        message = "Password should be at least 6 characters.";
      } else if (error?.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSignUpSubmit}>
      <h3 className="text-center mb-3">Create Account</h3>

      <Form.Group className="mb-3">
        <Form.Label>Full Name</Form.Label>
        <Form.Control type="text" name="name" placeholder="Enter your name" value={signupDetails.name} onChange={handleChange} required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" name="email" placeholder="Enter email" value={signupDetails.email} onChange={handleChange} required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" name="password" placeholder="Password" value={signupDetails.password} onChange={handleChange} required />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Select Role</Form.Label>
        <Form.Select name="role" value={signupDetails.role} onChange={handleChange} required>
          <option value="">Select a role</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </Form.Select>
      </Form.Group>

      <Button type="submit" className="w-100" variant="primary" disabled={loading}>
        {loading ? <Spinner animation="border" size="sm" /> : "Sign Up"}
      </Button>

      <p className="text-center mt-3">
        Already have an account?{" "}
        <span style={{ color: "#ff6a00", cursor: "pointer" }} onClick={switchToLogin}>
          Login
        </span>
      </p>
    </Form>
  );
};

export default SignupForm;

