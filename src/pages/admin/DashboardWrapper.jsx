import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AdminDashboard from "./AdminDashboard.jsx";
import DinasDashboard from "./dinas/DinasDashboard.jsx";

const getDinasName = (role) => {
  const dinasMap = {
    admin_dinas: "Dinas PU & Penataan Ruang",
    admin_dinas_dlh: "Dinas Lingkungan Hidup",
    admin_dinas_esdm: "Dinas ESDM",
    admin_dinas_perhubungan: "Dinas Perhubungan",
  };
  return dinasMap[role] || "Dinas PU & Penataan Ruang";
};

export default function DashboardWrapper() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "";
    const isAuth = localStorage.getItem("isAuthenticated") === "true";

    if (!isAuth) {
      navigate("/login", { replace: true });
      return;
    }

    setUserRole(role);
    setIsChecking(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    navigate("/login", { replace: true });
  };

  if (isChecking || !userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (userRole === "admin_pusat") {
    return <AdminDashboard userRole={userRole} onLogout={handleLogout} />;
  }

  return (
    <DinasDashboard
      userRole={userRole}
      dinasName={getDinasName(userRole)}
      onLogout={handleLogout}
    />
  );
}
