const API = "http://localhost:3000/api";

export async function getAdvisorStats(token) {
  const res = await fetch(`${API}/asesor/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function getAdvisorProjects(token) {
  const res = await fetch(`${API}/asesor/proyectos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function getAdvisorProjectById(id, token) {
  const res = await fetch(`${API}/asesor/proyecto/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function sendAdvisorObservation(id, formData, token) {
  const res = await fetch(`${API}/asesor/observar/${id}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  return res.json();
}
