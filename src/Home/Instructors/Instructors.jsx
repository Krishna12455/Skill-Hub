import React from "react";
import "./Instructors.css";

const Instructors = () => {
  const instructors = [
    {
      img: "https://randomuser.me/api/portraits/men/32.jpg",
      name: "Mr. Arjun Patel",
      specialization: "Full Stack Web Development",
      link: "#"
    },
    {
      img: "https://randomuser.me/api/portraits/women/44.jpg",
      name: "Ms. Priya Sharma",
      specialization: "Data Science & Python",
      link: "#"
    },
    {
      img: "https://randomuser.me/api/portraits/men/65.jpg",
      name: "Dr. Ravi Kumar",
      specialization: "Machine Learning",
      link: "#"
    },
    {
      img: "https://randomuser.me/api/portraits/women/68.jpg",
      name: "Mrs. Sneha Das",
      specialization: "UI/UX Design",
      link: "#"
    },
    {
      img: "https://randomuser.me/api/portraits/men/77.jpg",
      name: "Mr. Rishi Verma",
      specialization: "Java Programming",
      link: "#"
    },
    {
      img: "https://randomuser.me/api/portraits/women/12.jpg",
      name: "Ms. Kavya Nair",
      specialization: "JavaScript & React",
      link: "#"
    }
  ];

  return (
    <div
      className="instructors-section"
      style={{
        background: "linear-gradient(90deg, #f5f7fa 0%, #e2eafc 100%)",
        padding: "3rem 1rem",
        borderRadius: "1rem"
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontWeight: 800,
          fontSize: "2.2rem",
          color: "#1a237e",
          marginBottom: "2rem",
          letterSpacing: "1px"
        }}
      >
        Meet Our Instructors
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "2rem",
          maxWidth: "1100px",
          margin: "0 auto"
        }}
      >
        {instructors.map((inst, idx) => (
          <div
            key={inst.name + idx}
            style={{
              backgroundColor: "#fff",
              borderRadius: "1rem",
              boxShadow: "0 6px 24px rgba(0, 0, 0, 0.08)",
              textAlign: "center",
              padding: "1.5rem",
              transition: "transform 0.25s, box-shadow 0.25s",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 10px 32px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.08)";
            }}
          >
            <img
              src={inst.img}
              alt={inst.name}
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "1rem",
                border: "4px solid #e0e0e0"
              }}
            />
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>{inst.name}</h3>
            <p style={{ fontSize: "0.95rem", color: "#555" }}>{inst.specialization}</p>
            {inst.link && (
              <a
                href={inst.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: "0.7rem",
                  fontWeight: 600,
                  color: "#3949ab",
                  textDecoration: "none"
                }}
              >
                View Profile →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Instructors;
