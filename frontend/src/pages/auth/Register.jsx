import { useState } from "react";
import styles from "../../css/LoginRegister.module.css";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("estudiante");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (contrasena !== confirmarContrasena) {
      alert("❌ Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          correo,
          contrasena,
          rol: tipoUsuario,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Usuario registrado correctamente");
        window.location.href = "/login";
      } else {
        alert(data.error || "Error al registrar usuario");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["auth-container"]}>
      <form onSubmit={handleRegister} className={styles["auth-card"]}>
        <h2 className={styles["auth-title"]}>Registro</h2>

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className={styles["auth-input"]}
          required
        />

        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className={styles["auth-input"]}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          className={styles["auth-input"]}
          required
        />

        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmarContrasena}
          onChange={(e) => setConfirmarContrasena(e.target.value)}
          className={styles["auth-input"]}
          required
        />

        <select
          value={tipoUsuario}
          onChange={(e) => setTipoUsuario(e.target.value)}
          className={styles["auth-select"]}
        >
          <option value="estudiante">Estudiante</option>
          <option value="asesor">Asesor</option>
          <option value="evaluador">Evaluador</option>
          <option value="coordinador">Coordinador</option>
        </select>

        <button
          type="submit"
          className={styles["auth-btn"]}
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrar"}
        </button>

        <p className={styles["auth-link"]}>
          ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
        </p>
      </form>
    </div>
  );
}
