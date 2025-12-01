import connection from "../db.js";

export function crearEvaluacion(req, res, authUser) {
  if (authUser.rol !== "evaluador") {
    res.writeHead(403, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({ error: "Solo los evaluadores pueden evaluar proyectos." })
    );
  }

  let body = "";
  req.on("data", (chunk) => (body += chunk.toString()));
  req.on("end", () => {
    try {
      const data = JSON.parse(body || "{}");
      const {
        proyecto_id,
        claridad,
        metodologia,
        originalidad,
        veredicto = "aprobado_con_modificaciones",
        comentarios = null,
      } = data;

      if (!proyecto_id || !claridad || !metodologia || !originalidad) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({
            error:
              "proyecto_id, claridad, metodologia y originalidad son obligatorios.",
          })
        );
      }

      const proyectoIdNum = Number(proyecto_id);
      const c = Number(claridad);
      const m = Number(metodologia);
      const o = Number(originalidad);

      if (
        !Number.isFinite(proyectoIdNum) ||
        !Number.isFinite(c) ||
        !Number.isFinite(m) ||
        !Number.isFinite(o)
      ) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({ error: "Los criterios deben ser numéricos." })
        );
      }

      const proyectoSql = `
        SELECT id, evaluador_id
        FROM proyectos
        WHERE id = ?
      `;

      connection.query(
        proyectoSql,
        [proyectoIdNum],
        (projErr, proyectos) => {
          if (projErr) {
            console.error("Error consultando proyecto:", projErr);
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(
              JSON.stringify({ error: "Error consultando el proyecto." })
            );
          }

          if (proyectos.length === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            return res.end(
              JSON.stringify({ error: "Proyecto no encontrado." })
            );
          }

          const proyecto = proyectos[0];

          if (proyecto.evaluador_id !== authUser.id) {
            res.writeHead(403, { "Content-Type": "application/json" });
            return res.end(
              JSON.stringify({
                error: "No estás asignado como evaluador de este proyecto.",
              })
            );
          }

          const checkSql = `
            SELECT id
            FROM evaluaciones
            WHERE proyecto_id = ? AND evaluador_id = ?
            LIMIT 1
          `;

          connection.query(
            checkSql,
            [proyectoIdNum, authUser.id],
            (chkErr, rows) => {
              if (chkErr) {
                console.error(
                  "Error verificando evaluación existente:",
                  chkErr
                );
                res.writeHead(500, { "Content-Type": "application/json" });
                return res.end(
                  JSON.stringify({
                    error: "Error verificando evaluación previa.",
                  })
                );
              }

              const promedio = (c + m + o) / 3;

              if (rows.length > 0) {
                const updateEvalSql = `
                  UPDATE evaluaciones
                  SET criterio_claridad = ?, 
                      criterio_metodologia = ?, 
                      criterio_originalidad = ?, 
                      veredicto = ?, 
                      comentarios = ?, 
                      promedio = ?, 
                      fecha = NOW()
                  WHERE id = ?
                `;

                connection.query(
                  updateEvalSql,
                  [c, m, o, veredicto, comentarios, promedio, rows[0].id],
                  (updErr) => {
                    if (updErr) {
                      console.error("Error actualizando evaluación:", updErr);
                      res.writeHead(500, { "Content-Type": "application/json" });
                      return res.end(
                        JSON.stringify({
                          error: "Error actualizando la evaluación.",
                        })
                      );
                    }

                    const updateProjectSql = `
                      UPDATE proyectos
                      SET estado = 'aprobado',
                          calificacion_final = ?,
                          fecha_evaluacion = NOW()
                      WHERE id = ?
                    `;

                    connection.query(
                      updateProjectSql,
                      [promedio, proyectoIdNum],
                      (projErr) => {
                        if (projErr) {
                          console.error("Error act. proyecto:", projErr);
                          res.writeHead(500, {
                            "Content-Type": "application/json",
                          });
                          return res.end(
                            JSON.stringify({
                              error:
                                "Evaluación actualizada, pero error en proyecto.",
                            })
                          );
                        }

                        res.writeHead(200, {
                          "Content-Type": "application/json",
                        });
                        return res.end(
                          JSON.stringify({
                            message: "Evaluación actualizada correctamente.",
                            evaluacion_id: rows[0].id,
                          })
                        );
                      }
                    );
                  }
                );

                return;
              }

              const insertSql = `
                INSERT INTO evaluaciones
                  (proyecto_id, evaluador_id,
                   criterio_claridad, criterio_metodologia, criterio_originalidad,
                   veredicto, comentarios, promedio)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
              `;

              const params = [
                proyectoIdNum,
                authUser.id,
                c,
                m,
                o,
                veredicto,
                comentarios,
                promedio,
              ];

              connection.query(insertSql, params, (insErr, result) => {
                if (insErr) {
                  console.error("Error insertando evaluación:", insErr);
                  res.writeHead(500, { "Content-Type": "application/json" });
                  return res.end(
                    JSON.stringify({
                      error: "Error guardando la evaluación.",
                    })
                  );
                }

                const updateProjectSql = `
                  UPDATE proyectos
                  SET estado = 'aprobado',
                      calificacion_final = ?,
                      fecha_evaluacion = NOW()
                  WHERE id = ?
                `;

                connection.query(
                  updateProjectSql,
                  [promedio, proyectoIdNum],
                  (updErr) => {
                    if (updErr) {
                      console.error(
                        "Error actualizando estado del proyecto:",
                        updErr
                      );
                      res.writeHead(500, {
                        "Content-Type": "application/json",
                      });
                      return res.end(
                        JSON.stringify({
                          error:
                            "Evaluación creada, pero error actualizando el proyecto.",
                        })
                      );
                    }

                    res.writeHead(201, {
                      "Content-Type": "application/json",
                    });
                    res.end(
                      JSON.stringify({
                        message: "Evaluación registrada correctamente.",
                        evaluacion_id: result.insertId,
                      })
                    );
                  }
                );
              });
            }
          );
        }
      );
    } catch (parseErr) {
      console.error("Error parseando body en crearEvaluacion:", parseErr);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Cuerpo de petición inválido." }));
    }
  });
}

export function obtenerEvaluacionPorProyecto(
  req,
  res,
  authUser,
  proyectoId
) {
  if (authUser.rol !== "evaluador") {
    res.writeHead(403, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({
        error:
          "Solo los evaluadores pueden consultar sus evaluaciones.",
      })
    );
  }

  const proyectoIdNum = Number(proyectoId);
  if (!Number.isFinite(proyectoIdNum)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "ID de proyecto inválido." }));
  }

  const sql = `
    SELECT
      id,
      proyecto_id,
      evaluador_id,
      criterio_claridad,
      criterio_metodologia,
      criterio_originalidad,
      promedio,
      veredicto,
      comentarios,
      fecha
    FROM evaluaciones
    WHERE proyecto_id = ? AND evaluador_id = ?
    LIMIT 1
  `;

  connection.query(sql, [proyectoIdNum, authUser.id], (err, rows) => {
    if (err) {
      console.error("Error consultando evaluación:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ error: "Error consultando evaluación." })
      );
    }

    if (rows.length === 0) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({
          error: "No hay evaluación registrada para este proyecto.",
        })
      );
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(rows[0]));
  });
}
