import React, { useEffect, useState } from "react";
import styles from "../../css/EvaluatorDashboard.module.css";
import { getEvaluatorStats } from "../../services/evaluatorService";

export default function EvaluatorDashboard() {
  const [stats, setStats] = useState({
    asignados: 0,
    enRevision: 0,
    finalizados: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    getEvaluatorStats(token).then((data) => {
      setStats({
        asignados: data.asignados || 0,
        enRevision: data.en_revision || 0,
        finalizados: data.finalizados || 0,
      });
    });
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Panel del Evaluador</h1>
        <p>Bienvenido. Aquí puedes gestionar y evaluar tus proyectos asignados.</p>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.card}>
          <h3>Proyectos Asignados</h3>
          <span className={styles.count}>{stats.asignados}</span>
        </div>

        <div className={styles.card}>
          <h3>En Revisión</h3>
          <span className={styles.count}>{stats.enRevision}</span>
        </div>

        <div className={styles.card}>
          <h3>Finalizados</h3>
          <span className={styles.count}>{stats.finalizados}</span>
        </div>
      </div>

      <div className={styles.actionsGrid}>
        <div className={styles.actionCard}>
          <h2>Continuar Evaluación</h2>
          <p>Accede rápidamente al último proyecto que estabas evaluando.</p>
          <button className={styles.buttonPrimary}>Continuar</button>
        </div>

        <div className={styles.actionCard}>
          <h2>Ver Proyectos</h2>
          <p>Consulta todos los proyectos pendientes que necesitas evaluar.</p>
          <button className={styles.buttonSecondary}>Ir a proyectos</button>
        </div>
      </div>
    </div>
  );
}
