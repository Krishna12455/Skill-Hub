import React from "react";
import { FaPhoneAlt, FaEnvelope, FaLinkedin } from "react-icons/fa";
import logo from "../../assets/images/logo.png";

const Footer = () => {
  return (
    <footer
      style={{
        background: "linear-gradient(90deg, #8ec5fc 0%, #e0c3fc 100%)",
        padding: "2.5rem 1.5rem 1rem 1.5rem",
        color: "#222",
        fontFamily: "sans-serif",
        boxShadow: "0 -4px 24px rgba(130, 87, 229, 0.13)",
        borderTopLeftRadius: "1.2rem",
        borderTopRightRadius: "1.2rem",
        marginTop: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
          gap: "2rem",
        }}
      >
        {/* Brand Section */}
        <div style={{ flex: "1 1 250px", textAlign: "center" }}>
          <img
            src={logo}
            alt="Skill Hub Logo"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              objectFit: "contain",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              marginBottom: "1rem",
              backgroundColor: "#fff",
              padding: "0.5rem",
            }}
          />
          <h2 style={{ fontSize: "1.6rem", marginBottom: "0.5rem" }}>
            Skill Hub
          </h2>
          <p style={{ fontSize: "1rem", color: "#333", maxWidth: 300, margin: "0 auto" }}>
            Empowering learners with quality courses and real-world skills.
          </p>
        </div>

        {/* Contact Info */}
        <div style={{ flex: "1 1 250px", fontSize: "1rem" }}>
          <h3>Contact</h3>
          <p>
            <FaPhoneAlt style={{ marginRight: "0.5rem" }} />
            <a href="tel:6281620817" style={linkStyle}>6281620817</a>
          </p>
          <p>
            <FaEnvelope style={{ marginRight: "0.5rem" }} />
            <a href="mailto:krishnabandari3333@gmail.com" style={linkStyle}>
              krishnabandari3333@gmail.com
            </a>
          </p>
          <p>
            <FaLinkedin style={{ marginRight: "0.5rem" }} />
            <a
              href="https://www.linkedin.com/in/krishna-bandari/"
              target="_blank"
              rel="noreferrer"
              style={linkStyle}
            >
              LinkedIn
            </a>
          </p>
        </div>

        {/* Location Map */}
        <div style={{ flex: "1 1 300px" }}>
          <h3>Location</h3>
          <p>Skill Hub HQ, Road No. 2, KPHB Colony</p>
          <p>Kukatpally, Hyderabad – 500072</p>
          <iframe
            title="SkillHub Location"
            src="https://www.google.com/maps?q=SkillHub+HQ,+KPHB,+Hyderabad&output=embed"
            width="100%"
            height="160"
            style={{ border: "0", borderRadius: "0.8rem", marginTop: "0.5rem" }}
            loading="lazy"
          ></iframe>
        </div>
      </div>

      <hr style={{ margin: "2rem 0", borderColor: "#ccc" }} />

      <div style={{ textAlign: "center", fontSize: "0.9rem", color: "#444" }}>
        © {new Date().getFullYear()} Skill Hub. All rights reserved.
      </div>
    </footer>
  );
};

const linkStyle = {
  color: "#4b2996",
  textDecoration: "none",
  fontWeight: "500",
};

export default Footer;
