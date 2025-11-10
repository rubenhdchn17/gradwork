import connection from "../db.js";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export function getDashboardInfo(req, res, userId) {
  const statsQuery = `
    SELECT
      SUM(estado = 'propuesta')  AS propuestas_enviadas,
      SUM(estado = 'aprobado')   AS proyectos_aprobados,
      SUM(estado = 'en_revision') AS en_revision
    FROM proyectos
    WHERE estudiante_id = ? OR colaborador_id = ?;
  `;

  console.log("Dashboard contando proyectos para user:", userId);

  connection.query(statsQuery, [userId, userId], (err, result) => {
    if (err) {
      console.error("❌ Error obteniendo estadísticas:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ error: "Error consultando estadísticas" })
      );
    }

    const stats = result?.[0] || {};

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({
        propuestas: Number(stats.propuestas_enviadas || 0),
        aprobados: Number(stats.proyectos_aprobados || 0),
        revision: Number(stats.en_revision || 0),
        notificaciones: []
      })
    );
  });
}

export function getProyectosPorEstudiante(req, res, userId) {
  console.log("🎯 getProyectosPorEstudiante():", userId);

  const sql = `
    SELECT 
      p.id,
      p.titulo,
      p.estado,
      p.creado_en,
      p.archivo_path,
      p.archivo_nombre,
      u.nombre AS asesor_nombre,
      (p.colaborador_id = ?) AS soy_colaborador
    FROM proyectos p
    LEFT JOIN usuarios u ON u.id = p.asesor_id
    WHERE p.estudiante_id = ? OR p.colaborador_id = ?
    ORDER BY p.creado_en DESC;
  `;

  connection.query(
    sql,
    [userId, userId, userId],
    (err, results) => {
      if (err) {
        console.error("Error obteniendo proyectos:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Error consultando proyectos" }));
      }

      console.log("Proyectos encontrados:", results.length);
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(results));
    }
  );
}

export function crearPropuesta(req, res) {
  const uploadsDir = path.resolve("./uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const form = formidable({
    uploadDir: uploadsDir,
    keepExtensions: true,
    multiples: false,
    allowEmptyFiles: true,
    minFileSize: 0,
    maxFileSize: 25 * 1024 * 1024,
    filter: ({ originalFilename }) => {
      return originalFilename && originalFilename.length > 0;
    }
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Error parseando formulario:", err);
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Formulario inválido" }));
    }

    const titulo = fields.titulo?.toString().trim();
    const descripcion = fields.descripcion?.toString().trim() || null;
    const programa = fields.programa?.toString().trim();
    const opcion_grado = fields.opcion_grado?.toString().trim();
    const estudiante_id = Number(fields.estudiante_id);
    const colaborador_id = fields.colaborador_id
      ? Number(fields.colaborador_id)
      : null;

    if (!titulo || !programa || !opcion_grado || !estudiante_id) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Faltan campos obligatorios" }));
    }

    const file = files?.archivo
      ? Array.isArray(files.archivo)
        ? files.archivo[0]
        : files.archivo
      : null;

    let archivo_nombre = null;
    let archivo_mime = null;
    let archivo_tamano = null;
    let archivo_path = null;

    if (file && file.size > 0) {
      const allowed = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];

      if (!allowed.includes(file.mimetype)) {
        fs.unlinkSync(file.filepath);
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({ error: "Formato no permitido. Usa PDF o DOCX." })
        );
      }

      const ext = path.extname(file.originalFilename);
      const safeName = `prop_${Date.now()}${ext}`;

      const finalPath = path.join(uploadsDir, safeName);
      fs.renameSync(file.filepath, finalPath);

      archivo_nombre = file.originalFilename;
      archivo_mime = file.mimetype;
      archivo_tamano = file.size;
      archivo_path = `/uploads/${safeName}`;
    }

    const sql = `
      INSERT INTO proyectos
        (titulo, programa, opcion_grado, descripcion,
         estudiante_id, colaborador_id, estado,
         archivo_nombre, archivo_mime, archivo_tamano, archivo_path)
      VALUES (?, ?, ?, ?, ?, ?, 'propuesta', ?, ?, ?, ?)
    `;

    const params = [
      titulo,
      programa,
      opcion_grado,
      descripcion,
      estudiante_id,
      colaborador_id,
      archivo_nombre,
      archivo_mime,
      archivo_tamano,
      archivo_path
    ];

    connection.query(sql, params, (qErr, result) => {
      if (qErr) {
        console.error("Error insertando propuesta:", qErr);
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({ error: "Error al guardar la propuesta" })
        );
      }

      res.writeHead(201, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ message: "Propuesta creada", id: result.insertId })
      );
    });
  });
}

