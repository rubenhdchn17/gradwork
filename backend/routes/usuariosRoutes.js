import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  buscarUsuarioPorCorreo
} from "../controllers/usuarios.js";

export function usuariosRouter(req, res, pathname, method, query) {

  if (pathname === "/api/usuarios" && method === "GET") {
    getUsuarios(req, res);
    return true;
  }

  if (pathname === "/api/usuarios/buscar" && method === "GET") {
    buscarUsuarioPorCorreo(req, res, query);
    return true;
  }

  if (pathname === "/api/usuarios" && method === "POST") {
    createUsuario(req, res);
    return true;
  }

  if (pathname === "/api/usuarios" && method === "PUT") {
    updateUsuario(req, res);
    return true;
  }

  if (pathname === "/api/usuarios" && method === "DELETE") {
    deleteUsuario(req, res, query);
    return true;
  }

  return false;
}
