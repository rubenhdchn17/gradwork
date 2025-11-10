import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProposal from "./pages/student/StudentProposal";
import StudentProjects from "./pages/student/StudentProjects";
import AdvisorDashboard from "./pages/advisor/AdvisorDashboard";
import AssignAdvisor from "./pages/coordinator/AssignAdvisor.jsx";
import EvaluatorDashboard from "./pages/evaluator/EvaluatorDashboard";
import EvaluatorProjects from "./pages/evaluator/EvaluatorProjects";
import EvaluatorReview from "./pages/evaluator/EvaluatorReview";
import CoordinatorDashboard from "./pages/coordinator/CoordinatorDashboard";
import AssignEvaluator from "./pages/coordinator/AssignEvaluator";
import AnteprojectRegister from "./pages/coordinator/AnteprojectRegister";
import AssignedProjects from "./pages/coordinator/AssignedProjects";
import ProjectReview from "./pages/coordinator/ProjectReview";
import ProtectedRoute from "./components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Estudiante */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["estudiante"]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="propuesta" element={<StudentProposal />} />
        <Route path="mis-proyectos" element={<StudentProjects />} />
      </Route>

      {/* Asesor */}
      <Route
        path="/advisor"
        element={
          <ProtectedRoute allowedRoles={["asesor"]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdvisorDashboard />} />
        <Route path="asignar" element={<AssignAdvisor />} />
      </Route>

      {/* Evaluador */}
      <Route
        path="/evaluator"
        element={
          <ProtectedRoute allowedRoles={["evaluador"]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<EvaluatorDashboard />} />
        <Route path="proyectos" element={<EvaluatorProjects />} />
        <Route path="evaluar" element={<EvaluatorReview />} />
      </Route>

      {/* Coordinador */}
      <Route
        path="/coordinator"
        element={
          <ProtectedRoute allowedRoles={["coordinador"]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<CoordinatorDashboard />} />
        <Route path="asignar" element={<AssignAdvisor />} />
        <Route path="asignar-evaluador" element={<AssignEvaluator />} />
        <Route path="anteproyecto" element={<AnteprojectRegister />} />
        <Route path="proyectos" element={<AssignedProjects />} />
        <Route path="proyecto/:id" element={<ProjectReview />} />
      </Route>


      {/* Redirección por defecto */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<h1>Página no encontrada</h1>} />
    </Routes>
  );
}
