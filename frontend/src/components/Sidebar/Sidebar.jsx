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
    // 🔹 Emitimos evento para MainLayout
    window.dispatchEvent(new CustomEvent("sidebarToggle", { detail: !isOpen }));
  };

  const menuItems = [
    // COORDINADOR
    { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
    { name: "Propuesta", icon: <FaFileAlt />, path: "/propuesta" },
    { name: "Anteproyecto", icon: <FaClipboardCheck />, path: "/anteproyecto" },
    { name: "Asignar Asesor", icon: <FaUserCheck />, path: "/asignar-asesor" },
    { name: "Asignar Evaluador", icon: <FaUsers />, path: "/asignar-evaluador" },
    { name: "Evaluación", icon: <FaClipboardCheck />, path: "/evaluacion" },

    // ESTUDIANTE
    { name: "Mis Proyectos", icon: <FaFolderOpen />, path: "/mis-proyectos" },

    // ASESOR
    { name: "Proyectos Asignados", icon: <FaTasks />, path: "/proyectos-asignados" },
    { name: "Revisión Proyecto", icon: <FaFileAlt />, path: "/proyecto/:id" },

    // EVALUADOR
    { name: "Proyectos a Evaluar", icon: <FaTasks />, path: "/evaluador" },
  ];

  const handleLogout = () => {
    navigate("/"); // limpiar sesión o token
  };

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      {/* 🔹 Botón toggle siempre visible */}
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
