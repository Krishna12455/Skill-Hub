import React from "react";
import logo from "../../assets/images/logo.png";

const About = ({ setAlerts }) => {
  const handleExploreClick = () => {
    setAlerts([{ severity: 'info', message: 'Login to access' }]);
    setTimeout(() => setAlerts([]), 1500);
  };

  return (
    <section
      className="about-section"
      style={{
        background: 'linear-gradient(90deg, #e0c3fc 0%, #8ec5fc 100%)',
        padding: '3rem 1rem',
        margin: '4.5rem auto 2.5rem auto',
        borderRadius: '1.2rem',
        boxShadow: '0 8px 32px rgba(130, 87, 229, 0.13)',
        maxWidth: '1100px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2.5rem',
        textAlign: 'left',
      }}
      aria-label="About Skill Hub"
    >
      {/* Logo */}
      <div
        style={{
          flex: '0 0 180px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 120,
        }}
      >
        <img
          src={logo}
          alt="Skill Hub logo"
          style={{
            width: 210,
            height: 210,
            borderRadius: '50%',
            boxShadow: '0 4px 24px rgba(130, 87, 229, 0.18)',
            background: '#fff',
            padding: '1.2rem',
            objectFit: 'contain',
            border: '4px solid #fff',
          }}
        />
      </div>

      {/* Text Content */}
      <div style={{ flex: '1 1 350px', maxWidth: 600 }}>
        <h2
          style={{
            fontWeight: 900,
            fontSize: '2.2rem',
            color: '#4b2996',
            marginBottom: '1.1rem',
            letterSpacing: '1px',
            textShadow: '0 2px 8px rgba(130, 87, 229, 0.08)',
          }}
        >
          About Skill Hub
        </h2>
        <p
          style={{
            fontSize: '1.18rem',
            color: '#333',
            marginBottom: '1.2rem',
            lineHeight: 1.7,
            fontWeight: 500,
            textShadow: '0 1px 4px rgba(255,255,255,0.08)',
          }}
        >
          <strong>Skill Hub</strong> is an online learning platform dedicated to empowering learners
          with quality courses and real-world skills. Our mission is to make education accessible,
          interactive, and career-focused. Whether you're a student, teacher, or professional, you'll
          find programs in web development, data science, UI/UX, Java, Python, and more. Join our
          passionate community, learn at your own pace, and unlock your potential with
          industry-recognized certifications and expert instructors.
        </p>
        <button
          onClick={handleExploreClick}
          style={{
            background: 'linear-gradient(90deg, #8ec5fc 0%, #e0c3fc 100%)',
            color: '#4b2996',
            border: 'none',
            borderRadius: '2em',
            padding: '0.8em 2.2em',
            fontWeight: 700,
            fontSize: '1.1rem',
            boxShadow: '0 2px 12px rgba(130, 87, 229, 0.13)',
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s',
          }}
          aria-label="Explore Skill Hub Programs"
        >
          Explore Programs
        </button>
      </div>
    </section>
  );
};

export default About;
