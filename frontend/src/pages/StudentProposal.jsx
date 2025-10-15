import React from 'react';
import styles from '../css/StudentProposalWireframe.module.css';

export function StudentProposalWireframe({ onSubmit }) {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Registro de Propuesta</h1>
                <p className={styles.subtitle}>Formulario simplificado</p>
            </header>

            <form className={styles.form}>
                <section className={styles.section}>
                    <h2>Datos del proyecto</h2>
                    <div className={styles.fieldGroup}>
                        <label>Nombre de la propuesta</label>
                        <input
                            type="text"
                            placeholder="Ej: Sistema de gestión académica"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.flexRow}>
                        <div className={styles.fieldGroup}>
                            <label>Programa académico</label>
                            <select className={styles.select}>
                                <option>Ingeniería de Sistemas</option>
                                <option>Ingeniería Industrial</option>
                                <option>Otra</option>
                            </select>
                        </div>

                        <div className={styles.fieldGroup}>
                            <label>Opción de grado</label>
                            <select className={styles.select}>
                                <option>Monografía</option>
                                <option>Artículo</option>
                                <option>Proyecto aplicado</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2>Integrantes</h2>
                    <div className={styles.fieldGroup}>
                        <label>Nombre estudiante principal</label>
                        <input placeholder="Nombre completo" className={styles.input} />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label>Correo institucional</label>
                        <input placeholder="correo@uni.edu.co" className={styles.input} />
                    </div>

                    <div className={styles.flexRow}>
                        <div className={styles.fieldGroup}>
                            <label>Nombre colaborador</label>
                            <input placeholder="Nombre del colaborador" className={styles.input} />
                        </div>

                        <div className={styles.fieldGroup}>
                            <label>Correo colaborador</label>
                            <input placeholder="correo@uni.edu.co" className={styles.input} />
                        </div>
                    </div>

                    <button type="button" className={styles.addButton}>+ Agregar colaborador</button>
                </section>

                <section className={styles.section}>
                    <h2>Adjuntar documento</h2>
                    <div className={styles.fileInput}>
                        <input type="file" />
                        <span>(Formatos aceptados: .pdf, .docx)</span>
                    </div>
                </section>

                {/* ACCIONES */}
                <div className={styles.actions}>
                    <button type="button" className={styles.button}>Guardar borrador</button>
                    <button
                        type="submit"
                        onClick={onSubmit}
                        className={`${styles.button} ${styles.primary}`}
                    >
                        Enviar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default StudentProposalWireframe;
