import React, { useEffect, useState } from "react";
import styles from "../../css/StudentProjects.module.css";
import { FaFileAlt, FaUpload, FaEye } from "react-icons/fa";
import { fetchStudentProjects, updateProjectFile } from "../../services/studentService";

export default function StudentProjects() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    fetchStudentProjects(user.id)
      .then(setProjects)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando proyectos...</p>;
  if (projects.length === 0) return <p>No tienes proyectos registrados.</p>;

  const handleFileUpload = (id) => {
    document.getElementById(`file-${id}`).click();
  };

  const handleFileChange = async (e, projectId) => {
    const file = e.target.files[0];
    if (!file) return;

    const confirmar = window.confirm(
      `¿Deseas reemplazar el archivo del proyecto ${projectId}?\n\nArchivo nuevo: ${file.name}`
    );

    if (!confirmar) return;

    try {
      await updateProjectFile(projectId, file);
      alert("Archivo actualizado correctamente.");

      const updated = await fetchStudentProjects(user.id);
      setProjects(updated);

    } catch (err) {
      console.error("Error actualizando archivo:", err);
      alert("Error actualizando archivo: " + err.message);
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
              <h2>{project.titulo}</h2>
            </div>

            <div className={styles.details}>
              <p>
                <strong>Estado:</strong>{" "}
                <span className={styles.status}>{project.estado}</span>
              </p>

              <p>
                <strong>Asesor:</strong>{" "}
                {project.asesor_nombre || "Por asignar"}
              </p>

              <p>
                <strong>Última actualización:</strong>{" "}
                {new Date(project.creado_en).toLocaleDateString()}
              </p>
            </div>

            <div className={styles.actions}>
              <button
                className={styles.viewBtn}
                disabled={!project.archivo_path}
                onClick={() =>
                  window.open(`http://localhost:3000${project.archivo_path}`)
                }
              >
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
