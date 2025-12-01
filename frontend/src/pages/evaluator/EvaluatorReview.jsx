import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../../css/EvaluatorReviewWireframe.module.css";
import {
  getProjectById,
  getEvaluation,
  sendEvaluation,
} from "../../services/evaluatorService";

export default function EvaluatorReview() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [proyecto, setProyecto] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [viewerUrl, setViewerUrl] = useState(null);

  const [claridad, setClaridad] = useState("3");
  const [metodologia, setMetodologia] = useState("3");
  const [originalidad, setOriginalidad] = useState("3");
  const [comentarios, setComentarios] = useState("");

  const [evaluationExists, setEvaluationExists] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
    loadExistingEvaluation();
  }, []);

  async function loadProject() {
    try {
      const data = await getProjectById(id, token);

      if (data.error) {
        alert("Error cargando proyecto: " + data.error);
        return;
      }

      setProyecto(data);

      if (data.archivo_path) {
        const fileUrl = `http://localhost:3000${data.archivo_path}`;
        setPdfUrl(fileUrl);

        const encoded = encodeURIComponent(fileUrl);
        const officeViewer = `https://view.officeapps.live.com/op/embed.aspx?src=${encoded}`;

        setViewerUrl(officeViewer);
      }

    } catch (err) {
      console.error("Error cargando proyecto:", err);
    }
  }

  async function loadExistingEvaluation() {
    try {
      const data = await getEvaluation(id, token);

      if (!data.error) {
        setClaridad(String(data.criterio_claridad));
        setMetodologia(String(data.criterio_metodologia));
        setOriginalidad(String(data.criterio_originalidad));
        setComentarios(data.comentarios || "");
        setEvaluationExists(true);
      }
    } catch {
      console.log("Sin evaluación previa.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    const payload = {
      proyecto_id: id,
      claridad,
      metodologia,
      originalidad,
      comentarios,
      veredicto: "aprobado_con_modificaciones",
    };

    const res = await sendEvaluation(payload, token);

    if (res.error) {
      alert("Error: " + res.error);
    } else {
      alert("Evaluación enviada correctamente.");

      navigate("/evaluator/proyectos");
    }
  }

  if (loading) return <p>Cargando evaluación…</p>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Evaluación de Proyecto</h1>

        <p className={styles.subtitle}>
          Proyecto:{" "}
          <span className={styles.projectName}>
            {proyecto?.titulo ?? "Sin título"}
          </span>
        </p>

        <p className={styles.subtitleSmall}>
          Integrantes:{" "}
          {proyecto?.integrantes?.join(", ") ?? "No especificados"}
        </p>
      </header>

      <div className={styles.grid}>

        <div className={styles.pdfSection}>
          <h2 className={styles.sectionTitle}>Documento</h2>

          {viewerUrl ? (
            <iframe
              src={viewerUrl}
              className={styles.pdfPreview}
              title="Vista previa del documento"
              frameBorder="0"
            />
          ) : (
            <div className={styles.pdfPreview}>
              El estudiante no adjuntó archivo.
            </div>
          )}
        </div>

        <aside className={styles.sidebar}>
          <h2 className={styles.sectionTitle}>Rúbrica de Evaluación</h2>

          <div className={styles.form}>

            <div className={styles.field}>
              <label>Claridad</label>
              <select className={styles.select} value={claridad}
                onChange={(e) => setClaridad(e.target.value)}>
                <option>1</option><option>2</option><option>3</option>
                <option>4</option><option>5</option>
              </select>
            </div>

            <div className={styles.field}>
              <label>Metodología</label>
              <select className={styles.select} value={metodologia}
                onChange={(e) => setMetodologia(e.target.value)}>
                <option>1</option><option>2</option><option>3</option>
                <option>4</option><option>5</option>
              </select>
            </div>

            <div className={styles.field}>
              <label>Originalidad</label>
              <select className={styles.select} value={originalidad}
                onChange={(e) => setOriginalidad(e.target.value)}>
                <option>1</option><option>2</option><option>3</option>
                <option>4</option><option>5</option>
              </select>
            </div>

            <div className={styles.field}>
              <label>Observaciones</label>
              <textarea
                className={styles.textarea}
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
              />
            </div>

            <div className={styles.actions}>
              <button className={styles.primaryButton} onClick={handleSubmit}>
                {evaluationExists ? "Actualizar evaluación" : "Enviar evaluación"}
              </button>
            </div>

          </div>
        </aside>
      </div>
    </div>
  );
}
