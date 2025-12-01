import connection from "../db.js";

  export function getEvaluatorStats(req, res, authUser) {
    if (authUser.rol !== "evaluador") {
      res.writeHead(403, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Acceso no autorizado" }));
    }

    const sql = `
      SELECT
        COUNT(*) AS asignados,
        SUM(estado = 'en_revision') AS en_revision,
        SUM(estado = 'aprobado') AS finalizados
      FROM proyectos
      WHERE evaluador_id = ?;
    `;

    connection.query(sql, [authUser.id], (err, rows) => {
      if (err) {
        console.error("Error obteniendo estadísticas:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Error obteniendo estadísticas" }));
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(rows[0]));
    });
  }

  export function getProyectosAsignados(req, res, authUser) {
    if (authUser.rol !== "evaluador") {
      res.writeHead(403, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Acceso no autorizado" }));
    }

    const sql = `
      SELECT 
        p.id,
        p.titulo,
        p.estado,
        u.nombre AS estudiante,
        c.nombre AS colaborador
      FROM proyectos p
      LEFT JOIN usuarios u ON u.id = p.estudiante_id
      LEFT JOIN usuarios c ON c.id = p.colaborador_id
      WHERE p.evaluador_id = ?
      ORDER BY p.creado_en DESC
    `;

    connection.query(sql, [authUser.id], (err, rows) => {
      if (err) {
        console.error("Error consultando proyectos asignados:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Error consultando proyectos" }));
      }

      const proyectos = rows.map(p => ({
        id: p.id,
        titulo: p.titulo,
        integrantes: [
          p.estudiante,
          ...(p.colaborador ? [p.colaborador] : [])
        ],
        estado:
          p.estado === "en_revision"
            ? "pendiente"
            : p.estado === "aprobado"
            ? "evaluado"
            : p.estado
      }));

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(proyectos));
    });
  }
