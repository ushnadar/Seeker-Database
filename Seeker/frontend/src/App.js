import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";

function ProtectedDashboard({ requiredRole }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    window.location.href = "/";
    return null;
  }

  if (user.role !== requiredRole) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        ⛔ Access Denied — You are not authorized to view this page.
      </h2>
    );
  }

  return <Dashboard role={user.role} />;
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user-dashboard" element={<ProtectedDashboard requiredRole="user" />} />
        <Route path="/admin-dashboard" element={<ProtectedDashboard requiredRole="admin" />} />
        <Route
          path="*"
          element={
            <h2 style={{ textAlign: "center", marginTop: "50px" }}>
              404 — Page Not Found
            </h2>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;