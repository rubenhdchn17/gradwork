import jwt from "jsonwebtoken";
import { crearEvaluacion, obtenerEvaluacionPorProyecto } from "../controllers/evaluaciones.js";

const JWT_SECRET = "clave-super-secreta";

function getAuthUser(req, res) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Token no proporcionado." }));
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { id: decoded.id, correo: decoded.correo, rol: decoded.rol };
  } catch (err) {
    console.error("Token inválido:", err.message);
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Token inválido o expirado." }));
    return null;
  }
}

export function handleEvaluacionesRoutes(req, res, pathname) {
  if (req.method === "POST" && pathname === "/api/evaluaciones") {
    const authUser = getAuthUser(req, res);
    if (!authUser) return true;
    crearEvaluacion(req, res, authUser);
    return true;
  }

  const matchGet = pathname.match(/^\/api\/evaluaciones\/(\d+)$/);
  if (req.method === "GET" && matchGet) {
    const proyectoId = matchGet[1];
    const authUser = getAuthUser(req, res);
    if (!authUser) return true;
    obtenerEvaluacionPorProyecto(req, res, authUser, proyectoId);
    return true;
  }

  return false;
}
