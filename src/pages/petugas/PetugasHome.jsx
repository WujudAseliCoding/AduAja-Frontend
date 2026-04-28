import { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router";
import AttendanceHistory from "./components/AttendanceHistory.jsx";
import Dashboard from "./components/Dashboard.jsx";
import History from "./components/History.jsx";
import LoginPage from "./components/LoginPage.jsx";
import OfflineIndicator from "./components/OfflineIndicator.jsx";
import Reports from "./components/Reports.jsx";
import TaskDetail from "./components/TaskDetail.jsx";
import TaskExecution from "./components/TaskExecution.jsx";
import TaskList from "./components/TaskList.jsx";

const viewToRoute = {
  login: "login",
  dashboard: "dashboard",
  tasks: "tasks",
  "task-detail": "task-detail",
  "task-execution": "task-execution",
  history: "history",
  reports: "reports",
  "attendance-history": "attendance-history",
};

export default function PetugasHome() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    navigate("/petugas/dashboard", { replace: true });
  };

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      setCurrentUser(null);
      setSelectedTask(null);
      navigate("/petugas/login", { replace: true });
    }
  };

  const handleNavigate = (view, data = null) => {
    if (data) {
      setSelectedTask(data);
    }

    const route = viewToRoute[view] ?? "dashboard";
    navigate(`/petugas/${route}`);
  };

  const handleSelectTask = (task) => {
    setSelectedTask(task);
    navigate("/petugas/task-detail");
  };

  const handleStartTask = (task) => {
    const updatedTask = {
      ...task,
      status: "in_progress",
      startedAt: new Date().toISOString(),
    };
    setSelectedTask(updatedTask);
    navigate("/petugas/task-execution");
  };

  const handleCompleteTask = (completionData) => {
    console.log("Task completed:", completionData);
    alert("Tugas berhasil diselesaikan! Data telah disimpan.");
    setSelectedTask(null);
    navigate("/petugas/dashboard");
  };

  const handleBackFromTaskDetail = () => {
    navigate("/petugas/tasks");
    setSelectedTask(null);
  };

  const handleBackFromExecution = () => {
    navigate("/petugas/task-detail");
  };

  return (
    <div className="w-full min-h-screen">
      {currentUser && <OfflineIndicator />}

      <Routes>
        <Route
          index
          element={
            <Navigate
              to={currentUser ? "/petugas/dashboard" : "/petugas/login"}
              replace
            />
          }
        />
        <Route path="login" element={<LoginPage onLogin={handleLogin} />} />
        <Route
          path="dashboard"
          element={
            currentUser ? (
              <Dashboard
                user={currentUser}
                onNavigate={handleNavigate}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/petugas/login" replace />
            )
          }
        />
        <Route
          path="tasks"
          element={
            currentUser ? (
              <TaskList
                user={currentUser}
                onNavigate={handleNavigate}
                onSelectTask={handleSelectTask}
              />
            ) : (
              <Navigate to="/petugas/login" replace />
            )
          }
        />
        <Route
          path="task-detail"
          element={
            currentUser && selectedTask ? (
              <TaskDetail
                task={selectedTask}
                user={currentUser}
                onBack={handleBackFromTaskDetail}
                onStartTask={handleStartTask}
                onNavigate={handleNavigate}
              />
            ) : (
              <Navigate to={currentUser ? "/petugas/tasks" : "/petugas/login"} replace />
            )
          }
        />
        <Route
          path="task-execution"
          element={
            currentUser && selectedTask ? (
              <TaskExecution
                task={selectedTask}
                user={currentUser}
                onComplete={handleCompleteTask}
                onBack={handleBackFromExecution}
              />
            ) : (
              <Navigate to={currentUser ? "/petugas/tasks" : "/petugas/login"} replace />
            )
          }
        />
        <Route
          path="history"
          element={
            currentUser ? (
              <History
                user={currentUser}
                onNavigate={handleNavigate}
                onViewDetail={handleSelectTask}
              />
            ) : (
              <Navigate to="/petugas/login" replace />
            )
          }
        />
        <Route
          path="reports"
          element={
            currentUser ? (
              <Reports user={currentUser} onNavigate={handleNavigate} />
            ) : (
              <Navigate to="/petugas/login" replace />
            )
          }
        />
        <Route
          path="attendance-history"
          element={
            currentUser ? (
              <AttendanceHistory
                user={currentUser}
                onNavigate={handleNavigate}
              />
            ) : (
              <Navigate to="/petugas/login" replace />
            )
          }
        />
        <Route
          path="*"
          element={
            <Navigate
              to={currentUser ? "/petugas/dashboard" : "/petugas/login"}
              replace
            />
          }
        />
      </Routes>
    </div>
  );
}
