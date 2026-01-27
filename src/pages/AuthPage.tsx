import { useState } from "react";
import { AuthCard } from "../components/AuthCard";

export const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <h1 className="auth-title">
          Bienvenido a DecideHub&nbsp;-&nbsp;Admin
        </h1>

        <AuthCard mode={mode} />

        <div className="auth-switch">
          {mode === "login" ? (
            <p>
              ¿Eres nuevo?{" "}
              <span onClick={() => setMode("signup")}>
                Regístrate en DecideHub - Admin
              </span>
            </p>
          ) : (
            <p>
              ¿Ya tienes cuenta?{" "}
              <span onClick={() => setMode("login")}>
                Inicia sesión
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
