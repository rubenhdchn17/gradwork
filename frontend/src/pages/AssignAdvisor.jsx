import React from 'react';
import styles from '../css/AssignAdvisorWireframe.module.css';

export function AssignAdvisorWireframe({ project }) {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Asignación de Asesor</h1>
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

                <div className={styles.row}>
                    <div className={styles.field}>
                        <label>Docente Asesor</label>
                        <select className={styles.select}>
                            <option>Ing. Gómez - gomez@uni.edu.co</option>
                            <option>Ing. Díaz - diaz@uni.edu.co</option>
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label>Correo institucional</label>
                        <input
                            placeholder="asesor@uni.edu.co"
                            className={styles.input}
                        />
                    </div>
                </div>

                <div className={styles.field}>
                    <label>Área / Línea de investigación</label>
                    <select className={styles.select}>
                        <option>Sistemas de Información</option>
                        <option>Optimización Industrial</option>
                    </select>
                </div>

                <div className={styles.field}>
                    <label>Comentarios</label>
                    <textarea
                        className={`${styles.input} ${styles.textarea}`}
                        placeholder="Escribe observaciones o notas adicionales..."
                    />
                </div>

                <div className={styles.actions}>
                    <button className={styles.secondaryButton}>Asignación automática</button>
                    <button className={styles.submitButton}>Confirmar asignación</button>
                </div>
            </div>
        </div>
    );
}

export default AssignAdvisorWireframe;
