import React, { useEffect, useState } from "react";
import styles from "../../css/StudentDashboard.module.css";
import { FileText, CheckCircle, Clock } from "lucide-react";
import { fetchStudentDashboard } from "../../services/studentService";

export default function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    propuestas: 0,
    aprobados: 0,
    revision: 0,
  });
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchStudentDashboard(user.id);
        setStats({
          propuestas: data.propuestas,
          aprobados: data.aprobados,
          revision: data.revision,
        });
        setNotifications(data.notificaciones);
      } catch (err) {
        console.error("Error cargando dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p style={{ padding: "2rem" }}>Cargando...</p>;

  const statCards = [
    { label: "Propuestas enviadas", value: stats.propuestas, icon: <FileText size={24} />, color: "#dc2626" },
    { label: "Proyectos aprobados", value: stats.aprobados, icon: <CheckCircle size={24} />, color: "#16a34a" },
    { label: "En revisión", value: stats.revision, icon: <Clock size={24} />, color: "#facc15" },
  ];

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Bienvenido de nuevo</h1>
      <p className={styles.subtitle}>
        Aquí puedes consultar el estado general de tus propuestas y proyectos.
      </p>

      <div className={styles.statsContainer}>
        {statCards.map((item, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.icon} style={{ backgroundColor: item.color }}>
              {item.icon}
            </div>
            <div>
              <h3 className={styles.value}>{item.value}</h3>
              <p className={styles.label}>{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.notifications}>
        <h2>Notificaciones recientes</h2>
        {notifications.length ? (
          <ul>
            {notifications.map((msg, idx) => (
              <li key={idx} className={styles.notificationItem}>
                {msg}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noNotifications}>
            No tienes notificaciones por ahora
          </p>
        )}
      </div>
    </div>
  );
}
