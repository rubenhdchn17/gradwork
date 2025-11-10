// frontend/src/pages/student/StudentProposal.jsx
import React, { useState } from "react";
import styles from "../../css/StudentProposalWireframe.module.css";
import { submitProposal, buscarColaboradorPorCorreo } from "../../services/studentService";

export default function StudentProposal() {
  const user = JSON.parse(localStorage.getItem("user")); // { id, nombre, rol }

  const [titulo, setTitulo] = useState("");
  const [programa, setPrograma] = useState("Ingeniería de Sistemas");
  const [opcion, setOpcion] = useState("monografia");
  const [descripcion, setDescripcion] = useState("");

  // ✅ Buscar colaborador por correo
  const [correoColaborador, setCorreoColaborador] = useState("");
  const [colaborador, setColaborador] = useState(null);
  const [colaboradorId, setColaboradorId] = useState("");

  // ✅ Archivo
  const [archivo, setArchivo] = useState(null);
  const [sending, setSending] = useState(false);

  // ✅ Buscar colaborador en el backend
  async function buscarColaborador() {
    if (!correoColaborador.trim()) {
      return alert("Ingresa un correo para buscar al colaborador");
    }

    try {
      const data = await buscarColaboradorPorCorreo(correoColaborador);
      setColaborador(data);
      setColaboradorId(data.id); // Guardar automáticamente ID
      alert(`✅ Colaborador encontrado: ${data.nombre}`);
    } catch (err) {
      alert(err.message);
      setColaborador(null);
      setColaboradorId("");
    }
  }

  // ✅ Enviar formulario
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return alert("Sesión inválida");

    if (!titulo.trim()) return alert("Ingresa el nombre de la propuesta");

    // Validación archivo
    if (archivo) {
      const okTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
      ];
      if (!okTypes.includes(archivo.type)) {
        return alert("Formato no permitido. Sube PDF o DOCX.");
      }
    }

    // ✅ FormData para archivos
    const fd = new FormData();
    fd.append("titulo", titulo);
    fd.append("programa", programa);
    fd.append("opcion_grado", opcion);
    fd.append("descripcion", descripcion);
    fd.append("estudiante_id", String(user.id));

    if (colaboradorId) fd.append("colaborador_id", String(colaboradorId));
    if (archivo) fd.append("archivo", archivo);

    setSending(true);

    try {
      await submitProposal(fd);
      alert("✅ Propuesta enviada");

      // limpiar formulario
      setTitulo("");
      setPrograma("Ingeniería de Sistemas");
      setOpcion("monografia");
      setDescripcion("");
      setCorreoColaborador("");
      setColaborador(null);
      setColaboradorId("");
      setArchivo(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Registro de Propuesta</h1>
        <p className={styles.subtitle}>Formulario simplificado</p>
      </header>

      <form className={styles.form} onSubmit={onSubmit}>
        {/* Datos generales */}
        <section className={styles.section}>
          <h2>Datos del proyecto</h2>

          <div className={styles.fieldGroup}>
            <label>Nombre de la propuesta</label>
            <input
              type="text"
              placeholder="Ej: Sistema de gestión académica"
              className={styles.input}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          <div className={styles.flexRow}>
            <div className={styles.fieldGroup}>
              <label>Programa académico</label>
              <select
                className={styles.select}
                value={programa}
                onChange={(e) => setPrograma(e.target.value)}
              >
                <option>Ingeniería de Sistemas</option>
                <option>Ingeniería Industrial</option>
                <option>Otra</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label>Opción de grado</label>
              <select
                className={styles.select}
                value={opcion}
                onChange={(e) => setOpcion(e.target.value)}
              >
                <option value="monografia">Monografía</option>
                <option value="articulo">Artículo</option>
                <option value="proyecto_aplicado">Proyecto aplicado</option>
              </select>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label>Descripción</label>
            <textarea
              placeholder="Describe brevemente tu propuesta"
              className={styles.input}
              rows={4}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>
        </section>

        {/* Colaborador */}
        <section className={styles.section}>
          <h2>Integrantes</h2>

          <div className={styles.fieldGroup}>
            <label>Buscar colaborador por correo (opcional)</label>

            <div className={styles.searchRow}>
              <input
                type="email"
                placeholder="correo@uni.edu.co"
                className={styles.input}
                value={correoColaborador}
                onChange={(e) => setCorreoColaborador(e.target.value)}
              />

              <button
                type="button"
                className={styles.button}
                onClick={buscarColaborador}
              >
                Buscar
              </button>
            </div>
          </div>

          {/* Resultado */}
          {colaborador && (
            <div className={styles.colaboradorBox}>
              ✅ <b>{colaborador.nombre}</b> ({colaborador.correo})
            </div>
          )}
        </section>

        {/* Archivo */}
        <section className={styles.section}>
          <h2>Adjuntar documento</h2>
          <div className={styles.fileInput}>
            <input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => setArchivo(e.target.files?.[0] || null)}
            />
            <span>(Formatos aceptados: .pdf, .docx)</span>
          </div>
        </section>

        {/* Botones */}
        <div className={styles.actions}>
          <button type="button" className={styles.button} disabled={sending}>
            Guardar borrador
          </button>

          <button
            type="submit"
            className={`${styles.button} ${styles.primary}`}
            disabled={sending}
          >
            {sending ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </form>
    </div>
  );
}
