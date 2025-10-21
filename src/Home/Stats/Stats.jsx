import React, { useState, useEffect, useRef } from "react";

const Stats = () => {
  const [courseCount, setCourseCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const impactRef = useRef(null);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.4 }
    );
    if (impactRef.current) {
      observer.observe(impactRef.current);
    }
    return () => {
      if (impactRef.current) observer.unobserve(impactRef.current);
    };
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;
    let courseTarget = 122;
    let studentTarget = 900;
    let courseInterval = setInterval(() => {
      setCourseCount(prev => {
        if (prev < courseTarget) return prev + 1;
        clearInterval(courseInterval);
        return courseTarget;
      });
    }, 50);
    let studentInterval = setInterval(() => {
      setStudentCount(prev => {
        if (prev < studentTarget) return prev + 5;
        clearInterval(studentInterval);
        return studentTarget;
      });
    }, 50);
    return () => {
      clearInterval(courseInterval);
      clearInterval(studentInterval);
    };
  }, [hasAnimated]);

  return (
    <div
      ref={impactRef}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '2.5rem 0',
        background: 'linear-gradient(90deg, #ffb347 0%, #ff6a00 100%)',
        borderRadius: '1.5rem',
        boxShadow: '0 8px 32px rgba(255, 106, 0, 0.13)',
        padding: '3.2rem 0 2.2rem 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <h2 style={{
        fontWeight: 800,
        fontSize: '2.2rem',
        letterSpacing: '1px',
        marginBottom: '2.2rem',
        textAlign: 'center',
        color: '#fff',
        textShadow: '0 4px 16px rgba(255, 106, 0, 0.18)',
        animation: 'fadeInImpact 1.1s',
      }}>Skill-Hub Achievements</h2>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'stretch',
        gap: '3.5rem',
        width: '100%',
        maxWidth: '900px',
        animation: 'fadeInImpact 1.3s',
        flexWrap: 'wrap',
      }}>
        {/* Courses Card */}
        <div style={{
          flex: 1,
          background: '#fff',
          borderRadius: '1.2rem',
          boxShadow: '0 6px 24px rgba(255, 106, 0, 0.13)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem 1.7rem',
          minWidth: 180,
          maxWidth: 260,
          border: '3px solid #ffb347',
          transition: 'transform 0.18s',
          margin: '0.5rem',
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.07)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span style={{ fontSize: '3.2rem', color: '#ff6a00', marginBottom: '0.7rem', filter: 'drop-shadow(0 2px 8px #ffb347)' }}>📚</span>
          <div style={{ fontSize: '2.9rem', fontWeight: 900, color: '#ff6a00', letterSpacing: '1px' }}>{courseCount}+</div>
          <div style={{ fontSize: '1.18rem', color: '#333', fontWeight: 700, marginTop: '0.5rem', letterSpacing: '0.5px' }}>Available Courses</div>
        </div>
        {/* Students Card */}
        <div style={{
          flex: 1,
          background: '#fff',
          borderRadius: '1.2rem',
          boxShadow: '0 6px 24px rgba(255, 106, 0, 0.13)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem 1.7rem',
          minWidth: 180,
          maxWidth: 260,
          border: '3px solid #ffb347',
          transition: 'transform 0.18s',
          margin: '0.5rem',
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.07)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span style={{ fontSize: '3.2rem', color: '#ff6a00', marginBottom: '0.7rem', filter: 'drop-shadow(0 2px 8px #ffb347)' }}>👨‍🎓</span>
          <div style={{ fontSize: '2.9rem', fontWeight: 900, color: '#ff6a00', letterSpacing: '1px' }}>{studentCount}+</div>
          <div style={{ fontSize: '1.18rem', color: '#333', fontWeight: 700, marginTop: '0.5rem', letterSpacing: '0.5px' }}>Enrolled Students</div>
        </div>
      </div>
      <style>{`
        @keyframes fadeInImpact {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Stats; 