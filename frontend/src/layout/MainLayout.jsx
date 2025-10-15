import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import styles from "./MainLayout.module.css";

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleToggle = (event) => setIsSidebarOpen(event.detail);
    window.addEventListener("sidebarToggle", handleToggle);
    return () => window.removeEventListener("sidebarToggle", handleToggle);
  }, []);

  return (
    <div className={styles.mainLayout}>
      <Sidebar />
      <main
        className={`${styles.mainContent} ${
          !isSidebarOpen ? styles.sidebarClosed : ""
        }`}
      >
        <div className={styles.panelWrapper}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
