import { Navigate, Route, Routes } from "react-router";
import WargaModule from "./pages/warga/WargaModule.jsx";
import AdminHome from "./pages/admin/AdminHome.jsx";
import DashboardWrapper from "./pages/admin/DashboardWrapper.jsx";
import LoginWrapper from "./pages/admin/LoginWrapper.jsx";
import PetugasHome from "./pages/petugas/PetugasHome.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/warga" replace />} />
      <Route path="/warga" element={<WargaModule />} />
      <Route
        path="/admin"
        element={<Navigate to="/admin/dashboard" replace />}
      />
      <Route path="/admin/dashboard" element={<DashboardWrapper />} />
      <Route path="/login" element={<LoginWrapper />} />
      <Route path="/petugas/*" element={<PetugasHome />} />
      <Route path="*" element={<Navigate to="/warga" replace />} />
    </Routes>
  );
}
