import React from 'react';
import styles from '../css/EvaluatorReviewWireframe.module.css';

export function EvaluatorReviewWireframe({ project }) {
    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <h1 className={styles.title}>Evaluación de Proyecto</h1>
                <p className={styles.subtitle}>
                    Proyecto: <span className={styles.projectName}>{project ?? 'Sin seleccionar'}</span>
                </p>
            </header>

            {/* Main grid */}
            <div className={styles.grid}>
                {/* PDF Preview */}
                <div className={styles.pdfSection}>
                    <h2 className={styles.sectionTitle}>Documento</h2>
                    <div className={styles.pdfPreview}>
                        Vista previa PDF (wireframe)
                    </div>
                </div>

                {/* Rubric and Verdict */}
                <aside className={styles.sidebar}>
                    <h2 className={styles.sectionTitle}>Rúbrica y Veredicto</h2>
                    <div className={styles.form}>
                        <div className={styles.field}>
                            <label>Claridad</label>
                            <select className={styles.select}>
                                <option>1</option><option>2</option><option>3</option><option>4</option><option>5</option>
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label>Metodología</label>
                            <select className={styles.select}>
                                <option>1</option><option>2</option><option>3</option><option>4</option><option>5</option>
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label>Originalidad</label>
                            <select className={styles.select}>
                                <option>1</option><option>2</option><option>3</option><option>4</option><option>5</option>
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label>Observaciones</label>
                            <textarea className={styles.textarea} placeholder="Comentarios u observaciones..." />
                        </div>

                        <div className={styles.field}>
                            <label>Veredicto</label>
                            <select className={styles.select}>
                                <option>Aprobado</option>
                                <option>Aprobado con modificaciones</option>
                                <option>No aprobado</option>
                            </select>
                        </div>

                        <div className={styles.actions}>
                            <button className={styles.secondaryButton}>Guardar</button>
                            <button className={styles.primaryButton}>Enviar evaluación</button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default EvaluatorReviewWireframe;
