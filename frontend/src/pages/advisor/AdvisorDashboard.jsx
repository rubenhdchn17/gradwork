import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../css/AdvisorDashboard.module.css";
import {
  getAdvisorStats,
  getAdvisorProjects,
} from "../../services/asesorService";

export default function AdvisorDashboard() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    proyectos_asignados: 0,
    propuestas: 0,
    en_revision: 0,
    aprobados: 0,
  });

  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [statsRes, projRes] = await Promise.all([
        getAdvisorStats(token),
        getAdvisorProjects(token),
      ]);

      if (!statsRes.error) setStats(statsRes);
      if (!projRes.error) setProyectos(projRes || []);
    } catch (err) {
      console.error("Error cargando dashboard asesor:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p>Cargando dashboard del asesor…</p>;

  return (
    <div className={styles.container}>
      <header className={styles.headerBar}>
        <div>
          <h1 className={styles.title}>Panel del Asesor</h1>
          <p className={styles.subtitle}>
            Resumen de proyectos que estás asesorando
          </p>
        </div>
      </header>

      <section className={styles.statsGrid}>
        <div className={styles.card}>
          <h3>Proyectos asignados</h3>
          <p className={styles.cardNumber}>{stats.proyectos_asignados}</p>
        </div>

        <div className={styles.card}>
          <h3>Propuestas</h3>
          <p className={styles.cardNumber}>{stats.propuestas}</p>
        </div>

        <div className={styles.card}>
          <h3>En revisión</h3>
          <p className={styles.cardNumber}>{stats.en_revision}</p>
        </div>

        <div className={styles.card}>
          <h3>Aprobados</h3>
          <p className={styles.cardNumber}>{stats.aprobados}</p>
        </div>
      </section>

      <section className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <h2>Proyectos asesorados</h2>
          <p className={styles.tableSubtitle}>
            Detalle de cada proyecto y su estado
          </p>
        </div>

        <table className={styles.projectTable}>
          <thead>
            <tr>
              <th>Título</th>
              <th>Integrantes</th>
              <th>Estado</th>
              <th>Calificación</th>
              <th>Fecha evaluación</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {proyectos.length === 0 ? (
              <tr>
                <td colSpan="6">No tienes proyectos asignados como asesor.</td>
              </tr>
            ) : (
              proyectos.map((p) => (
                <tr key={p.id}>
                  <td>{p.titulo}</td>
                  <td>{p.integrantes?.join(", ")}</td>
                  <td>
                    <span
                      className={`${styles.status} ${styles[p.estado] || ""}`}
                    >
                      {p.estado}
                    </span>
                  </td>
                  <td>{p.calificacion_final ?? "—"}</td>
                  <td>
                    {p.fecha_evaluacion
                      ? new Date(p.fecha_evaluacion).toLocaleDateString()
                      : "—"}
                  </td>

                  <td>
                    <button
                      onClick={() => navigate(`/advisor/revisar/${p.id}`)}
                      className={styles.reviewButton}
                    >
                      Revisar
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
