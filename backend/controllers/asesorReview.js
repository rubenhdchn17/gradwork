import connection from "../db.js";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export function getAdvisorProjectById(req, res, authUser, proyectoId) {
  if (authUser.rol !== "asesor") {
    res.writeHead(403, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Acceso no autorizado" }));
  }

  const sql = `
    SELECT 
      p.id,
      p.titulo,
      p.descripcion,
      p.estado,
      p.archivo_path,
      p.archivo_nombre,
      u.nombre AS estudiante,
      c.nombre AS colaborador
    FROM proyectos p
    LEFT JOIN usuarios u ON u.id = p.estudiante_id
    LEFT JOIN usuarios c ON c.id = p.colaborador_id
    WHERE p.id = ? AND p.asesor_id = ?
    LIMIT 1
  `;

  connection.query(sql, [proyectoId, authUser.id], (err, rows) => {
    if (err) {
      console.error("Error consultando proyecto:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Error consultando proyecto" }));
    }

    if (rows.length === 0) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Proyecto no encontrado" }));
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(rows[0]));
  });
}

export function saveAdvisorObservation(req, res, authUser, proyectoId) {
  if (authUser.rol !== "asesor") {
    res.writeHead(403, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Acceso no autorizado" }));
  }

  const uploadsDir = path.resolve("./uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const form = formidable({
    uploadDir: uploadsDir,
    keepExtensions: true,
    multiples: false,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("❌ Error parseando formulario:", err);
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Formulario inválido" }));
    }

    const comentarios = fields.comentarios?.toString().trim() || null;
    const archivo = files.archivo;

    let newFilePath = null;
    let newFileName = null;
    let newMime = null;
    let newSize = null;

    const processAfterFile = () => {
      const sql = `
        UPDATE proyectos 
        SET 
          observaciones_asesor = ?, 
          archivo_nombre = COALESCE(?, archivo_nombre),
          archivo_mime = COALESCE(?, archivo_mime),
          archivo_tamano = COALESCE(?, archivo_tamano),
          archivo_path = COALESCE(?, archivo_path),
          estado = 'en_revision'
        WHERE id = ? AND asesor_id = ?
      `;

      connection.query(
        sql,
        [
          comentarios,
          newFileName,
          newMime,
          newSize,
          newFilePath,
          proyectoId,
          authUser.id,
        ],
        (updErr) => {
          if (updErr) {
            console.error("❌ Error actualizando proyecto:", updErr);
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(
              JSON.stringify({ error: "Error guardando observación" })
            );
          }

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Observación guardada con éxito" }));
        }
      );
    };

    if (!archivo) return processAfterFile();

    connection.query(
      "SELECT archivo_path FROM proyectos WHERE id = ?",
      [proyectoId],
      (err2, rows) => {
        if (err2) {
          console.error("Error consultando archivo previo:", err2);
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Error interno" }));
        }

        const prevPath = rows[0]?.archivo_path;

        const ext = path.extname(archivo.originalFilename);
        const safeName = `asesor_${Date.now()}${ext}`;
        const finalPath = path.join(uploadsDir, safeName);

        fs.renameSync(archivo.filepath, finalPath);

        newFilePath = `/uploads/${safeName}`;
        newFileName = archivo.originalFilename;
        newMime = archivo.mimetype;
        newSize = archivo.size;

        if (prevPath && fs.existsSync("." + prevPath)) {
          try {
            fs.unlinkSync("." + prevPath);
          } catch {}
        }

        processAfterFile();
      }
    );
  });
}
