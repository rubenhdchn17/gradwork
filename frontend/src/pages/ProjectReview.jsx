import React, { useState } from "react";
import styles from "../css/ProjectReview.module.css";

export default function ProjectReview() {
  const [file, setFile] = useState(null);

  const observations = [
    { date: "2025-09-20", note: "Falta ajustar el marco teórico." },
    { date: "2025-10-05", note: "Documento corregido, falta anexar bibliografía." },
  ];

  const handleFileUpload = (e) => setFile(e.target.files[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Correcciones enviadas correctamente");
  };

  return (
    <div className={styles.container}>
      <h1>Revisión del Proyecto</h1>

      <section className={styles.details}>
        <h2>Detalles del Proyecto</h2>
        <p><strong>Nombre:</strong> Sistema de Gestión de Inventarios</p>
        <p><strong>Estudiantes:</strong> Juan Pérez, María Gómez</p>
        <p><strong>Programa:</strong> Ingeniería de Sistemas</p>
        <p><strong>Estado:</strong> En revisión</p>
      </section>

      <section className={styles.upload}>
        <h2>Subir archivo con correcciones</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input type="file" onChange={handleFileUpload} accept=".pdf,.docx" />
          {file && <p>Archivo seleccionado: <strong>{file.name}</strong></p>}
          <button type="submit">Enviar correcciones</button>
        </form>
      </section>

      <section className={styles.observations}>
        <h2>Historial de observaciones</h2>
        <ul>
          {observations.map((obs, index) => (
            <li key={index}>
              <span>{obs.date}</span> — {obs.note}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
