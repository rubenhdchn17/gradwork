import React, { useEffect, useState } from "react";
import styles from "../../css/CoordinatorDashboardWireframe.module.css";

import {
  fetchCoordinatorStats,
  fetchCoordinatorProjects,
  exportProjectsCSV,
  openProjectDocument
} from "../../services/coordinatorService";

export default function CoordinatorDashboard() {

  const [stats, setStats] = useState({
    total: 0,
    aprobados: 0,
    revision: 0,
    curso: 0,
    rechazados: 0,
    finalizados: 0
  });

  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [programas] = useState([]);
  const [convocatorias] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    programa: "",
    opcion_grado: "",
    estado: "",
    convocatoria_id: "",
    sort_by: "creado_en",
    sort_dir: "desc",
    page: 1,
    page_size: 20
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      const st = await fetchCoordinatorStats();

      setStats({
        total: st.total || 0,
        aprobados: st.aprobado || 0,
        revision: st.en_revision || 0,
        curso: st.anteproyecto || 0,
        rechazados: st.rechazado || 0,
        finalizados: st.finalizado || 0
      });

      loadProjects();
    } catch (err) {
      console.error("Error loading initial data:", err);
    }
  }

  useEffect(() => {
    loadProjects();
  }, [filters]);

  async function loadProjects() {
    setLoading(true);
    try {
      const data = await fetchCoordinatorProjects(filters);
      setProyectos(data.items || []);
    } catch (err) {
      console.error("Error loading projects:", err);
    } finally {
      setLoading(false);
    }
  }

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      [key]: value
    }));
  };

  const handleExport = () => {
    exportProjectsCSV(filters, "proyectos.csv");
  };

  return (
    <div className={styles.container}>

      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Panel de Coordinación</h1>
          <p className={styles.subtitle}>Visión general y herramientas administrativas</p>
        </div>

        <div className={styles.actions}>
          <button className={styles.button} onClick={handleExport}>
            Exportar
          </button>
          <button className={`${styles.button} ${styles.primary}`}>Crear convocatoria</button>
        </div>
      </header>


      <section className={styles.stats}>
        <div className={styles.statCard}><p>Total proyectos</p><span className={styles.statValue}>{stats.total}</span></div>
        <div className={styles.statCard}><p>Aprobados</p><span className={`${styles.statValue} ${styles.green}`}>{stats.aprobados}</span></div>
        <div className={styles.statCard}><p>En revisión</p><span className={`${styles.statValue} ${styles.blue}`}>{stats.revision}</span></div>
        <div className={styles.statCard}><p>En curso</p><span className={`${styles.statValue} ${styles.yellow}`}>{stats.curso}</span></div>
        <div className={styles.statCard}><p>Rechazados</p><span className={`${styles.statValue} ${styles.red}`}>{stats.rechazados}</span></div>
        <div className={styles.statCard}><p>Finalizados</p><span className={`${styles.statValue} ${styles.purple}`}>{stats.finalizados}</span></div>
      </section>

      <section className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Listado de proyectos</h2>

          <div className={styles.filters}>
            <input
              className={styles.input}
              placeholder="Buscar por título, estudiante, asesor..."
              onChange={(e) => updateFilter("search", e.target.value)}
            />

            <select className={styles.select} onChange={(e) => updateFilter("programa", e.target.value)}>
              <option value="">Programa</option>
              {programas.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>

            <select className={styles.select} onChange={(e) => updateFilter("opcion_grado", e.target.value)}>
              <option value="">Opción de grado</option>
              <option>Monografía</option>
              <option>Anteproyecto</option>
              <option>Proyecto aplicado</option>
            </select>

            <select className={styles.select} onChange={(e) => updateFilter("estado", e.target.value)}>
              <option value="">Estado</option>
              <option>propuesta</option>
              <option>anteproyecto</option>
              <option>en_revision</option>
              <option>aprobado</option>
              <option>rechazado</option>
              <option>finalizado</option>
            </select>
          </div>
        </div>

        <div className={styles.tableContainer}>
          {loading ? (
            <p>Cargando proyectos...</p>
          ) : proyectos.length === 0 ? (
            <p>No hay proyectos para mostrar.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Proyecto</th>
                  <th>Programa</th>
                  <th>Opción</th>
                  <th>Estudiante</th>
                  <th>Colaborador</th>
                  <th>Asesor</th>
                  <th>Evaluador</th>
                  <th>Convocatoria</th>
                  <th>Estado</th>
                  <th>Último cambio</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {proyectos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.titulo}</td>
                    <td>{p.programa}</td>
                    <td>{p.opcion_grado}</td>
                    <td>{p.estudiante_nombre}</td>
                    <td>{p.colaborador_nombre || "—"}</td>
                    <td>{p.asesor_nombre || "—"}</td>
                    <td>{p.evaluador_nombre || "—"}</td>
                    <td>{p.convocatoria_nombre || "—"}</td>

                    <td>
                      <span className={`${styles.badge} ${styles[`badge${p.estado}`] || styles.badgeDraft}`}>
                        {p.estado}
                      </span>
                    </td>

                    <td>{new Date(p.creado_en).toLocaleDateString()}</td>

                    <td>
                      <button
                        className={styles.viewButton}
                        onClick={() => openProjectDocument(p.archivo_path)}
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </section>
    </div>
  );
}
