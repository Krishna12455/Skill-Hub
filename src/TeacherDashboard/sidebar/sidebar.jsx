



// src/TeacherDashboard/sidebar/sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar" style={{}}>
      <h4 className="sidebar-title">Teacher Panel</h4>
      <ul className="sidebar-menu">
        <button
          style={{
            backgroundColor: "lightgray",
            color: "black",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          <Link to="/teacherDashboard/postvideo">Post Video</Link>
        </button>
        <button
          style={{
            backgroundColor: "lightgray",
            color: "black",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
            marginTop: "10px",
            borderRadius: "5px",
          }}
        >
          <Link to="/teacherDashboard/seepostedvideo">See Posted Videos</Link>
        </button>
      </ul>
    </div>
  );
};

export default Sidebar;

