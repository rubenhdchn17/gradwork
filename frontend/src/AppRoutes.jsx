import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import StudentProposal from "./pages/StudentProposal";
import AssignEvaluator from "./pages/AssignEvaluator";
import AssignAdvisor from "./pages/AssignAdvisor";
import EvaluatorReview from "./pages/EvaluatorReview";
import AnteprojectRegister from "./pages/AnteprojectRegister";
import CoordinatorDashboard from "./pages/CoordinatorDashboard";
import StudentProjects from "./pages/StudentProjects";
import AssignedProjects from "./pages/AssignedProjects";
import ProjectReview from "./pages/ProjectReview";
import EvaluatorProjects from "./pages/EvaluatorProjects";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<CoordinatorDashboard />} />
        <Route path="/propuesta" element={<StudentProposal />} />
        <Route path="/asignar-evaluador" element={<AssignEvaluator />} />
        <Route path="/asignar-asesor" element={<AssignAdvisor />} />
        <Route path="/evaluacion" element={<EvaluatorReview />} />
        <Route path="/anteproyecto" element={<AnteprojectRegister />} />
        <Route path="/mis-proyectos" element={<StudentProjects />} />
        <Route path="/proyectos-asignados" element={<AssignedProjects />} />
        <Route path="/proyecto/:id" element={<ProjectReview />} />
        <Route path="/evaluador" element={<EvaluatorProjects />} />
      </Route>

      <Route path="*" element={<h1>Página no encontrada</h1>} />
    </Routes>
  );
}
