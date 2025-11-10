import { useState } from "react";
import styles from "../../css/LoginRegister.module.css";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Inicio de sesión exitoso");

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        switch (data.user.rol) {
          case "estudiante":
            window.location.href = "/student/dashboard";
            break;
          case "asesor":
            window.location.href = "/advisor/dashboard";
            break;
          case "evaluador":
            window.location.href = "/evaluator/dashboard";
            break;
          case "coordinador":
            window.location.href = "/coordinator/dashboard";
            break;
          default:
            window.location.href = "/login";
            break;
        }
      } else {
        alert(data.error || "Credenciales incorrectas");
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
      <form onSubmit={handleLogin} className={styles["auth-card"]}>
        <h2 className={styles["auth-title"]}>Iniciar Sesión</h2>

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

        <button
          type="submit"
          className={styles["auth-btn"]}
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Entrar"}
        </button>

        <p className={styles["auth-link"]}>
          ¿No tienes cuenta? <a href="/register">Regístrate</a>
        </p>
      </form>
    </div>
  );
}