export function actualizarArchivo(req, res, proyectoId) {
  console.log("📤 [actualizarArchivo] Iniciando actualización para ID:", proyectoId);

  const uploadsDir = path.resolve("./uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const form = formidable({
    uploadDir: uploadsDir,
    keepExtensions: true,
    multiples: false,
    allowEmptyFiles: false,
    maxFileSize: 25 * 1024 * 1024,
    filter: ({ mimetype }) => !!mimetype
  });

  console.log("[actualizarArchivo] Ejecutando form.parse...");

  form.parse(req, (err, fields, files) => {
    console.log("[actualizarArchivo] Form.parse callback ejecutado.");

    if (err) {
      console.error("❌ [actualizarArchivo] Error parseando actualización:", err);
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Error en el archivo enviado" }));
    }

    console.log("[actualizarArchivo] Fields recibidos:", fields);
    console.log("[actualizarArchivo] Files recibidos:", files);

    let file = files?.archivo;

    console.log("[actualizarArchivo] RAW file:", file);

    if (Array.isArray(file)) {
      console.log("[actualizarArchivo] Archivo venía en array, usando file[0]");
      file = file[0];
    }

    if (!file) {
      console.error("[actualizarArchivo] No se envió archivo 'archivo'");
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "No se envió archivo" }));
    }

    console.log("[actualizarArchivo] Archivo recibido:", file.originalFilename, file.mimetype);

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowed.includes(file.mimetype)) {
      console.error("[actualizarArchivo] Formato NO permitido:", file.mimetype);
      fs.unlinkSync(file.filepath);
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Formato no permitido" }));
    }

    console.log("[actualizarArchivo] Consultando archivo anterior...");

    connection.query(
      "SELECT archivo_path FROM proyectos WHERE id = ?",
      [proyectoId],
      (err, results) => {
        if (err) {
          console.error("[actualizarArchivo] Error consultando archivo previo:", err);
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Error consultando proyecto" }));
        }

        const prevPath = results[0]?.archivo_path;
        console.log("[actualizarArchivo] Archivo previo:", prevPath);

        const ext = path.extname(file.originalFilename);
        const safeName = `update_${Date.now()}${ext}`;
        const finalPath = path.join(uploadsDir, safeName);

        console.log("[actualizarArchivo] Moviendo archivo a:", finalPath);

        try {
          fs.renameSync(file.filepath, finalPath);
        } catch (moveErr) {
          console.error("[actualizarArchivo] Error moviendo archivo:", moveErr);
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Error guardando archivo" }));
        }

        const newFilePath = `/uploads/${safeName}`;

        console.log("[actualizarArchivo] Actualizando BD con ruta:", newFilePath);

        const updateSql = `
          UPDATE proyectos
          SET archivo_nombre = ?, archivo_mime = ?, archivo_tamano = ?, archivo_path = ?
          WHERE id = ?
        `;

        connection.query(
          updateSql,
          [file.originalFilename, file.mimetype, file.size, newFilePath, proyectoId],
          (updErr) => {
            if (updErr) {
              console.error("[actualizarArchivo] Error actualizando BD:", updErr);
              res.writeHead(500, { "Content-Type": "application/json" });
              return res.end(JSON.stringify({ error: "Error actualizando archivo" }));
            }

            console.log("[actualizarArchivo] Registro actualizado en BD.");

            if (prevPath) {
              const fullOld = path.resolve("." + prevPath);
              console.log("🗑 [actualizarArchivo] Intentando eliminar:", fullOld);

              try {
                if (fs.existsSync(fullOld)) {
                  fs.unlinkSync(fullOld);
                  console.log("[actualizarArchivo] Archivo anterior eliminado");
                } else {
                  console.log("[actualizarArchivo] El archivo anterior no existe en disco");
                }
              } catch (unlinkErr) {
                console.error("[actualizarArchivo] Error eliminando archivo anterior:", unlinkErr);
              }
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
              message: "Archivo actualizado correctamente",
              archivo_path: newFilePath
            }));
          }
        );
      }
    );
  });
}
