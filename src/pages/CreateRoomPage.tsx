import { useState } from "react";
import { RoomBaseForm } from "../components/rooms/RoomBaseForm";
import { PresidentialConfigForm } from "../components/rooms/presidential/PresidentialConfigForm";
import type { CreateRoomPayload, PresidentialConfig } from "../types/room.types";

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
  const handleConfigSubmit = (config: PresidentialConfig) => {
    if (!baseData) return;

    const payload: CreateRoomPayload = {
      ...baseData,
      config,
    };

    console.log("Payload final a enviar al backend:", payload);

    // TODO: roomService.createRoom(payload)
  };

  return (
    <div className="page-container">
      {!baseData ? (
        <RoomBaseForm onSubmit={handleBaseSubmit} />
      ) : (
        <PresidentialConfigForm onSubmit={handleConfigSubmit} />
      )}
    </div>
  );
};
