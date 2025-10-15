import React, { useState } from "react";
import styles from "../css/StudentProjects.module.css";
import { FaFileAlt, FaUpload, FaEye } from "react-icons/fa";

export default function StudentProjects() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Sistema de gestión académica",
      status: "En revisión",
      advisor: "Ing. Gómez",
      lastUpdate: "10/10/2025",
    },
    {
      id: 2,
      name: "Optimización de procesos industriales",
      status: "Aprobado",
      advisor: "Dra. Ruiz",
      lastUpdate: "05/10/2025",
    },
    {
      id: 3,
      name: "Propuesta de portal estudiantil",
      status: "Propuesta enviada",
      advisor: "Por asignar",
      lastUpdate: "02/10/2025",
    },
  ]);

  const handleFileUpload = (id) => {
    const fileInput = document.getElementById(`file-${id}`);
    fileInput.click();
  };

  const handleFileChange = (e, id) => {
    const file = e.target.files[0];
    if (file) {
      alert(`Archivo "${file.name}" subido para el proyecto ${id}`);
      // Aquí podrías hacer un fetch/axios POST para subirlo al backend
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Mis Proyectos</h1>
        <p>Consulta y actualiza el estado de tus propuestas y proyectos.</p>
      </header>

      <div className={styles.cardGrid}>
        {projects.map((project) => (
          <div key={project.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <FaFileAlt className={styles.icon} />
              <h2>{project.name}</h2>
            </div>

            <div className={styles.details}>
              <p><strong>Estado:</strong> <span className={styles.status}>{project.status}</span></p>
              <p><strong>Asesor:</strong> {project.advisor}</p>
              <p><strong>Última actualización:</strong> {project.lastUpdate}</p>
            </div>

            <div className={styles.actions}>
              <button className={styles.viewBtn}>
                <FaEye /> Ver documento
              </button>

              <input
                type="file"
                id={`file-${project.id}`}
                style={{ display: "none" }}
                onChange={(e) => handleFileChange(e, project.id)}
              />

              <button
                className={styles.uploadBtn}
                onClick={() => handleFileUpload(project.id)}
              >
                <FaUpload /> Actualizar documento
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
