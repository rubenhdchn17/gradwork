import {
  getCoordinatorStats,
  listCoordinatorProjects,
  exportCoordinatorProjects,
  listAsesores,
  listProyectosSinAsesor,
  asignarAsesorController,
  listEvaluadores,
  listProyectosSinEvaluador,
  asignarEvaluadorController
} from "../controllers/coordinator.js";

export function coordinatorRouter(req, res, pathname, method, query) {
  if (pathname === "/api/coordinator/stats" && method === "GET") {
    getCoordinatorStats(req, res, query);
    return true;
  }

  if (pathname === "/api/coordinator/projects" && method === "GET") {
    listCoordinatorProjects(req, res, query);
    return true;
  }

  if (pathname === "/api/coordinator/projects/export" && method === "GET") {
    exportCoordinatorProjects(req, res, query);
    return true;
  }

  if (pathname === "/api/coordinator/asesores" && method === "GET") {
    listAsesores(req, res, query);
    return true;
  }

  if (pathname === "/api/coordinator/proyectos-sin-asesor" && method === "GET") {
    listProyectosSinAsesor(req, res, query);
    return true;
  }

  if (pathname === "/api/coordinator/asignar-asesor" && method === "POST") {
    asignarAsesorController(req, res);
    return true;
  }

if (pathname === "/api/coordinator/evaluadores" && method === "GET") {
  listEvaluadores(req, res, query);
  return true;
}

if (pathname === "/api/coordinator/proyectos-sin-evaluador" && method === "GET") {
  listProyectosSinEvaluador(req, res, query);
  return true;
}

if (pathname === "/api/coordinator/asignar-evaluador" && method === "POST") {
  asignarEvaluadorController(req, res);
  return true;
}


  return false;
}

