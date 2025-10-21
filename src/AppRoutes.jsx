




// src/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import CarouselComp from "./Home/CarouselComp/CarouselComp";
import About from "./Home/About/About";
import Programs from "./Home/Programs/Programs";
import Instructors from "./Home/Instructors/Instructors";
import Footer from "./Home/Footer/Footer";

import TeacherDashboard from "./TeacherDashboard/TeacherDashboard";
import Postvideo from "./TeacherDashboard/Postvideo";
import Seepostedvideo from "./TeacherDashboard/Seepostedvideo";

import AdminDashboard from "./AdminDashboard/AdminDashboard";
import StudentDashboard from "./StudentDashboard/StudentDashboard"; // ✅ Ensure this exists

// 🔐 Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* 🌐 Public Pages */}
      <Route path="/" element={<CarouselComp />} />
      <Route path="/about" element={<About />} />
      <Route path="/programs" element={<Programs />} />
      <Route path="/instructors" element={<Instructors />} />
      <Route path="/footer" element={<Footer />} />

      {/* 👨‍🏫 Teacher Dashboard Routes (Protected) */}
      <Route
        path="/teacherDashboard"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      >
        <Route path="postvideo" element={<Postvideo />} />
        <Route path="seepostedvideo" element={<Seepostedvideo />} />
      </Route>

      {/* 🛡️ Admin Dashboard */}
      <Route
        path="/adminDashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* 🎓 Student Dashboard */}
      <Route
        path="/studentDashboard"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
