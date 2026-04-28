import { useState } from "react";
import Login from "./Login.jsx";
import Dashboard from "./Dashboard.jsx";
import CreateReport from "./CreateReport.jsx";
import ReportHistory from "./ReportHistory.jsx";
import ReportDetailDynamic from "./ReportDetailDynamic.jsx";
import Notifications from "./Notifications.jsx";
import Profile from "./Profile.jsx";

export default function WargaModule() {
  const [currentPage, setCurrentPage] = useState("login");
  const [selectedReport, setSelectedReport] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = (page, data) => {
    setCurrentPage(page);
    if (data) setSelectedReport(data);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate("dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("login");
  };

  return (
    <div className="size-full bg-gray-50">
      {currentPage === "login" && (
        <Login onLogin={handleLogin} onNavigate={navigate} />
      )}
      {currentPage === "dashboard" && (
        <Dashboard onNavigate={navigate} onLogout={handleLogout} />
      )}
      {currentPage === "create-report" && (
        <CreateReport onNavigate={navigate} />
      )}
      {currentPage === "history" && <ReportHistory onNavigate={navigate} />}
      {currentPage === "detail" && (
        <ReportDetailDynamic report={selectedReport} onNavigate={navigate} />
      )}
      {currentPage === "notifications" && (
        <Notifications onNavigate={navigate} />
      )}
      {currentPage === "profile" && <Profile onNavigate={navigate} />}
    </div>
  );
}
