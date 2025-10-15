import React from 'react';
import styles from '../css/CoordinatorDashboardWireframe.module.css';

export function CoordinatorDashboardWireframe() {
    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Panel de Coordinación</h1>
                    <p className={styles.subtitle}>Visión general y herramientas administrativas</p>
                </div>
                <div className={styles.actions}>
                    <button className={styles.button}>Exportar</button>
                    <button className={styles.button}>Crear convocatoria</button>
                </div>
            </header>

            {/* Stats section */}
            <section className={styles.stats}>
                <div className={styles.statCard}>
                    <p>Total proyectos</p>
                    <span className={styles.statValue}>120</span>
                </div>
                <div className={styles.statCard}>
                    <p>Aprobados</p>
                    <span className={styles.statValue}>85</span>
                </div>
                <div className={styles.statCard}>
                    <p>En curso</p>
                    <span className={styles.statValue}>30</span>
                </div>
            </section>

            {/* Table section */}
            <section className={styles.tableSection}>
                <div className={styles.tableHeader}>
                    <h2 className={styles.tableTitle}>Listado de proyectos</h2>
                    <div className={styles.filters}>
                        <input placeholder="Buscar..." className={styles.input} />
                        <select className={styles.select}>
                            <option>Filtrar por programa</option>
                        </select>
                    </div>
                </div>

                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Proyecto</th>
                                <th>Estado</th>
                                <th>Asesor</th>
                                <th>Evaluador</th>
                                <th>Último cambio</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Sistema ABC</td>
                                <td>En revisión</td>
                                <td>Gómez</td>
                                <td>Torres</td>
                                <td>02/10/2025</td>
                                <td>
                                    <button className={styles.viewButton}>Ver</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default CoordinatorDashboardWireframe;
