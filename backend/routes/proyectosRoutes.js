import {
  getDashboardInfo,
  crearPropuesta,
  getProyectosPorEstudiante,
  actualizarArchivo,
  getProyectoPorId
} from "../controllers/proyectos.js";

export function proyectosRouter(req, res, pathname, method) {

  const dashboardRegex = /^\/api\/proyectos\/dashboard\/(\d+)(?:\/.*)?$/;
  const dashMatch = pathname.match(dashboardRegex);
  if (dashMatch && method === "GET") {
    getDashboardInfo(req, res, dashMatch[1]);
    return true;
  }

  const misProyectosRegex = /^\/api\/proyectos\/mis-proyectos\/(\d+)(?:\/.*)?$/;
  const projMatch = pathname.match(misProyectosRegex);
  if (projMatch && method === "GET") {
    getProyectosPorEstudiante(req, res, projMatch[1]);
    return true;
  }

  if (pathname === "/api/proyectos/propuesta" && method === "POST") {
    crearPropuesta(req, res);
    return true;
  }

  const actualizarArchivoRegex = /^\/api\/proyectos\/actualizar-archivo\/(\d+)$/;
  const updMatch = pathname.match(actualizarArchivoRegex);
  if (updMatch && method === "PUT") {
    actualizarArchivo(req, res, updMatch[1]);
    return true;
  }

  const singleRegex = /^\/api\/proyectos\/(\d+)$/;
  const singleMatch = pathname.match(singleRegex);
  if (singleMatch && method === "GET") {
    getProyectoPorId(req, res, singleMatch[1]);
    return true;
  }


  return false;
}
