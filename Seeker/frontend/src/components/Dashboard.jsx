import React from "react";
import "../App.css";
function Dashboard({ role }) {
  return (
    <div className="dashboard">
      <h1>📦 Lost & Found Dashboard</h1>

      <div className="cards">
        {/* Common for both users and admin */}
        {role === "user" && (
          <>
            <div className="dash-card">
              <h3>📤 Report Lost Item</h3>
              <p>Add details of lost item</p>
            </div>

            <div className="dash-card">
              <h3>📥 Browse Found Items</h3>
              <p>Check for found items that might belong to you</p>
            </div>

            <div className="dash-card">
              <h3>📊 My Reports</h3>
              <p>View your submitted lost/found reports</p>
            </div>
          </>
        )}

        {role === "admin" && (
          <>
            <div className="dash-card">
              <h3>📝 Review Reports</h3>
              <p>Approve, reject, or manage user reports</p>
            </div>

            <div className="dash-card">
              <h3>📊 Analytics</h3>
              <p>View dashboard statistics</p>
            </div>

            <div className="dash-card">
              <h3>⚙️ Manage Users</h3>
              <p>Add, remove, or edit user accounts</p>
            </div>

            <div className="dash-card">
              <h3>🛡️ Audit Logs</h3>
              <p>View system activity and logs</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;