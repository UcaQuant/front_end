import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/layout/AdminLayout";

import LoginPage from "./pages/admin/LoginPage";
import ForbiddenPage from "./pages/ForbiddenPage";

// Temporary placeholder pages (replace with real ones later)
const Dashboard = () => <div>Dashboard</div>;
const Students = () => <div>Students</div>;
const Reports = () => <div>Reports</div>;
const Exams = () => <div>Exams</div>;
const Questions = () => <div>Questions</div>;
const Users = () => <div>User Management</div>;

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/403" element={<ForbiddenPage />} />

          {/* Protected Admin Area */}
          <Route
            element={
              <ProtectedRoute requiredRole={["ADMIN", "MANAGER", "TEACHER"]} />
            }
          >
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/students" element={<Students />} />
              <Route path="/admin/reports" element={<Reports />} />
              <Route path="/admin/exams" element={<Exams />} />
              <Route path="/admin/questions" element={<Questions />} />
              <Route path="/admin/users" element={<Users />} />
            </Route>
          </Route>

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/admin/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
