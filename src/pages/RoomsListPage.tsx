import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { roomsService } from "../services/rooms.service";
import type { ApiRoom } from "../types/room.api.types";
import "../styles/rooms.css";

export const RoomsListPage = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<ApiRoom[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    try {
      setError(null);
      const data = await roomsService.listRooms();
      setRooms(data);
    } catch (e: any) {
      setError(String(e?.message ?? e));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleActive = async (room: ApiRoom) => {
    try {
      setBusyId(room.id);

      // backend update usa status => isActive
      const newStatus = room.isActive ? "INACTIVE" : "ACTIVE";
      const updated = await roomsService.updateRoom(room.id, { status: newStatus });

      // update local sin recargar
      setRooms((prev) => prev.map((r) => (r.id === room.id ? updated : r)));
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="page-container">
      {error && <p className="error">{error}</p>}

      <div className="rooms-grid">
        {rooms.map((r) => (
          <div key={r.id} className="room-card">
            <div className="room-title"><b>{r.title}</b></div>
            {r.description && (
              <div className="muted">{r.description}</div>
            )}
            <div className="muted">Código: <b>{r.accessCode}</b></div>
            <div className="muted">Estado: {r.isActive ? "ACTIVA" : "INACTIVA"}</div>

            <div className="room-actions">
              <Link className="link" to={`/rooms/${r.id}`}>Ver info</Link>

              <button
                className="primary-btn"
                type="button"
                disabled={busyId === r.id}
                onClick={() => toggleActive(r)}
              >
                {busyId === r.id
                  ? "Actualizando..."
                  : r.isActive
                  ? "Desactivar"
                  : "Activar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
