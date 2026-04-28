import { useEffect } from "react";
import { useNavigate } from "react-router";
import LoginPage from "./LoginPage.jsx";

export default function LoginWrapper() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated") === "true";
    if (isAuth) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleLogin = (role) => {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userRole", role);
    navigate("/admin/dashboard", { replace: true });
  };

  return <LoginPage onLogin={handleLogin} />;
}
