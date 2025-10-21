
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./TeacherDashboard.css";
import Sidebar from "./sidebar/sidebar";
import logo from "../assets/images/logo.png";

const TeacherDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const photo = user?.photoURL || `https://ui-avatars.com/api/?name=${user?.name}&background=FFB347&color=fff&size=128`;

  const location = useLocation();
  const navigate = useNavigate();

  const isRootDashboard = location.pathname === "/teacherDashboard";

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="teacher-dashboard">
      

      <div className="dashboard-body">
        <div className="sidebar-area"><Sidebar /></div>

        <div className="main-area">
          {/* Show welcome content and buttons only at /teacherDashboard */}
          {isRootDashboard && (
            <div className="teacher-info-section">
              <h2>Welcome, {user?.name}!</h2>
              <p>
                Thank you for being a part of <strong>Skill Hub</strong>. As a teacher, you're shaping tomorrow's talent.
              </p>

              <div className="dashboard-buttons" style={{ margin: "1.5rem 0" }}>
                <button
                  className="btn btn-primary me-3"
                  onClick={() => navigate("/teacherDashboard/postvideo")}
                >
                  Post Video
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => navigate("/teacherDashboard/seepostedvideo")}
                >
                  See Posted Videos
                </button>
              </div>

              <h3>About the Platform</h3>
              <p>
                Skill Hub is built for practical e-learning. You can create, manage, and monitor video courses to empower learners globally.
              </p>

              <h4>Your Responsibilities</h4>
              <ul>
                <li>Publish engaging lessons with videos or text</li>
                <li>Track student progress and course impact</li>
                <li>Keep your content updated and relevant</li>
              </ul>
            </div>
          )}

          {/* Render nested content like PostVideo or SeePostedVideo */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;



