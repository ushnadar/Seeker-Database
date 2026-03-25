function Dashboard() {
  return (
    <div className="dashboard">
      <h1>📦 Lost & Found Dashboard</h1>

      <div className="cards">
        <div className="dash-card">
          <h3>📤 Report Lost Item</h3>
          <p>Add details of lost item</p>
        </div>

        <div className="dash-card">
          <h3>📥 Found Items</h3>
          <p>Browse found items</p>
        </div>

        <div className="dash-card">
          <h3>📊 My Reports</h3>
          <p>View your submissions</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;