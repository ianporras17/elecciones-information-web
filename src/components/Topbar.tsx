import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth.service";

type Props = {
  title?: string;
  showBack?: boolean;
};

export const Topbar = ({ title = "Dashboard", showBack = false }: Props) => {
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand" onClick={() => navigate("/rooms")} style={{ cursor: "pointer" }}>
          <span className="brand-dot" />
          DecideHub Admin
          {title ? <span className="muted" style={{ fontWeight: 700 }}>· {title}</span> : null}
        </div>

        <div className="topbar-actions">
          {showBack && (
            <button className="secondary-btn" type="button" onClick={() => navigate(-1)}>
              ← Volver
            </button>
          )}

          <button className="secondary-btn" type="button" onClick={() => navigate("/rooms")}>
            Salas
          </button>

          <button className="secondary-btn" type="button" onClick={() => navigate("/rooms/create")}>
            Crear sala
          </button>

          <button
            className="btn btn-primary"
            type="button"
            onClick={() => {
              logout();
              navigate("/", { replace: true });
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
};
