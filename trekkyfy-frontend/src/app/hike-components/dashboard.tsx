import "@/app/stylesheet/dashboard.css";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

interface DecodedToken {
  guide_id?: string;
  hiker_id?: string;
}

export default function Dashboard() {
  const [userRole, setUserRole] = useState<"guide" | "hiker" | null>(null);
  const token = Cookies.get("access_token");

  useEffect(() => {
    if (!token) return;
    try {
      const decoded: DecodedToken = jwtDecode(token);
      if (decoded.guide_id) {
        setUserRole("guide");
      } else if (decoded.hiker_id) {
        setUserRole("hiker");
      }
    } catch (error) {
      console.log("Some error eccured during the recognition of user :", error);
    }
  }, [token]);
  return (
    <div className="main-dashboard">
      <div className="dashboard-line"></div>
      <div className="dashboard-head">
        <h1>Your Dashboard</h1>
      </div>
      {userRole === "hiker" && (
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
      )}
      {userRole === "guide" && (
        <div className="dashboards">
          <div className="dashboard">
            <h3>Treks Guided</h3>
            <p>0</p>
          </div>
          <div className="dashboard">
            <h3>Hikers Assisted</h3>
            <p>0</p>
          </div>
          <div className="dashboard">
            <h3>Upcoming Bookings</h3>
            <p>0</p>
          </div>
        </div>
      )}
    </div>
  );
}
