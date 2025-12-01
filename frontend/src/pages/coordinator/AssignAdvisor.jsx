import React, { useState, useEffect } from "react";
import styles from "../../css/AssignAdvisorWireframe.module.css";
import {
  fetchAsesores,
  fetchProyectosSinAsesor,
  asignarAsesor,
} from "../../services/coordinatorService";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [prj, asr] = await Promise.all([
          fetchProyectosSinAsesor(),
          fetchAsesores(),
        ]);
        setProyectos(prj || []);
        setAsesores(asr || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!proyectoSearch.trim()) { setFilteredProyectos([]); return; }
    const txt = proyectoSearch.toLowerCase();
    const local = proyectos.filter(
      p => p.titulo.toLowerCase().includes(txt) ||
      (p.estudiante_nombre || "").toLowerCase().includes(txt)
    );
    setFilteredProyectos(local);

    if (proyectoSearch.trim().length >= 2) {
      fetchProyectosSinAsesor({ q: proyectoSearch })
        .then(setProyectos)
        .catch(() => {});
    }
  }, [proyectoSearch]);

  useEffect(() => {
    if (!asesorSearch.trim()) { setFilteredAsesores([]); return; }
    const txt = asesorSearch.toLowerCase();
    const local = asesores.filter(
      a => a.nombre.toLowerCase().includes(txt) ||
      a.correo.toLowerCase().includes(txt)
    );
    setFilteredAsesores(local);

    if (asesorSearch.trim().length >= 2) {
      fetchAsesores({ q: asesorSearch })
        .then(setAsesores)
        .catch(() => {});
    }
  }, [asesorSearch]);

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

  const handleSubmit = async () => {
    if (!proyectoId || !asesorId) {
      alert("Debes seleccionar proyecto y asesor.");
      return;
    }
    try {
      await asignarAsesor({
        proyecto_id: proyectoId,
        asesor_id: asesorId,
        comentarios,
      });

      alert("Asesor asignado correctamente");

      setProyectoId("");
      setAsesorId("");
      setProyectoSearch("");
      setAsesorSearch("");
      setComentarios("");

      const prj = await fetchProyectosSinAsesor();
      setProyectos(prj || []);
    } catch (e) {
      console.error(e);
      alert("No se pudo asignar el asesor");
    }
  };

  if (loading) return <p>Cargando...</p>;

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
            onChange={(e) => { setProyectoSearch(e.target.value); setProyectoId(""); }}
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
            onChange={(e) => { setAsesorSearch(e.target.value); setAsesorId(""); }}
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
          <button className={styles.secondaryButton}>Asignación automática</button>
          <button className={styles.submitButton} onClick={handleSubmit}>Confirmar asignación</button>
        </div>
      </div>
    </div>
  );
}
