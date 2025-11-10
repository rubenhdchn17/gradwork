import connection from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = "clave-super-secreta";

export function register(req, res) {
  let body = "";
  req.on("data", (chunk) => (body += chunk.toString()));
  req.on("end", async () => {
    try {
      const { nombre, correo, contrasena, rol } = JSON.parse(body);
      console.log("Datos recibidos en registro:", { nombre, correo, contrasena, rol });

      if (!nombre || !correo || !contrasena || !rol) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Todos los campos son obligatorios." }));
      }

      connection.query("SELECT * FROM usuarios WHERE correo = ?", [correo], async (err, results) => {
        if (err) {
          console.error("Error SQL al verificar usuario:", err);
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Error al verificar usuario." }));
        }

        if (results.length > 0) {
          console.warn("El correo ya está registrado:", correo);
          res.writeHead(409, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "El correo ya está registrado." }));
        }

        const hashedPassword = await bcrypt.hash(contrasena, 10);
        console.log("Contraseña encriptada:", hashedPassword);

        const sql = "INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)";
        connection.query(sql, [nombre, correo, hashedPassword, rol], (err) => {
          if (err) {
            console.error("Error SQL al registrar:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Error al registrar usuario." }));
          }

          console.log("Usuario registrado correctamente:", correo);
          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Usuario registrado correctamente." }));
        });
      });
    } catch (error) {
      console.error("❌ Error al registrar:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Datos inválidos." }));
    }
  });
}

export function login(req, res) {
  let body = "";
  req.on("data", (chunk) => (body += chunk.toString()));
  req.on("end", async () => {
    try {
      if (!body) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Cuerpo vacío en la petición." }));
      }

      const data = JSON.parse(body);
      console.log("Cuerpo recibido en login:", data);

      const { correo, contrasena } = data;
      console.log("Correo recibido:", correo);
      console.log("Contraseña recibida:", contrasena);

      if (!correo || !contrasena) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Correo y contraseña son requeridos." }));
      }

      connection.query("SELECT * FROM usuarios WHERE correo = ?", [correo], async (err, results) => {
        if (err) {
          console.error("Error SQL:", err);
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Error en la base de datos." }));
        }

        if (results.length === 0) {
          console.warn("Usuario no encontrado para correo:", correo);
          res.writeHead(404, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Usuario no encontrado." }));
        }

        const user = results[0];
        console.log("Usuario encontrado en BD:", user);

        const validPassword = await bcrypt.compare(contrasena, user.contrasena);
        console.log("Comparando contraseñas ->", {
          ingresada: contrasena,
          almacenada: user.contrasena,
          valid: validPassword,
        });

        if (!validPassword) {
          res.writeHead(401, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Contraseña incorrecta." }));
        }

        const token = jwt.sign(
          { id: user.id, correo: user.correo, rol: user.rol },
          JWT_SECRET,
          { expiresIn: "2h" }
        );

        console.log("Inicio de sesión exitoso para:", correo);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Inicio de sesión exitoso.",
            token,
            user: { id: user.id, nombre: user.nombre, rol: user.rol },
          })
        );
      });
    } catch (error) {
      console.error("Error inesperado en login:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Error inesperado en el servidor." }));
    }
  });
}
