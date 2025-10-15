import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/EvaluatorProjects.module.css";

export default function EvaluatorProjects() {
  const navigate = useNavigate();

  const proyectos = [
    { id: 1, titulo: "Sistema de Gestión Académica", autor: "Juan Pérez", estado: "Pendiente" },
    { id: 2, titulo: "App Móvil de Tutorías", autor: "Laura Gómez", estado: "En revisión" },
  ];

  return (
    <div className={styles["evaluator-projects"]}>
      <div className={styles["header-bar"]}>
        <h2>Proyectos Asignados para Evaluar</h2>
      </div>

      <table className={styles["project-table"]}>
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {proyectos.map((p) => (
            <tr key={p.id}>
              <td>{p.titulo}</td>
              <td>{p.autor}</td>
              <td>
                <span
                  className={`${styles.status} ${
                    styles[p.estado.toLowerCase().replace(" ", "-")]
                  }`}
                >
                  {p.estado}
                </span>
              </td>
              <td>
                <button
                  className={styles["btn-evaluate"]}
                  onClick={() => navigate(`/evaluar/${p.id}`)}
                >
                  Evaluar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
