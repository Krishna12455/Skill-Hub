 



// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



import NavigationBar from "./Home/Navbar/Navbar";
import AppRoutes from "./AppRoutes";
import SignupForm from "./Home/Navbar/SignupForm";
import LoginForm from "./Home/Navbar/LoginForm";

function App() {
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <NavigationBar setShowSignup={setShowSignup} setShowLogin={setShowLogin} />
      <AppRoutes />

      <Modal show={showSignup} onHide={() => setShowSignup(false)} centered>
        <Modal.Body>
          <SignupForm
            onClose={() => setShowSignup(false)}
            switchToLogin={() => {
              setShowSignup(false);
              setShowLogin(true);
            }}
          />
        </Modal.Body>
      </Modal>

      <Modal show={showLogin} onHide={() => setShowLogin(false)} centered>
        <Modal.Body>
          <LoginForm
            onClose={() => setShowLogin(false)}
            switchToSignup={() => {
              setShowLogin(false);
              setShowSignup(true);
            }}
          />
        </Modal.Body>
      </Modal>
      
    </Router>
  );
}

export default App;

