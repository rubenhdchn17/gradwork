import React, { useState, useEffect } from "react";
import styles from "../../css/AssignAdvisorWireframe.module.css";

export default function AssignAdvisor() {
  const [proyectoSearch, setProyectoSearch] = useState("");
  const [asesorSearch, setAsesorSearch] = useState("");
  const [proyectoId, setProyectoId] = useState("");
  const [asesorId, setAsesorId] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [proyectos, setProyectos] = useState([]);
  const [asesores, setAsesores] = useState([]);
  const [filteredProyectos, setFilteredProyectos] = useState([]);
  const [filteredAsesores, setFilteredAsesores] = useState([]);

  useEffect(() => {
    setProyectos([]);   
    setAsesores([]);
  }, []);

 
  useEffect(() => {
    if (proyectoSearch.trim() === "") {
      setFilteredProyectos([]);
      return;
    }

    const f = proyectos.filter(p =>
      p.titulo.toLowerCase().includes(proyectoSearch.toLowerCase())
    );

    setFilteredProyectos(f);
  }, [proyectoSearch, proyectos]);
  useEffect(() => {
    if (asesorSearch.trim() === "") {
      setFilteredAsesores([]);
      return;
    }

    const f = asesores.filter(a =>
      a.nombre.toLowerCase().includes(asesorSearch.toLowerCase())
    );

    setFilteredAsesores(f);
  }, [asesorSearch, asesores]);

  const selectProyecto = (p) => {
    setProyectoId(p.id);
    setProyectoSearch(`${p.titulo} — ${p.estudiante_nombre}`);
    setFilteredProyectos([]);
  };

  const selectAsesor = (a) => {
    setAsesorId(a.id);
    setAsesorSearch(`${a.nombre}`);
    setFilteredAsesores([]);
  };

  const handleSubmit = () => {
    if (!proyectoId || !asesorId) {
      alert("Debes seleccionar proyecto y asesor.");
      return;
    }

    alert("✅ Vista de diseño OK. Listo para conectar backend.");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Asignación de Asesor</h1>
      </header>

      <div className={styles.formBox}>

        <div className={styles.field}>
          <label>Buscar proyecto</label>
          <input
            type="text"
            className={styles.input}
          placeholder="Escribe el nombre del proyecto"
            value={proyectoSearch}
            onChange={(e) => {
              setProyectoSearch(e.target.value);
              setProyectoId(""); 
            }}
          />

          {filteredProyectos.length > 0 && (
            <div className={styles.dropdown}>
              {filteredProyectos.map(p => (
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
          <label>Buscar asesor</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Escribe el nombre del asesor"
            value={asesorSearch}
            onChange={(e) => {
              setAsesorSearch(e.target.value);
              setAsesorId("");
            }}
          />

          {filteredAsesores.length > 0 && (
            <div className={styles.dropdown}>
              {filteredAsesores.map(a => (
                <div
                  key={a.id}
                  className={styles.dropdownItem}
                  onClick={() => selectAsesor(a)}
                >
                  {a.nombre}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.field}>
          <label>Comentarios</label>
          <textarea
            className={`${styles.input} ${styles.textarea}`}
            placeholder="Escribe observaciones..."
            value={comentarios}
            onChange={(e) => setComentarios(e.target.value)}
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.secondaryButton}>
            Asignación automática
          </button>

          <button className={styles.submitButton} onClick={handleSubmit}>
            Confirmar asignación
          </button>
        </div>

      </div>
    </div>
  );
}
