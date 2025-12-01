const API = "http://localhost:3000/api";

export async function getEvaluatorStats(token) {
  const res = await fetch(`${API}/evaluador/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.json();
}

export async function getEvaluatorProjects(token) {
  const res = await fetch(`${API}/evaluador/proyectos`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.json();
}

export async function getEvaluation(projectId, token) {
  const res = await fetch(`${API}/evaluaciones/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.json();
}

export async function sendEvaluation(evaluacionData, token) {
  const res = await fetch(`${API}/evaluaciones`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(evaluacionData),
  });

  return res.json();
}

export async function getProjectById(id, token) {
  const res = await fetch(`${API}/proyectos/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.json();
}

