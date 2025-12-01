import connection from "../db.js";

export function getCoordinatorStats(req, res, query) {
  const {
    q, programa, opcion_grado, estado, convocatoria_id,
  } = query || {};

  const where = [];
  const params = [];

  if (q) {
    where.push(
      `(p.titulo LIKE ? OR p.descripcion LIKE ? OR e.nombre LIKE ? OR a.nombre LIKE ? OR ev.nombre LIKE ?)`
    );
    const like = `%${q}%`;
    params.push(like, like, like, like, like);
  }

  if (programa) { where.push(`p.programa = ?`); params.push(programa); }
  if (opcion_grado) { where.push(`p.opcion_grado = ?`); params.push(opcion_grado); }
  if (estado) { where.push(`p.estado = ?`); params.push(estado); }
  if (convocatoria_id) { where.push(`p.convocatoria_id = ?`); params.push(convocatoria_id); }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const sql = `
    SELECT
      COUNT(*) AS total,
      SUM(p.estado = 'propuesta')    AS propuesta,
      SUM(p.estado = 'anteproyecto') AS anteproyecto,
      SUM(p.estado = 'en_revision')  AS en_revision,
      SUM(p.estado = 'aprobado')     AS aprobado,
      SUM(p.estado = 'rechazado')    AS rechazado,
      SUM(p.estado = 'finalizado')   AS finalizado
    FROM proyectos p
    LEFT JOIN usuarios e  ON e.id  = p.estudiante_id
    LEFT JOIN usuarios c  ON c.id  = p.colaborador_id
    LEFT JOIN usuarios a  ON a.id  = p.asesor_id
    LEFT JOIN usuarios ev ON ev.id = p.evaluador_id
    ${whereSql};
  `;

  connection.query(sql, params, (err, rows) => {
    if (err) {
      console.error("Stats error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Error obteniendo estadísticas" }));
    }
    const r = rows?.[0] || {};
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      total: Number(r.total || 0),
      propuesta: Number(r.propuesta || 0),
      anteproyecto: Number(r.anteproyecto || 0),
      en_revision: Number(r.en_revision || 0),
      aprobado: Number(r.aprobado || 0),
      rechazado: Number(r.rechazado || 0),
      finalizado: Number(r.finalizado || 0),
    }));
  });
}

export function listCoordinatorProjects(req, res, query) {
  let {
    q, programa, opcion_grado, estado, convocatoria_id,
    page = 1, pageSize = 10, order = "creado_en", sort = "DESC"
  } = query || {};

  page = Number(page) || 1;
  pageSize = Math.min(100, Number(pageSize) || 10);
  const offset = (page - 1) * pageSize;

  const allowedOrder = new Set(["creado_en", "titulo", "programa", "estado"]);
  if (!allowedOrder.has(order)) order = "creado_en";
  sort = String(sort).toUpperCase() === "ASC" ? "ASC" : "DESC";

  const where = [];
  const params = [];

  if (q) {
    where.push(
      `(p.titulo LIKE ? OR p.descripcion LIKE ? OR e.nombre LIKE ? OR a.nombre LIKE ? OR ev.nombre LIKE ? OR c.nombre LIKE ?)`
    );
    const like = `%${q}%`;
    params.push(like, like, like, like, like, like);
  }

  if (programa) { where.push(`p.programa = ?`); params.push(programa); }
  if (opcion_grado) { where.push(`p.opcion_grado = ?`); params.push(opcion_grado); }
  if (estado) { where.push(`p.estado = ?`); params.push(estado); }
  if (convocatoria_id) { where.push(`p.convocatoria_id = ?`); params.push(convocatoria_id); }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const baseFrom = `
    FROM proyectos p
    LEFT JOIN usuarios e  ON e.id  = p.estudiante_id
    LEFT JOIN usuarios c  ON c.id  = p.colaborador_id
    LEFT JOIN usuarios a  ON a.id  = p.asesor_id
    LEFT JOIN usuarios ev ON ev.id = p.evaluador_id
    LEFT JOIN convocatorias cv ON cv.id = p.convocatoria_id
  `;

  const sqlList = `
    SELECT
      p.id, p.titulo, p.descripcion, p.programa, p.opcion_grado, p.estado,
      p.creado_en, p.archivo_path, p.archivo_nombre,
      e.nombre  AS estudiante_nombre,
      c.nombre  AS colaborador_nombre,
      a.nombre  AS asesor_nombre,
      ev.nombre AS evaluador_nombre,
      cv.nombre AS convocatoria_nombre
    ${baseFrom}
    ${whereSql}
    ORDER BY p.${order} ${sort}
    LIMIT ? OFFSET ?;
  `;

  const sqlCount = `
    SELECT COUNT(*) AS totalRows
    ${baseFrom}
    ${whereSql};
  `;

  connection.query(sqlCount, params, (err, countRows) => {
    if (err) {
      console.error("Count error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Error contando proyectos" }));
    }

    const totalRows = Number(countRows?.[0]?.totalRows || 0);

    connection.query(sqlList, [...params, pageSize, offset], (lErr, items) => {
      if (lErr) {
        console.error("List error:", lErr);
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Error listando proyectos" }));
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ items, page, pageSize, totalRows }));
    });
  });
}

