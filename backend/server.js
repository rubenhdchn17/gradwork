import http from "http";
import url from "url";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import * as Usuarios from "./controllers/usuarios.js";
import * as Auth from "./controllers/authController.js";
import { proyectosRouter } from "./routes/proyectosRoutes.js";
import { coordinatorRouter } from "./routes/coordinatorRoutes.js";
import { evaluadorRouter } from "./routes/evaluadorRoutes.js";
import { handleEvaluacionesRoutes } from "./routes/evaluacionesRoutes.js";
import { asesorRouter } from "./routes/asesorRoutes.js";

process.on("uncaughtException", (err) => {
  console.error("uncaughtException:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("unhandledRejection:", err);
});

const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function serveStaticUploads(req, res) {
  if (!req.url.startsWith("/uploads/")) return false;

  const filePath = path.join(__dirname, req.url);

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Archivo no encontrado" }));
    return true;
  }

  const stream = fs.createReadStream(filePath);
  res.writeHead(200);
  stream.pipe(res);
  return true;
}

function sendResponse(res, status, data, contentType = "application/json") {
  res.writeHead(status, { "Content-Type": contentType });
  res.end(contentType === "application/json" ? JSON.stringify(data) : data);
}

function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  let { pathname, query } = parsedUrl;
  const method = req.method;

  pathname = decodeURIComponent(pathname.trim());

  console.log(`Petición recibida: ${method} ${pathname}`);
  console.log("RAW PATHNAME =", JSON.stringify(pathname));

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (serveStaticUploads(req, res)) return;

  if (pathname === "/api/register" && method === "POST") {
    Auth.register(req, res);
    return;
  }

  if (pathname === "/api/login" && method === "POST") {
    Auth.login(req, res);
    return;
  }

  if (pathname === "/api/usuarios" && method === "GET") {
    Usuarios.getUsuarios(req, res);
    return;
  }

  if (pathname === "/api/usuarios/buscar" && method === "GET") {
    Usuarios.buscarUsuarioPorCorreo(req, res, query);
    return;
  }

  if (pathname === "/api/usuarios" && method === "POST") {
    Usuarios.createUsuario(req, res);
    return;
  }

  if (pathname === "/api/usuarios" && method === "PUT") {
    Usuarios.updateUsuario(req, res);
    return;
  }

  if (pathname === "/api/usuarios" && method === "DELETE") {
    Usuarios.deleteUsuario(req, res, query);
    return;
  }

  if (proyectosRouter(req, res, pathname, method)) return;

  if (coordinatorRouter(req, res, pathname, method, query)) return;

  if (evaluadorRouter(req, res, pathname, method)) return;
  
  if (asesorRouter(req, res, pathname, method)) return;

  if (handleEvaluacionesRoutes(req, res, pathname)) return;

  sendResponse(res, 404, { error: "Ruta no encontrada" });
}

const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`Servidor GradWork corriendo en http://localhost:${PORT}`);
});
