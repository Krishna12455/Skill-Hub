
import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight, FaPhoneAlt } from "react-icons/fa";

import Home1 from "../../assets/images/Home1.jpg";
import Home2 from "../../assets/images/Home2.jpg";
import Home3 from "../../assets/images/Home3.jpg";

const Programs = ({ setAlerts }) => {
  const cards = [
    { img: Home1, title: "Card Title 1", text: "Some quick example text for card 1..." },
    { img: Home2, title: "Card Title 2", text: "Some quick example text for card 2..." },
    { img: Home3, title: "Card Title 3", text: "Some quick example text for card 3..." },
    { img: Home1, title: "Card Title 4", text: "Some quick example text for card 4..." },
    { img: Home2, title: "Card Title 5", text: "Some quick example text for card 5..." },
    { img: Home3, title: "Card Title 6", text: "Some quick example text for card 6..." },
  ];

  const cardsPerPage = 3;
  const [cardIndex, setCardIndex] = useState(0);
  const maxIndex = cards.length - cardsPerPage;

  const handlePrev = () => {
    setCardIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCardIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setAlerts([{ severity: "info", message: "Login to apply for a program" }]);
    setTimeout(() => setAlerts([]), 3000);
  };

  return (
    <form onSubmit={handleFormSubmit} className="programs-form-wrapper" style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 className="container-heading" style={{ textAlign: "center", marginBottom: "2rem" }}>
        Programs Designed to Elevate Your Skills
      </h1>

      <div className="container-section3-cards" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
        <button
          type="button"
          onClick={handlePrev}
          disabled={cardIndex === 0}
          style={{ fontSize: "2rem", background: "none", border: "none", cursor: cardIndex === 0 ? "not-allowed" : "pointer", color: "#333" }}
        >
          <FaChevronLeft />
        </button>

        <div className="container-section3-cards-inner" style={{ display: "flex", gap: "1.5rem" }}>
          {cards.slice(cardIndex, cardIndex + cardsPerPage).map((card, idx) => (
            <Card key={card.title + idx} className="card-onbrand" style={{ width: "18rem", flex: "0 0 auto" }}>
              <Card.Img variant="top" src={card.img} />
              <Card.Body>
                <Card.Title>{card.title}</Card.Title>
                <Card.Text>{card.text}</Card.Text>
                <Button type="submit" className="btn-onbrand">Apply</Button>
              </Card.Body>
            </Card>
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={cardIndex >= maxIndex}
          style={{ fontSize: "2rem", background: "none", border: "none", cursor: cardIndex >= maxIndex ? "not-allowed" : "pointer", color: "#333" }}
        >
          <FaChevronRight />
        </button>
      </div>

      <h3 className="container-heading1" style={{ textAlign: "center", marginTop: "2.5rem" }}>
        Not sure which program to choose? Connect with our team and talk about your doubts!
      </h3>

      <div className="connect-btn-wrapper" style={{ textAlign: "center", marginTop: "1rem" }}>
        <a href="tel:6281620817" style={{ textDecoration: "none" }}>
          <button className="container-button1" type="button" style={{ padding: "0.8rem 2rem", fontSize: "1rem" }}>
            <FaPhoneAlt style={{ marginRight: "0.6em", verticalAlign: "middle" }} />
            Connect with our team
          </button>
        </a>
      </div>
    </form>
  );
};

export default Programs;
