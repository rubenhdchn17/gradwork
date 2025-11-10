import React, { useState } from "react";
import styles from "../../css/AssignedProjects.module.css";
import { FaThList, FaThLarge, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function AssignedProjects() {
  const [viewMode, setViewMode] = useState("grid");
  const navigate = useNavigate();

  const projects = [
    {
      id: 1,
      name: "Sistema de Gestión de Inventarios",
      students: ["Juan Pérez", "María Gómez"],
      status: "En revisión",
      lastUpdate: "2025-10-09",
      program: "Ingeniería de Sistemas",
    },
    {
      id: 2,
      name: "Optimización de Procesos Industriales",
      students: ["Carlos Ramírez"],
      status: "Aprobado",
      lastUpdate: "2025-09-22",
      program: "Ingeniería Industrial",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Proyectos Asignados</h1>
        <div className={styles.viewToggle}>
          <button
            className={viewMode === "list" ? styles.active : ""}
            onClick={() => setViewMode("list")}
          >
            <FaThList />
          </button>
          <button
            className={viewMode === "grid" ? styles.active : ""}
            onClick={() => setViewMode("grid")}
          >
            <FaThLarge />
          </button>
        </div>
      </div>

      <div
        className={
          viewMode === "grid" ? styles.gridContainer : styles.listContainer
        }
      >
        {projects.map((proj) => (
          <div
            key={proj.id}
            className={viewMode === "grid" ? styles.card : styles.row}
          >
            <div className={styles.info}>
              <h2>{proj.name}</h2>
              <p><strong>Estudiantes:</strong> {proj.students.join(", ")}</p>
              <p><strong>Programa:</strong> {proj.program}</p>
              <p><strong>Estado:</strong> {proj.status}</p>
              <p><strong>Última actualización:</strong> {proj.lastUpdate}</p>
            </div>

            <button
              className={styles.viewBtn}
              onClick={() => navigate(`/proyecto/${proj.id}`)}
            >
              <FaEye /> Ver Proyecto
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
