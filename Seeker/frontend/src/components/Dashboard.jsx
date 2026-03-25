import React from "react";
import { useNavigate } from "react-router-dom";
// this is dashboard
function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div>
      <div className="navbar">
        Lost & Found | Welcome {user.name || "User"}
        <button onClick={logout} style={{ float: "right" }}>
          Logout
        </button>
      </div>
      <div className="dashboard">
        <h2>Dashboard</h2>
        <div className="card-grid">
          <div className="dashboard-card">Report Lost Item</div>
          <div className="dashboard-card">Report Found Item</div>
          <div className="dashboard-card">View Matches</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;