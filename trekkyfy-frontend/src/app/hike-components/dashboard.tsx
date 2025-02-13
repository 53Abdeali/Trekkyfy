import "@/app/stylesheet/dashboard.css";

export default function Dashboard() {
  return (
    <div className="main-dashboard">
      <div className="dashboard-line"></div>
      <div className="dashboard-head">
        <h1>Your Dashboard</h1>
      </div>
      <div className="dashboards">
        <div className="dashboard">
          <h3>Treks Completed</h3>
          <p>0</p>
        </div>
        <div className="dashboard">
          <h3>Distance Covered</h3>
          <p>0 Km</p>
        </div>
        <div className="dashboard">
          <h3>Upcoming Treks</h3>
          <p>0</p>
        </div>
      </div>
    </div>
  );
}
