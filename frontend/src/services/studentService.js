export async function fetchStudentDashboard(studentId) {
  const res = await fetch(`/api/proyectos/dashboard/${studentId}`);

  if (!res.ok) {
    throw new Error("Error consultando datos del dashboard");
  }

  return await res.json();
}

export async function submitProposal(formData) {
  const res = await fetch("/api/proyectos/propuesta", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Error enviando la propuesta");
  }

  return res.json();
}

export async function buscarColaboradorPorCorreo(correo) {
  const res = await fetch(
    `/api/usuarios/buscar?correo=${encodeURIComponent(correo)}`
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Error buscando colaborador");
  }

  return data;
}

export async function fetchStudentProjects(studentId) {
  const res = await fetch(`/api/proyectos/mis-proyectos/${studentId}`);

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Error consultando proyectos");
  }

  return data;
}

export async function updateProjectFile(projectId, file) {
  const formData = new FormData();
  formData.append("archivo", file);

  const res = await fetch(`/api/proyectos/actualizar-archivo/${projectId}`, {
    method: "PUT",
    body: formData
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data.error || "Error subiendo archivo");

  return data;
}
