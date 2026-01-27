import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { roomsService } from "../services/rooms.service";
import type { ApiRoom } from "../types/room.api.types";

export const RoomsListPage = () => {
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
      <h2>Salas creadas</h2>

      {error && <p className="error">{error}</p>}

      <div style={{ display: "grid", gap: 12 }}>
        {rooms.map((r) => (
          <div
            key={r.id}
            style={{
              border: "1px solid #ddd",
              padding: 12,
              borderRadius: 8,
              display: "grid",
              gap: 6,
            }}
          >
            <div><b>{r.title}</b></div>
            <div>Código: <b>{r.accessCode}</b></div>
            <div>Estado: {r.isActive ? "ACTIVA" : "INACTIVA"}</div>

            <div style={{ marginTop: 8, display: "flex", gap: 12, alignItems: "center" }}>
              <Link to={`/rooms/${r.id}`}>Ver info</Link>

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
