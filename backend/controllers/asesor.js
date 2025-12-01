import connection from "../db.js";

export function getAdvisorStats(req, res, authUser) {
  if (authUser.rol !== "asesor") {
    res.writeHead(403, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Acceso no autorizado" }));
  }

  const sql = `
    SELECT
      COUNT(*) AS proyectos_asignados,
      SUM(estado = 'propuesta')  AS propuestas,
      SUM(estado = 'en_revision') AS en_revision,
      SUM(estado = 'aprobado')   AS aprobados
    FROM proyectos
    WHERE asesor_id = ?;
  `;

  connection.query(sql, [authUser.id], (err, rows) => {
    if (err) {
      console.error("Error obteniendo estadísticas de asesor:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ error: "Error obteniendo estadísticas del asesor" })
      );
    }

    const stats = rows?.[0] || {};

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        proyectos_asignados: Number(stats.proyectos_asignados || 0),
        propuestas: Number(stats.propuestas || 0),
        en_revision: Number(stats.en_revision || 0),
        aprobados: Number(stats.aprobados || 0),
      })
    );
  });
}

export function getAdvisorProjects(req, res, authUser) {
  if (authUser.rol !== "asesor") {
    res.writeHead(403, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Acceso no autorizado" }));
  }

  const sql = `
    SELECT 
      p.id,
      p.titulo,
      p.estado,
      p.creado_en,
      p.calificacion_final,
      p.fecha_evaluacion,
      u.nombre AS estudiante,
      c.nombre AS colaborador
    FROM proyectos p
    LEFT JOIN usuarios u ON u.id = p.estudiante_id
    LEFT JOIN usuarios c ON c.id = p.colaborador_id
    WHERE p.asesor_id = ?
    ORDER BY p.creado_en DESC
  `;

  connection.query(sql, [authUser.id], (err, rows) => {
    if (err) {
      console.error("❌ Error obteniendo proyectos de asesor:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Error consultando proyectos" }));
    }

    const proyectos = rows.map((p) => ({
      id: p.id,
      titulo: p.titulo,
      estado: p.estado,
      creado_en: p.creado_en,
      calificacion_final: p.calificacion_final,
      fecha_evaluacion: p.fecha_evaluacion,
      integrantes: [
        p.estudiante,
        ...(p.colaborador ? [p.colaborador] : []),
      ],
    }));

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(proyectos));
  });
}
