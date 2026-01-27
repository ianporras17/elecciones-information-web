import { useState } from "react";
import type { PresidentialConfig } from "../../../types/room.types";

interface Props {
  onSubmit: (config: PresidentialConfig) => void;
}

/**
 * Configuración específica para salas de elecciones presidenciales
 * Controla qué secciones estarán habilitadas en la sala
 */
export const PresidentialConfigForm = ({ onSubmit }: Props) => {
  const [config, setConfig] = useState<PresidentialConfig>({
    candidatesEnabled: true,
    topicsEnabled: true,
    newsEnabled: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(config);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Configuración de elecciones presidenciales</h2>

      <label className="checkbox-group">
        <input
          type="checkbox"
          checked={config.candidatesEnabled}
          onChange={(e) =>
            setConfig({ ...config, candidatesEnabled: e.target.checked })
          }
        />
        Habilitar candidatos
      </label>

      <label className="checkbox-group">
        <input
          type="checkbox"
          checked={config.topicsEnabled}
          onChange={(e) =>
            setConfig({ ...config, topicsEnabled: e.target.checked })
          }
        />
        Habilitar temas
      </label>

      <label className="checkbox-group">
        <input
          type="checkbox"
          checked={config.newsEnabled}
          onChange={(e) =>
            setConfig({ ...config, newsEnabled: e.target.checked })
          }
        />
        Habilitar noticias
      </label>

      <button className="primary-btn">Crear sala</button>
    </form>
  );
};
