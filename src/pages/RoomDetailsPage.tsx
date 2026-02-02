import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { roomsService } from "../services/rooms.service";
import type { ApiRoom } from "../types/room.api.types";
import { TopicsSection } from "../components/topics/TopicsSection";
import "../styles/rooms.css";
import { candidatesService, type ApiCandidate } from "../services/candidates.service";

export const RoomDetailsPage = () => {
  const { id } = useParams();

  const [room, setRoom] = useState<ApiRoom | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<any[]>([]);

  // description edit
  const [descDraft, setDescDraft] = useState("");
  const [savingDesc, setSavingDesc] = useState(false);
  const [descMsg, setDescMsg] = useState<string | null>(null);

  // candidates
  const [candidates, setCandidates] = useState<ApiCandidate[]>([]);
  const [candName, setCandName] = useState("");
  const [candMsg, setCandMsg] = useState<string | null>(null);
  const [candLoading, setCandLoading] = useState(false);

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
    } catch {}
  };

  const loadCandidates = async () => {
    if (!id) return;
    try {
      const data = await candidatesService.list(id);
      setCandidates(data);
    } catch {}
  };

  useEffect(() => {
    loadRoom();
    loadMembers();
    loadCandidates();
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

      {/* EDIT DESCRIPTION */}
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

      {/* CANDIDATES */}
      <div className="card form-card">
        <h3>Candidatos</h3>
        <p className="muted">Crea candidatos de la sala para poder definir propuestas y torneos por tema.</p>

        {candMsg && <p className="muted">{candMsg}</p>}

        <div className="grid">
          {candidates.length === 0 ? (
            <p className="muted">No hay candidatos todavía.</p>
          ) : (
            candidates.map((c) => (
              <div key={c.id} className="member-card">
                <b>{c.name}</b>
              </div>
            ))
          )}
        </div>

        <div className="input-group">
          <label>Nombre del candidato</label>
          <input
            value={candName}
            onChange={(e) => {
              setCandName(e.target.value);
              setCandMsg(null);
            }}
            placeholder="Ej: Juan Pérez"
          />
        </div>

        <div className="toolbar right">
          <button
            className="primary-btn"
            type="button"
            disabled={!candName.trim() || candLoading}
            onClick={async () => {
              if (!id) return;
              try {
                setCandLoading(true);
                setCandMsg(null);

                await candidatesService.create(id, candName.trim());
                setCandName("");
                setCandMsg("Candidato creado ✅");

                await loadCandidates();
              } catch (e: any) {
                setCandMsg(`Error creando candidato: ${String(e?.message ?? e)}`);
              } finally {
                setCandLoading(false);
              }
            }}
          >
            {candLoading ? "Creando..." : "Crear candidato"}
          </button>
        </div>
      </div>

      {/* MEMBERS */}
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