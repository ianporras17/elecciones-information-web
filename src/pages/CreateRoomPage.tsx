import { useState } from "react";
import { RoomBaseForm } from "../components/rooms/RoomBaseForm";
import { PresidentialConfigForm } from "../components/rooms/presidential/PresidentialConfigForm";
import type { CreateRoomPayload, PresidentialConfig } from "../types/room.types";
import { roomsService } from "../services/rooms.service";
import { useNavigate } from "react-router-dom";
import "../styles/rooms.css";

/**
 * Página principal para la creación de salas
 * Orquesta el formulario base + configuración dinámica
 */
export const CreateRoomPage = () => {
  /**
   * Datos base de la sala
   * Se setean una sola vez al completar el primer formulario
   */
  const [baseData, setBaseData] = useState<Omit<CreateRoomPayload, "config"> | null>(null);
  const navigate = useNavigate();

  /**
   * Se ejecuta al completar el formulario base
   */
  const handleBaseSubmit = (data: Omit<CreateRoomPayload, "config">) => {
    setBaseData(data);
  };

  /**
   * Se ejecuta al completar la configuración presidencial
   * Aquí se arma el payload final que irá al backend
   */
  const handleConfigSubmit = async (config: PresidentialConfig) => {
    if (!baseData) return;

    const created = await roomsService.createRoom({
      name: baseData.name,
      description: baseData.description,
      status: 'ACTIVE',
    });

    navigate(`/rooms/${created.id}`);
  };

  

  return (
    <div className="page-container">
      <div className="center-wrap">
        {!baseData ? (
          <RoomBaseForm onSubmit={handleBaseSubmit} />
        ) : (
          <PresidentialConfigForm onSubmit={handleConfigSubmit} />
        )}
      </div>
    </div>
  );
};
