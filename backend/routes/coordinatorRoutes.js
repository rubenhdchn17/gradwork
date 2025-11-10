import {
  getCoordinatorStats,
  listCoordinatorProjects,
  exportCoordinatorProjects,
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

  return false;
}
