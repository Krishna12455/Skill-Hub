import React from "react";
import { Carousel, Button } from "react-bootstrap";
import Home1 from "../../assets/images/Home1.jpg";
import Home2 from "../../assets/images/Home2.jpg";
import Home3 from "../../assets/images/Home3.jpg";
import About from "../About/About";
import Programs from "../Programs/Programs";
import Instructors from "../Instructors/Instructors";
import Stats from "../Stats/Stats";
import Reviews from "../Reviews/Reviews";
import Footer from "../Footer/Footer";

const CarouselComp = ({ setAlerts }) => {
  const handleWarningButtonClick = (e) => {
    e.preventDefault();
    setAlerts([{ severity: 'info', message: 'Login for access' }]);
    setTimeout(() => setAlerts([]), 3000);
  };

  const slides = [
    {
      image: Home1,
      alt: "Students learning React online",
      heading: "Unlock Your Potential",
      text: "Join a community of passionate learners and discover new skills that propel you forward.",
      buttonLabel: "Explore Programs"
    },
    {
      image: Home2,
      alt: "Learning on laptop",
      heading: "Learn at Your Own Pace",
      text: "From beginner tutorials to advanced masterclasses—tailor your learning journey to fit your life.",
      buttonLabel: "Start Learning"
    },
    {
      image: Home3,
      alt: "Professional success from learning",
      heading: "Transform Your Future",
      text: "Gain in-demand skills, earn recognized certifications, and take the next step in your career.",
      buttonLabel: "Get Started"
    }
  ];

  return (
    <div>
    <Carousel fade>
      {slides.map((slide, idx) => (
        <Carousel.Item key={idx}>
          <div style={{ position: 'relative' }}>
            <img
              className="d-block w-100"
              src={slide.image}
              alt={slide.alt}
              loading="lazy"
              style={{
                height: "650px",
                objectFit: "cover",
                filter: "brightness(0.7)"
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.35)',
                zIndex: 1
              }}
            />
            <Carousel.Caption style={{ zIndex: 2 }}>
              <h3
                style={{
                  fontWeight: 700,
                  fontSize: '2.5rem',
                  textShadow: '2px 2px 8px #000'
                }}
              >
                {slide.heading}
              </h3>
              <p
                style={{
                  fontSize: '1.25rem',
                  textShadow: '1px 1px 6px #000'
                }}
              >
                {slide.text}
              </p>
              <Button
                variant="light"
                onClick={handleWarningButtonClick}
                aria-label={slide.buttonLabel}
                style={{
                  color: "#4b2996",
                  fontWeight: 600,
                  background: "linear-gradient(90deg, #8ec5fc 0%, #e0c3fc 100%)",
                  border: "none",
                  padding: "0.6rem 1.8rem",
                  borderRadius: "30px",
                  fontSize: "1rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                }}
              >
                {slide.buttonLabel}
              </Button>
            </Carousel.Caption>
          </div>
        </Carousel.Item>
      ))}
      
  
    </Carousel>
    <About/>
    <Programs/>
    <Stats/>
    <Instructors/>
    <Reviews/>
    <Footer/>
    </div>
    
   
  );
  
};

export default CarouselComp;
