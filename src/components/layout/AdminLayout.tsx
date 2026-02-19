import { useContext, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

type LinkItem = {
  label: string;
  path: string;
  roles: string[];
};

const links: LinkItem[] = [
  { label: "Dashboard", path: "/admin/dashboard", roles: ["ADMIN", "MANAGER", "TEACHER"] },
  { label: "Students", path: "/admin/students", roles: ["ADMIN", "MANAGER"] },
  { label: "Reports", path: "/admin/reports", roles: ["ADMIN", "MANAGER"] },
  { label: "Exams", path: "/admin/exams", roles: ["ADMIN", "TEACHER"] },
  { label: "Questions", path: "/admin/questions", roles: ["ADMIN", "TEACHER"] },
  { label: "User Management", path: "/admin/users", roles: ["ADMIN"] },
];

export default function AdminLayout() {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const role = auth.role;

  const logout = () => {
    localStorage.removeItem("token");

    setAuth({
      token: null,
      role: null,
      isAuthenticated: false,
    });

    navigate("/admin/login");
  };

  const allowedLinks = links.filter((l) => role && l.roles.includes(role));

  return (
    <div className="flex min-h-screen">

      <aside
        className={`
          bg-gray-900 text-white w-64 p-4 space-y-4
          fixed md:static z-40 h-full
          transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <h2 className="text-lg font-bold mb-6">Admin Panel</h2>

        <nav className="flex flex-col gap-2">
          {allowedLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `p-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
              }
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={logout}
          className="mt-6 w-full bg-red-600 p-2 rounded"
        >
          Logout
        </button>
      </aside>


      <div className="flex-1 flex flex-col w-full">

        <header className="md:hidden p-4 shadow flex justify-between">
          <button onClick={() => setOpen(!open)}>☰</button>
          <span className="font-semibold">Admin</span>
        </header>

        <main className="p-6 bg-gray-100 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
