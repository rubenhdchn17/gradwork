import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../css/EvaluatorProjects.module.css";
import { getEvaluatorProjects } from "../../services/evaluatorService";

export default function EvaluatorProjects() {
  const navigate = useNavigate();

  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const data = await getEvaluatorProjects(token);
      setProyectos(data || []);
    } catch (err) {
      console.error("Error cargando proyectos:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p>Cargando proyectos...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <h2>Proyectos Asignados</h2>
        <p className={styles.subtitle}>Lista de proyectos pendientes o evaluados</p>
      </div>

      <table className={styles.projectTable}>
        <thead>
          <tr>
            <th>Título</th>
            <th>Integrantes</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>

        <tbody>
          {proyectos.length === 0 ? (
            <tr>
              <td colSpan="4">No tienes proyectos asignados.</td>
            </tr>
          ) : (
            proyectos.map((p) => (
              <tr key={p.id}>
                <td>{p.titulo}</td>

                <td>{p.integrantes?.join(", ")}</td>

                <td>
                  <span className={`${styles.status} ${styles[p.estado]}`}>
                    {p.estado === "pendiente" ? "Pendiente" : "Evaluado"}
                  </span>
                </td>

                <td>
                  {p.estado === "pendiente" ? (
                    <button
                      className={styles.btnEvaluate}
                      onClick={() => navigate(`/evaluator/evaluar/${p.id}`)}
                    >
                      Evaluar
                    </button>
                  ) : (
                    <button
                      className={styles.btnHistory}
                      onClick={() => navigate(`/evaluator/evaluacion/${p.id}`)}
                    >
                      Ver evaluación
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
