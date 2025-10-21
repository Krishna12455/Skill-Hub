
import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";

const NavigationBar = ({ setShowSignup, setShowLogin }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const isLoggedIn = !!user;
  const role = user?.role;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/"); // redirect to homepage
    window.location.reload();
  };

  return (
    <Navbar
      expand="lg"
      className="shadow-sm sticky-top"
      style={{
        background: "linear-gradient(90deg, #8ec5fc 0%, #e0c3fc 100%)",
        padding: "0.8rem 0",
      }}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          <img
            src={logo}
            alt="Skill Hub Logo"
            style={{ height: "40px", borderRadius: "8px" }}
          />
          <span style={{ fontWeight: "800", fontSize: "1.6rem", color: "#1a237e" }}>
            Skill Hub
          </span>
        </Navbar.Brand>

        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            {!isLoggedIn && (
              <>
                <Nav.Link as={Link} to="/about" style={navStyle}>About</Nav.Link>
                <Nav.Link as={Link} to="/programs" style={navStyle}>Programs</Nav.Link>
                <Nav.Link as={Link} to="/instructors" style={navStyle}>Instructors</Nav.Link>
                <Nav.Link as={Link} to="/footer" style={navStyle}>Contact</Nav.Link>
              </>
            )}
            {isLoggedIn && role === "teacher" && (
              <Nav.Link as={Link} to="/teacherDashboard" style={navStyle}>
                Dashboard
              </Nav.Link>
            )}
            {isLoggedIn && role === "student" && (
              <Nav.Link as={Link} to="/studentDashboard" style={navStyle}>
                My Learning
              </Nav.Link>
            )}
            {isLoggedIn && role === "admin" && (
              <Nav.Link as={Link} to="/adminDashboard" style={navStyle}>
                Admin Panel
              </Nav.Link>
            )}
          </Nav>

          <div className="d-flex gap-2">
            {isLoggedIn ? (
              <>
                <span style={{ color: "#1a237e", marginRight: "1rem", fontWeight: 600 }}>
                  Hi, {user?.name} ({role})
                </span>
                <Button variant="danger" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline-light"
                  onClick={() => setShowLogin(true)}
                  style={{
                    border: "2px solid #ff6a00",
                    color: "#ff6a00",
                    fontWeight: 600,
                  }}
                >
                  Login
                </Button>
                <Button
                  style={{
                    backgroundColor: "#ff6a00",
                    border: "none",
                    color: "#fff",
                    fontWeight: 600,
                  }}
                  onClick={() => setShowSignup(true)}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

const navStyle = {
  color: "#1a237e",
  fontWeight: 500,
  padding: "0.5rem 1rem",
};

export default NavigationBar;

