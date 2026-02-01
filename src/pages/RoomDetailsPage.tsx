import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { roomsService } from "../services/rooms.service";
import type { ApiRoom } from "../types/room.api.types";
import { TopicsSection } from "../components/topics/TopicsSection";
import "../styles/rooms.css";

export const RoomDetailsPage = () => {
  const { id } = useParams();

  const [room, setRoom] = useState<ApiRoom | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<any[]>([]);

  const [descDraft, setDescDraft] = useState("");
  const [savingDesc, setSavingDesc] = useState(false);
  const [descMsg, setDescMsg] = useState<string | null>(null);

  const loadRoom = async () => {
    if (!id) return;
    try {
      setError(null);
      const r = await roomsService.getRoom(id);
      setRoom(r);
      setDescDraft(r.description ?? ""); 
    } catch (e: any) {
      setError(String(e?.message ?? e));
    }
  };

  const loadMembers = async () => {
    if (!id) return;
    try {
      const data = await roomsService.getMembers(id);
      setMembers(data);
    } catch {
      // no bloquear la UI si falla members
    }
  };

  useEffect(() => {
    loadRoom();
    loadMembers();
    // eslint-disable-next-line
  }, [id]);

  if (error) return <div className="page-container"><p className="error">{error}</p></div>;
  if (!room) return <div className="page-container"><p>Cargando...</p></div>;

  const hasChanges = (room.description ?? "") !== descDraft;

  return (
    <div className="page-container">
      <div className="card">
        <p><b>Nombre:</b> {room.title}</p>
        <p><b>Código:</b> {room.accessCode}</p>
        <p><b>Activa:</b> {room.isActive ? "Sí" : "No"}</p>

        <p><b>Descripción:</b> {room.description?.trim() ? room.description : "—"}</p>

        <div className="toolbar right">
          <button
            className="primary-btn"
            type="button"
            onClick={async () => {
              const joined = await roomsService.joinRoom(room.accessCode);
              alert(`Entraste a: ${joined.title} (código ${joined.accessCode})`);
            }}
          >
            Ingresar (join)
          </button>
        </div>
      </div>

      <div className="card form-card">
        <h4 className="form-title">Editar descripción</h4>

        {descMsg && <p className="muted">{descMsg}</p>}

        <div className="input-group">
          <label>Nueva descripción</label>
          <textarea
            value={descDraft}
            onChange={(e) => {
              setDescDraft(e.target.value);
              setDescMsg(null);
            }}
            maxLength={500}
          />
        </div>

        <div className="toolbar right">
          <button
            className="secondary-btn"
            type="button"
            disabled={savingDesc || !hasChanges}
            onClick={() => {
              setDescDraft(room.description ?? "");
              setDescMsg("Cambios descartados.");
            }}
          >
            Cancelar
          </button>

          <button
            className="primary-btn"
            type="button"
            disabled={savingDesc || !hasChanges}
            onClick={async () => {
              if (!id) return;
              try {
                setSavingDesc(true);
                setDescMsg(null);

                const updated = await roomsService.updateRoom(id, {
                  description: descDraft.trim() ? descDraft : "",
                });

                setRoom(updated);
                setDescDraft(updated.description ?? "");
                setDescMsg("Descripción actualizada ✅");
              } catch (e: any) {
                setDescMsg(`Error al guardar: ${String(e?.message ?? e)}`);
              } finally {
                setSavingDesc(false);
              }
            }}
          >
            {savingDesc ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>

      <h3>Miembros</h3>
      {members.length === 0 ? (
        <p className="muted">No hay miembros en esta sala.</p>
      ) : (
        <div className="members-grid">
          {members.map((m) => (
            <div key={m.id} className="member-card">
              <b>{m.user.name}</b>{" "}
              <span className="muted">- {m.role}</span>
            </div>
          ))}
        </div>
      )}

      {id && <TopicsSection roomId={id} />}
    </div>
  );
};
