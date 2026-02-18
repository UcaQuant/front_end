import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/layout/AdminLayout";

import LoginPage from "./pages/admin/LoginPage";
import ForbiddenPage from "./pages/ForbiddenPage";

import ManagerDashboard from "./pages/admin/ManagerDashboard";
import StudentDirectory from "./pages/admin/StudentDirectory";
import ReportsPage from "./pages/admin/ReportsPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ---------- Public ---------- */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/403" element={<ForbiddenPage />} />

          {/* ---------- Protected Admin Area ---------- */}
          <Route
            element={
              <ProtectedRoute requiredRole={["ADMIN", "MANAGER", "TEACHER"]} />
            }
          >
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<ManagerDashboard />} />
              <Route path="/admin/students" element={<StudentDirectory />} />
              <Route path="/admin/reports" element={<ReportsPage />} />
            </Route>
          </Route>

          {/* ---------- Default redirect ---------- */}
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
