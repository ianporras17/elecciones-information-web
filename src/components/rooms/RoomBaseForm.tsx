import { useState } from "react";
import type { RoomType } from "../../types/room.types";

interface Props {
  onSubmit: (data: {
    name: string;
    description: string;
    roomType: RoomType;
  }) => void;
}

/**
 * Formulario base de creación de salas
 * Común para cualquier tipo de sala
 */
export const RoomBaseForm = ({ onSubmit }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Nombre obligatorio";
    if (!description.trim()) newErrors.description = "Descripción obligatoria";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSubmit({
      name,
      description,
      roomType: "PRESIDENTIAL",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Datos de la sala</h2>

      <div className="input-group">
        <label>Nombre de la sala</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={120}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div className="input-group">
        <label>Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
        />
        {errors.description && (
          <span className="error">{errors.description}</span>
        )}
      </div>

      <div className="input-group">
        <label>Tipo de sala</label>
        <select value="PRESIDENTIAL" disabled>
          <option value="PRESIDENTIAL">Elecciones presidenciales</option>
        </select>
      </div>

      <button className="primary-btn">Continuar</button>
    </form>
  );
};
