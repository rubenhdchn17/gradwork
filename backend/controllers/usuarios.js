import connection from "../db.js";

export function getUsuarios(req, res) {
  connection.query("SELECT * FROM usuarios", (err, results) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Error al consultar usuarios" }));
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(results));
  });
}

export function buscarUsuarioPorCorreo(req, res, query) {
  const correo = query.correo;

  if (!correo) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Debes enviar un correo" }));
  }

  const sql = "SELECT id, nombre, correo, rol FROM usuarios WHERE correo = ?";
  connection.query(sql, [correo], (err, results) => {
    if (err) {
      console.error("Error SQL en búsqueda de colaborador:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Error en la búsqueda" }));
    }

    if (results.length === 0) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "No existe un usuario con ese correo" }));
    }

    const user = results[0];

    if (user.rol !== "estudiante") {
      res.writeHead(403, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "El usuario no es un estudiante" }));
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
  });
}

// Crear usuario
export function createUsuario(req, res) {
  let body = "";
  req.on("data", (chunk) => (body += chunk.toString()));
  req.on("end", () => {
    try {
      const { nombre, correo } = JSON.parse(body);
      if (!nombre || !correo) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Faltan campos requeridos" }));
      }

      const sql = "INSERT INTO usuarios (nombre, correo) VALUES (?, ?)";
      connection.query(sql, [nombre, correo], (err, result) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Error al crear usuario" }));
        }

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Usuario creado", id: result.insertId }));
      });
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "JSON inválido" }));
    }
  });
}

export function updateUsuario(req, res) {
  let body = "";
  req.on("data", (chunk) => (body += chunk.toString()));
  req.on("end", () => {
    try {
      const { id, nombre, correo } = JSON.parse(body);
      if (!id || !nombre || !correo) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Faltan campos requeridos" }));
      }

      const sql = "UPDATE usuarios SET nombre = ?, correo = ? WHERE id = ?";
      connection.query(sql, [nombre, correo, id], (err) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Error al actualizar usuario" }));
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Usuario actualizado correctamente" }));
      });
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "JSON inválido" }));
    }
  });
}

export function deleteUsuario(req, res, query) {
  const id = query.id;
  if (!id) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Falta el parámetro id" }));
  }

  const sql = "DELETE FROM usuarios WHERE id = ?";
  connection.query(sql, [id], (err) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Error al eliminar usuario" }));
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Usuario eliminado correctamente" }));
  });
}
