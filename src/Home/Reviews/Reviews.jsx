
import React from "react";
import { Card } from "react-bootstrap";

const Reviews = ({ setAlerts }) => {
  const reviews = [
    {
      name: "Ananya Sharma",
      title: "Mastering React for Beginners",
      text: "The explanations were very clear, and the projects helped me build confidence in React. Highly recommended for beginners!",
      border: "primary"
    },
    {
      name: "Rahul Mehta",
      title: "Python for Data Science",
      text: "Good content and examples, though the pace could be a bit faster. Loved the final project!",
      border: "secondary"
    },
    {
      name: "Priya Kapoor",
      title: "Full Stack Web Development",
      text: "This course covers everything from frontend to backend. The Firebase integration tutorial was a highlight for me!",
      border: "success"
    },
    {
      name: "Arjun Reddy",
      title: "UI/UX Design Principles",
      text: "Great course with practical design tips. The instructor's case studies made the theory easy to understand.",
      border: "danger"
    },
    {
      name: "Sneha Das",
      title: "Java Programming Essentials",
      text: "As a non-CS student, this course helped me grasp Java fundamentals quickly. Kudos to the instructor!",
      border: "warning"
    },
    {
      name: "Rishi Verma",
      title: "Introduction to Machine Learning",
      text: "Great course for beginners. The math behind the models was simplified well. I'd love to see a sequel to this.",
      border: "info"
    },
    {
      name: "Kavya",
      title: "Advanced JavaScript Concepts",
      text: "If you think you know JavaScript, take this course. The instructor dives deep into closures, scopes, and async like a pro!",
      border: "dark"
    },
    {
      name: "Ravi Kumar",
      title: "Building REST APIs with Node.js",
      text: "A solid introduction to REST APIs. It could use more advanced projects, but everything else was perfect.",
      border: "light"
    }
  ];

  const handleSectionClick = (e) => {
    if (e.target.tagName.toLowerCase() === 'button') return;
    setAlerts([{ severity: 'info', message: 'Login for access' }]);
    setTimeout(() => setAlerts([]), 3000);
  };

  return (
    <div
      className="reviews-wrapper"
      onClick={handleSectionClick}
      style={{
        padding: "2rem",
        background: "linear-gradient(90deg, #f0f0f0 0%, #e8eaf6 100%)",
        cursor: "pointer"
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "2rem", fontWeight: "800" }}>
        What Our Learners Say
      </h1>
      <div
        className="reviews-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.8rem",
          justifyContent: "center"
        }}
      >
        {reviews.map((review, index) => (
          <Card
            key={review.name + index}
            border={review.border}
            style={{
              width: "100%",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <Card.Header
              style={{
                fontWeight: 700,
                fontSize: "1.05rem",
                backgroundColor: "#fff",
                borderBottom: "1px solid #ccc"
              }}
            >
              {review.name}
            </Card.Header>
            <Card.Body>
              <Card.Title style={{ fontSize: "1.1rem", marginBottom: "0.8rem" }}>{review.title}</Card.Title>
              <Card.Text style={{ fontSize: "0.96rem", lineHeight: "1.5" }}>
                "{review.text}"
                <br />
                <span style={{ fontStyle: "italic", fontSize: "0.9rem", display: "block", marginTop: "0.5rem" }}>
                  — {review.name}
                </span>
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
