import jwt from "jsonwebtoken";
import { getAdvisorStats, getAdvisorProjects } from "../controllers/asesor.js";
import { getAdvisorProjectById, saveAdvisorObservation } from "../controllers/asesorReview.js";

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

export function asesorRouter(req, res, pathname, method) {

  if (pathname === "/api/asesor/stats" && method === "GET") {
    const authUser = getAuthUser(req, res);
    if (!authUser) return true;
    getAdvisorStats(req, res, authUser);
    return true;
  }

  if (pathname === "/api/asesor/proyectos" && method === "GET") {
    const authUser = getAuthUser(req, res);
    if (!authUser) return true;
    getAdvisorProjects(req, res, authUser);
    return true;
  }

if (pathname.match(/^\/api\/asesor\/proyecto\/\d+$/) && method === "GET") {
  const authUser = getAuthUser(req, res);
  if (!authUser) return true;

  const id = Number(pathname.split("/").pop());
  getAdvisorProjectById(req, res, authUser, id);
  return true;
}

if (pathname.match(/^\/api\/asesor\/observar\/\d+$/) && method === "POST") {
  const authUser = getAuthUser(req, res);
  if (!authUser) return true;

  const id = Number(pathname.split("/").pop());
  saveAdvisorObservation(req, res, authUser, id);
  return true;
}

  return false;
}
