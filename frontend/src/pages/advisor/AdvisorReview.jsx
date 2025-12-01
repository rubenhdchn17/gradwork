import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../../css/AdvisorReview.module.css";

import { 
  getAdvisorProjectById, 
  sendAdvisorObservation 
} from "../../services/asesorService";

export default function AdvisorReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [proyecto, setProyecto] = useState(null);
  const [viewerUrl, setViewerUrl] = useState(null);
  const [comentarios, setComentarios] = useState("");
  const [archivoNuevo, setArchivoNuevo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
  }, []);

  async function loadProject() {
    try {
      const data = await getAdvisorProjectById(id, token);

      if (data.error) {
        alert("Error cargando proyecto: " + data.error);
        return;
      }

      setProyecto(data);

      if (data.archivo_path) {
        const fileUrl = `http://localhost:3000${data.archivo_path}`;
        const encoded = encodeURIComponent(fileUrl);
        const officeViewer = `https://view.officeapps.live.com/op/embed.aspx?src=${encoded}`;
        setViewerUrl(officeViewer);
      }

    } catch (err) {
      console.error("Error cargando proyecto:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (!comentarios.trim() && !archivoNuevo) {
      return alert("Debes escribir observaciones o subir un archivo.");
    }

    const formData = new FormData();
    formData.append("comentarios", comentarios);
    if (archivoNuevo) formData.append("archivo", archivoNuevo);

    const res = await sendAdvisorObservation(id, formData, token);

    if (res.error) {
      alert("Error: " + res.error);
    } else {
      alert("Observaciones enviadas correctamente.");
      navigate("/advisor/dashboard");
    }
  }

  if (loading) return <p>Cargando proyecto…</p>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Revisión del Proyecto</h1>
        <p className={styles.projectName}>{proyecto?.titulo}</p>
      </header>

      <div className={styles.grid}>
        
        <div className={styles.previewSection}>
          <h2 className={styles.sectionTitle}>Documento del Estudiante</h2>

          {viewerUrl ? (
            <iframe
              src={viewerUrl}
              className={styles.preview}
              title="Vista previa"
            />
          ) : (
            <div className={styles.noFile}>El estudiante no adjuntó archivo.</div>
          )}
        </div>

        <aside className={styles.sidebar}>
          <h2 className={styles.sectionTitle}>Observaciones del Asesor</h2>

          <div className={styles.form}>

            <label className={styles.label}>Comentarios</label>
            <textarea
              className={styles.textarea}
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
            />

            <label className={styles.label}>Subir archivo corregido (opcional)</label>
            <input
              type="file"
              className={styles.fileInput}
              accept=".pdf,.doc,.docx"
              onChange={(e) => setArchivoNuevo(e.target.files[0])}
            />

            <button className={styles.button} onClick={handleSubmit}>
              Enviar Observación
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
}
