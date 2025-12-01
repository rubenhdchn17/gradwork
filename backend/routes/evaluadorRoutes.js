import jwt from "jsonwebtoken";
import { getEvaluatorStats, getProyectosAsignados } from "../controllers/evaluador.js";

const JWT_SECRET = "clave-super-secreta";

function getAuthUser(req, res) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Token requerido" }));
    return null;
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    return { id: decoded.id, correo: decoded.correo, rol: decoded.rol };
  } catch (err) {
    console.error("Error verificando token:", err.message);
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Token inválido o expirado" }));
    return null;
  }
}

export function evaluadorRouter(req, res, pathname, method) {
  if (method === "GET" && pathname === "/api/evaluador/stats") {
    const authUser = getAuthUser(req, res);
    if (!authUser) return true;
    getEvaluatorStats(req, res, authUser);
    return true;
  }

  if (method === "GET" && pathname === "/api/evaluador/proyectos") {
    const authUser = getAuthUser(req, res);
    if (!authUser) return true;
    getProyectosAsignados(req, res, authUser);
    return true;
  }

  return false;
}
