import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaHome,
  FaFileAlt,
  FaUsers,
  FaUserCheck,
  FaClipboardCheck,
  FaSignOutAlt,
  FaFolderOpen,
  FaTasks,
} from "react-icons/fa";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    window.dispatchEvent(new CustomEvent("sidebarToggle", { detail: !isOpen }));
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const rol = user?.rol;

  const menus = {
    coordinador: [
      { name: "Dashboard", icon: <FaHome />, path: "/coordinator/dashboard" },
      { name: "Asignar Asesor", icon: <FaUserCheck />, path: "/coordinator/asignar" },
      { name: "Asignar Evaluador", icon: <FaUsers />, path: "/coordinator/asignar-evaluador" },
      { name: "Anteproyecto", icon: <FaClipboardCheck />, path: "/coordinator/anteproyecto" },
      { name: "Proyectos", icon: <FaFolderOpen />, path: "/coordinator/proyectos" },
    ],
    estudiante: [
      { name: "Dashboard", icon: <FaHome />, path: "/student/dashboard" },
      { name: "Propuesta", icon: <FaFileAlt />, path: "/student/propuesta" },
      { name: "Mis Proyectos", icon: <FaFolderOpen />, path: "/student/mis-proyectos" },
    ],
    asesor: [
      { name: "Dashboard", icon: <FaHome />, path: "/advisor/dashboard" },
      { name: "Asignar", icon: <FaUserCheck />, path: "/advisor/asignar" },
    ],
    evaluador: [
      { name: "Dashboard", icon: <FaHome />, path: "/evaluator/dashboard" },
      { name: "Proyectos", icon: <FaTasks />, path: "/evaluator/proyectos" },
      { name: "Evaluar", icon: <FaClipboardCheck />, path: "/evaluator/evaluar" },
    ],
  };

  const menuItems = menus[rol] || [];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <div className={styles.toggleWrapper}>
        <button className={styles.toggleBtn} onClick={toggleSidebar}>
          <FaBars />
        </button>
        {isOpen && <h1 className={styles.logo}>GRADWORK</h1>}
      </div>
      <nav className={styles.menu}>
        {menuItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.name}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            <span className={styles.icon}>{item.icon}</span>
            {isOpen && <span className={styles.linkText}>{item.name}</span>}
          </NavLink>
        ))}
      </nav>
      <div className={styles.bottomSection}>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          <FaSignOutAlt />
          {isOpen && <span className={styles.logoutText}>Cerrar sesión</span>}
        </button>
      </div>
    </div>
  );
}
