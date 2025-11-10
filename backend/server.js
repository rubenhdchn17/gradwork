import http from "http";
import url from "url";
import * as Usuarios from "./controllers/usuarios.js";
import * as Auth from "./controllers/authController.js";
import { proyectosRouter } from "./routes/proyectosRoutes.js";
import { coordinatorRouter } from "./routes/coordinatorRoutes.js";


process.on("uncaughtException", (err) => {
  console.error("uncaughtException:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("unhandledRejection:", err);
});


const PORT = 3000;

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
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

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

  if (proyectosRouter(req, res, pathname, method)) {
    return;
  }

if (coordinatorRouter(req, res, pathname, method, query)) {
  return;
}

  sendResponse(res, 404, { error: "Ruta no encontrada" });
}

const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`Servidor GradWork corriendo en http://localhost:${PORT}`);
});
