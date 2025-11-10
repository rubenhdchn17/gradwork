import React from 'react';
import styles from '../../css/AnteprojectRegisterWireframe.module.css';

export function AnteprojectRegisterWireframe({ projectList = [] }) {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Registro de Anteproyecto</h1>
            </header>

            <div className={styles.formBox}>
                <div className={styles.field}>
                    <label>Proyecto asociado</label>
                    <select className={styles.select}>
                        {projectList.length === 0
                            ? <option>Proyecto A</option>
                            : projectList.map((p, i) => <option key={i}>{p}</option>)}
                    </select>
                </div>

                <div className={styles.field}>
                    <label>Nombre del anteproyecto</label>
                    <input className={styles.input} />
                </div>

                <div className={styles.field}>
                    <label>Cargar anteproyecto</label>
                    <input type="file" className={styles.fileInput} />
                </div>

                <div className={styles.field}>
                    <label>Cargar informe final (opcional)</label>
                    <input type="file" className={styles.fileInput} />
                </div>

                <div className={styles.actions}>
                    <button className={styles.submitButton}>Enviar</button>
                </div>
            </div>
        </div>
    );
}

export default AnteprojectRegisterWireframe;
