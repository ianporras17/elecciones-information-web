import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin, registerAdmin } from "../services/auth.service";

interface Props {
  mode: "login" | "signup";
}

/**
 * Componente de autenticación
 * Maneja login y registro según modo activo
 */
export const AuthCard = ({ mode }: Props) => {
  const navigate = useNavigate();

  // Estado para mostrar u ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);

  // Datos del formulario
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Mensajes de error frontend / backend
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  /**
   * Limpia estado al cambiar entre login / signup
   */
  useEffect(() => {
    setForm({ username: "", email: "", password: "" });
    setErrors({});
    setShowPassword(false);
  }, [mode]);

  /**
   * Validaciones frontend
   */
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (mode === "signup" && !form.username.trim()) {
      newErrors.username = "El nombre de usuario es obligatorio";
    }

    if (!form.email.trim()) {
      newErrors.email =
        mode === "login"
          ? "Usuario o correo obligatorio"
          : "El correo es obligatorio";
    }

    if (mode === "signup" && !/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Formato de correo inválido";
    }

    if (!form.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (form.password.length < 8 || form.password.length > 16) {
      newErrors.password = "Debe tener entre 8 y 16 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Submit del formulario
   * Conecta con backend NestJS
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      setErrors({});

      if (mode === "signup") {
        await registerAdmin({
          username: form.username,
          email: form.email,
          password: form.password,
        });

        alert("Administrador registrado correctamente ✅");
      } else {
        const response = await loginAdmin({
          identifier: form.email,
          password: form.password,
        });

        // Guardar token JWT
        localStorage.setItem("token", response.token);

        // 👉 Redirección tras login exitoso
        navigate("/rooms/create");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Error de conexión con el servidor";

      setErrors({ api: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <h2>{mode === "login" ? "Iniciar sesión" : "Registrarse"}</h2>

      {/* Error backend general */}
      {errors.api && <p className="error">{errors.api}</p>}

      {/* Username solo en registro */}
      {mode === "signup" && (
        <div className="input-group">
          <label>Nombre de usuario</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
          />
          {errors.username && (
            <span className="error">{errors.username}</span>
          )}
        </div>
      )}

      {/* Email / Usuario */}
      <div className="input-group">
        <label>
          {mode === "login"
            ? "Usuario o correo"
            : "Correo electrónico"}
        </label>
        <input
          type="text"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      {/* Password */}
      <div className="input-group password-group">
        <label>Contraseña</label>

        <input
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          type="button"
          className="toggle-password"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "🙈" : "👁️"}
        </button>

        {errors.password && (
          <span className="error">{errors.password}</span>
        )}
      </div>

      <button className="primary-btn" type="submit" disabled={loading}>
        {loading
          ? "Procesando..."
          : mode === "login"
          ? "Entrar"
          : "Crear cuenta"}
      </button>
    </form>
  );
};