export function exportCoordinatorProjects(req, res, query) {
  let {
    q, programa, opcion_grado, estado, convocatoria_id,
    order = "creado_en", sort = "DESC"
  } = query || {};

  const allowedOrder = new Set(["creado_en", "titulo", "programa", "estado"]);
  if (!allowedOrder.has(order)) order = "creado_en";
  sort = String(sort).toUpperCase() === "ASC" ? "ASC" : "DESC";

  const where = [];
  const params = [];

  if (q) {
    where.push(
      `(p.titulo LIKE ? OR p.descripcion LIKE ? OR e.nombre LIKE ? OR a.nombre LIKE ? OR ev.nombre LIKE ? OR c.nombre LIKE ?)`
    );
    const like = `%${q}%`;
    params.push(like, like, like, like, like, like);
  }

  if (programa) { where.push(`p.programa = ?`); params.push(programa); }
  if (opcion_grado) { where.push(`p.opcion_grado = ?`); params.push(opcion_grado); }
  if (estado) { where.push(`p.estado = ?`); params.push(estado); }
  if (convocatoria_id) { where.push(`p.convocatoria_id = ?`); params.push(convocatoria_id); }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const sql = `
    SELECT
      p.id, p.titulo, p.programa, p.opcion_grado, p.estado, p.creado_en,
      e.nombre  AS estudiante_nombre,
      c.nombre  AS colaborador_nombre,
      a.nombre  AS asesor_nombre,
      ev.nombre AS evaluador_nombre,
      cv.nombre AS convocatoria_nombre
    FROM proyectos p
    LEFT JOIN usuarios e  ON e.id  = p.estudiante_id
    LEFT JOIN usuarios c  ON c.id  = p.colaborador_id
    LEFT JOIN usuarios a  ON a.id  = p.asesor_id
    LEFT JOIN usuarios ev ON ev.id = p.evaluador_id
    LEFT JOIN convocatorias cv ON cv.id = p.convocatoria_id
    ${whereSql}
    ORDER BY p.${order} ${sort};
  `;

  connection.query(sql, params, (err, rows) => {
    if (err) {
      console.error("Export error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Error exportando CSV" }));
    }

    const header = [
      "id","titulo","programa","opcion_grado","estado","creado_en",
      "estudiante","colaborador","asesor","evaluador","convocatoria"
    ];
    const lines = [header.join(",")];

    for (const r of rows) {
      const row = [
        r.id,
        safeCSV(r.titulo),
        safeCSV(r.programa),
        safeCSV(r.opcion_grado),
        safeCSV(r.estado),
        r.creado_en ? new Date(r.creado_en).toISOString() : "",
        safeCSV(r.estudiante_nombre),
        safeCSV(r.colaborador_nombre),
        safeCSV(r.asesor_nombre),
        safeCSV(r.evaluador_nombre),
        safeCSV(r.convocatoria_nombre),
      ];
      lines.push(row.join(","));
    }

    const csv = lines.join("\n");
    res.writeHead(200, {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="proyectos_${Date.now()}.csv"`
    });
    return res.end(csv);
  });
}

function safeCSV(v) {
  if (v == null) return "";
  const s = String(v).replace(/"/g, '""');
  return `"${s}"`;
}

export function listAsesores(req, res, query) {
  const { q } = query || {};
  const where = [`u.rol = 'asesor'`, `u.activo = 1`];
  const params = [];

  if (q) {
    where.push(`(u.nombre LIKE ? OR u.correo LIKE ?)`); 
    const like = `%${q}%`;
    params.push(like, like);
  }

  const sql = `
    SELECT u.id, u.nombre, u.correo
    FROM usuarios u
    WHERE ${where.join(" AND ")}
    ORDER BY u.nombre ASC
    LIMIT 100;
  `;

  connection.query(sql, params, (err, rows) => {
    if (err) {
      console.error("listAsesores:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Error listando asesores" }));
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(rows));
  });
}

export function listProyectosSinAsesor(req, res, query) {
  const { q } = query || {};
  const where = [`p.asesor_id IS NULL`];
  const params = [];

  if (q) {
    where.push(`(p.titulo LIKE ? OR e.nombre LIKE ?)`); 
    const like = `%${q}%`;
    params.push(like, like);
  }

  const sql = `
    SELECT
      p.id, p.titulo,
      e.nombre AS estudiante_nombre
    FROM proyectos p
    LEFT JOIN usuarios e ON e.id = p.estudiante_id
    WHERE ${where.join(" AND ")}
    ORDER BY p.creado_en DESC
    LIMIT 200;
  `;

  connection.query(sql, params, (err, rows) => {
    if (err) {
      console.error("listProyectosSinAsesor:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Error listando proyectos" }));
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(rows));
  });
}

export function asignarAsesorController(req, res) {
  let body = "";

  req.on("data", chunk => body += chunk);
  req.on("end", () => {
    try {
      const data = JSON.parse(body || "{}");

      const proyecto_id = Number(data.proyecto_id);
      const asesor_id = Number(data.asesor_id);
      const comentarios = data.comentarios?.trim() || null;

      if (!proyecto_id || !asesor_id) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Faltan proyecto_id o asesor_id" }));
      }

      const sqlCheck = `
        SELECT
          (SELECT COUNT(*) FROM proyectos WHERE id = ?) AS okProyecto,
          (SELECT COUNT(*) FROM usuarios WHERE id = ? AND rol='asesor' AND activo=1) AS okAsesor
      `;

      connection.query(sqlCheck, [proyecto_id, asesor_id], (cErr, rows) => {
        if (cErr) {
          console.error("asignarAsesor/check:", cErr);
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Error validando datos" }));
        }

        const r = rows?.[0] || {};
        if (!r.okProyecto || !r.okAsesor) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Proyecto o asesor inválido" }));
        }

        const sqlUpd = `UPDATE proyectos SET asesor_id = ? WHERE id = ?`;

        connection.query(sqlUpd, [asesor_id, proyecto_id], (uErr) => {
          if (uErr) {
            console.error("asignarAsesor/update:", uErr);
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Error asignando asesor" }));
          }

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Asesor asignado" }));
        });
      });

    } catch (e) {
      console.error("asignarAsesor/parse:", e);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Body inválido" }));
    }
  });
}

export function listEvaluadores(req, res, query) {
  const { q } = query || {};
  const where = [`u.rol = 'evaluador'`, `u.activo = 1`];
  const params = [];

  if (q) {
    where.push(`(u.nombre LIKE ? OR u.correo LIKE ?)`); 
    const like = `%${q}%`;
    params.push(like, like);
  }

  const sql = `
    SELECT u.id, u.nombre, u.correo
    FROM usuarios u
    WHERE ${where.join(" AND ")}
    ORDER BY u.nombre ASC
    LIMIT 100;
  `;

  connection.query(sql, params, (err, rows) => {
    if (err) {
      console.error("listEvaluadores:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Error listando evaluadores" }));
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(rows));
  });
}

export function listProyectosSinEvaluador(req, res, query) {
  const { q } = query || {};
  const where = [`p.evaluador_id IS NULL`];
  const params = [];

  if (q) {
    where.push(`(p.titulo LIKE ? OR e.nombre LIKE ?)`); 
    const like = `%${q}%`;
    params.push(like, like);
  }

  const sql = `
    SELECT
      p.id, p.titulo,
      e.nombre AS estudiante_nombre
    FROM proyectos p
    LEFT JOIN usuarios e ON e.id = p.estudiante_id
    WHERE ${where.join(" AND ")}
    ORDER BY p.creado_en DESC
    LIMIT 200;
  `;

  connection.query(sql, params, (err, rows) => {
    if (err) {
      console.error("listProyectosSinEvaluador:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Error listando proyectos sin evaluador" }));
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(rows));
  });
}

export function asignarEvaluadorController(req, res) {
  let body = "";

  req.on("data", chunk => body += chunk);
  req.on("end", () => {
    try {
      const data = JSON.parse(body || "{}");

      const proyecto_id = Number(data.proyecto_id);
      const evaluador_id = Number(data.evaluador_id);
      const comentarios = data.comentarios?.trim() || null;

      if (!proyecto_id || !evaluador_id) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Faltan proyecto_id o evaluador_id" }));
      }

      const sqlCheck = `
        SELECT
          (SELECT COUNT(*) FROM proyectos WHERE id = ?) AS okProyecto,
          (SELECT COUNT(*) FROM usuarios WHERE id = ? AND rol='evaluador' AND activo=1) AS okEvaluador
      `;

      connection.query(sqlCheck, [proyecto_id, evaluador_id], (cErr, rows) => {
        if (cErr) {
          console.error("❌ asignarEvaluador/check:", cErr);
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Error validando datos" }));
        }

        const r = rows?.[0] || {};
        if (!r.okProyecto || !r.okEvaluador) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Proyecto o evaluador inválido" }));
        }

        const sqlUpd = `UPDATE proyectos SET evaluador_id = ? WHERE id = ?`;

        connection.query(sqlUpd, [evaluador_id, proyecto_id], (uErr) => {
          if (uErr) {
            console.error("asignarEvaluador/update:", uErr);
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Error asignando evaluador" }));
          }

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Evaluador asignado" }));
        });
      });

    } catch (e) {
      console.error("asignarEvaluador/parse:", e);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Body inválido" }));
    }
  });
}
