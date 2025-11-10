function toQuery(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === null || v === undefined || v === "") return;
    if (Array.isArray(v)) {
      v.forEach((item) => {
        if (item !== null && item !== undefined && item !== "") {
          qs.append(k, String(item));
        }
      });
    } else {
      qs.set(k, String(v));
    }
  });
  const s = qs.toString();
  return s ? `?${s}` : "";
}

async function handleResponse(res) {
  const contentType = res.headers.get("Content-Type") || "";
  const isJSON = contentType.includes("application/json");
  const payload = isJSON ? await res.json().catch(() => ({})) : await res.text();

  if (!res.ok) {
    const msg = isJSON
      ? payload?.error || payload?.message || "Error en la solicitud"
      : payload || "Error en la solicitud";
    throw new Error(msg);
  }
  return payload;
}

export async function fetchCoordinatorStats({ signal } = {}) {
  const res = await fetch(`/api/coordinator/stats`, { signal });
  return handleResponse(res);
}

export async function fetchCoordinatorProjects(filters = {}, { signal } = {}) {
  const query = toQuery(filters);

  const res = await fetch(`/api/coordinator/projects${query}`, { signal });

  return handleResponse(res);
}

export async function exportProjectsCSV(
  filters = {},
  filename = "proyectos.csv",
  { signal } = {}
) {
  const query = toQuery(filters);

  const res = await fetch(`/api/coordinator/projects/export${query}`, {
    method: "GET",
    headers: { Accept: "text/csv" },
    signal,
  });

  if (!res.ok) {
    let msg = "No se pudo exportar el CSV";
    try {
      const ct = res.headers.get("Content-Type") || "";
      if (ct.includes("application/json")) {
        const j = await res.json();
        msg = j?.error || j?.message || msg;
      } else {
        msg = await res.text();
      }
    } catch {}
    throw new Error(msg);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function fetchProgramas({ signal } = {}) {
  const res = await fetch(`/api/admin/programas`, { signal });
  return handleResponse(res);
}

export async function fetchConvocatorias({ signal } = {}) {
  const res = await fetch(`/api/admin/convocatorias`, { signal });
  return handleResponse(res);
}

export async function fetchEstados({ signal } = {}) {
  const res = await fetch(`/api/admin/estados`, { signal });
  return handleResponse(res);
}

export function openProjectDocument(archivo_path) {
  if (!archivo_path) return;
  window.open(
    `http://localhost:3000${archivo_path}`,
    "_blank",
    "noopener,noreferrer"
  );
}

export async function crearConvocatoria(data, { signal } = {}) {
  const res = await fetch(`/api/admin/convocatorias`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    signal,
  });
  return handleResponse(res);
}

export async function fetchAsesores({ signal } = {}) {
  const res = await fetch(`/api/coordinator/asesores`, { signal });
  return handleResponse(res);
}

export async function fetchProyectosSinAsesor({ signal } = {}) {
  const res = await fetch(`/api/coordinator/proyectos-sin-asesor`, { signal });
  return handleResponse(res);
}

export async function asignarAsesor(data, { signal } = {}) {
  const res = await fetch(`/api/coordinator/asignar-asesor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    signal,
  });

  return handleResponse(res);
}
