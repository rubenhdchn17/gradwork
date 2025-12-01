import React from 'react';
import styles from '../../css/AssignEvaluatorWireframe.module.css';

export default function AssignEvaluatorWireframe({
    proyectoSearch,
    setProyectoSearch,
    filteredProyectos = [],
    selectProyecto,

    evaluadorSearch,
    setEvaluadorSearch,
    filteredEvaluadores = [],
    selectEvaluador,

    handleSubmit
}) {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Asignación de Evaluador</h1>
            </header>

            <div className={styles.formBox}>

                <div className={styles.field}>
                    <label>Buscar proyecto</label>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="Escribe el nombre del proyecto"
                        value={proyectoSearch}
                        onChange={(e) => setProyectoSearch(e.target.value)}
                    />

                    {filteredProyectos.length > 0 && (
                        <div className={styles.dropdown}>
                            {filteredProyectos.map((p) => (
                                <div
                                    key={p.id}
                                    className={styles.dropdownItem}
                                    onClick={() => selectProyecto(p)}
                                >
                                    {p.titulo} — {p.estudiante_nombre}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.field}>
                    <label>Buscar evaluador</label>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="Escribe el nombre o correo del evaluador"
                        value={evaluadorSearch}
                        onChange={(e) => setEvaluadorSearch(e.target.value)}
                    />

                    {filteredEvaluadores.length > 0 && (
                        <div className={styles.dropdown}>
                            {filteredEvaluadores.map((a) => (
                                <div
                                    key={a.id}
                                    className={styles.dropdownItem}
                                    onClick={() => selectEvaluador(a)}
                                >
                                    {a.nombre} — {a.correo}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.actions}>
                    <button className={styles.submitButton} onClick={handleSubmit}>
                        Asignar
                    </button>
                </div>

            </div>
        </div>
    );
}
