import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { roomsService } from "../services/rooms.service";
import type { ApiRoom } from "../types/room.api.types";

export const RoomDetailsPage = () => {
  const { id } = useParams();
  const [room, setRoom] = useState<ApiRoom | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    roomsService.getRoom(id)
      .then(setRoom)
      .catch((e) => setError(String(e.message ?? e)));
  }, [id]);

  if (error) return <div className="page-container"><p className="error">{error}</p></div>;
  if (!room) return <div className="page-container"><p>Cargando...</p></div>;

  return (
    <div className="page-container">
      <h2>Info de la sala</h2>

      <p><b>Nombre:</b> {room.title}</p>
      <p><b>Código:</b> {room.accessCode}</p>
      <p><b>Activa:</b> {room.isActive ? "Sí" : "No"}</p>

      <button
        className="primary-btn"
        onClick={async () => {
          // “Entrar” = validar código (tu endpoint join)
          const joined = await roomsService.joinRoom(room.accessCode);
          alert(`Entraste a: ${joined.title} (código ${joined.accessCode})`);
        }}
      >
        Ingresar (join)
      </button>
    </div>
  );
};
