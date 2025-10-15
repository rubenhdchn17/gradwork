import React from 'react';
import styles from '../css/AssignEvaluatorWireframe.module.css';

export function AssignEvaluatorWireframe({ project }) {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Asignación de Evaluador</h1>
            </header>

            <div className={styles.formBox}>
                <div className={styles.field}>
                    <label>Proyecto</label>
                    <input
                        readOnly
                        value={project ?? 'Selecciona un proyecto'}
                        className={`${styles.input} ${styles.readOnly}`}
                    />
                </div>

                <div className={styles.field}>
                    <label>Evaluador (seleccionar)</label>
                    <select className={styles.select}>
                        <option>Dr. Pérez - perez@uni.edu.co</option>
                        <option>Dra. Ruiz - ruiz@uni.edu.co</option>
                    </select>
                </div>

                <div className={styles.field}>
                    <label>Correo institucional</label>
                    <input
                        placeholder="evaluador@uni.edu.co"
                        className={styles.input}
                    />
                </div>

                <div className={styles.field}>
                    <label>Observaciones</label>
                    <textarea
                        className={`${styles.input} ${styles.textarea}`}
                        placeholder="Escribe comentarios o detalles relevantes..."
                    />
                </div>

                <div className={styles.fileRow}>
                    <input type="file" className={styles.fileInput} />
                    <span className={styles.fileLabel}>Adjuntar formato (opcional)</span>
                </div>

                <div className={styles.actions}>
                    <button className={styles.submitButton}>Asignar</button>
                </div>
            </div>
        </div>
    );
}

export default AssignEvaluatorWireframe;
