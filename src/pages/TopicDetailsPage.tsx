import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { topicsService } from "../services/topics.service";
import type { ApiTopic } from "../types/topic.api.types";
import "../styles/topics.css";

export const TopicDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [topic, setTopic] = useState<ApiTopic | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [participantId, setParticipantId] = useState("");
  const [content, setContent] = useState("");

  const load = async () => {
    if (!id) return;
    try {
      setError(null);
      const data = await topicsService.get(id);
      setTopic(data);
// eslint-disable-next-line
    } catch (e: any) {
      setError(String(e?.message ?? e));
    }
  };

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [id]);

  if (error) return <div className="page-container"><p className="error">{error}</p></div>;
  if (!topic) return <div className="page-container"><p>Cargando...</p></div>;

  return (
    <div className="page-container">
      <div className="card">
        <h2>{topic.title}</h2>
        <p className="muted"><b>Orden:</b> {topic.order}</p>
        {topic.content && <p>{topic.content}</p>}
      </div>

      <h3>External Resources</h3>

      {topic.resources.length === 0 ? (
        <p className="muted">No hay recursos externos.</p>
      ) : (
        <div className="stack">
          {topic.resources.map((r) => (
            <div key={r.id} className="resource-card">
              <div className="row space-between">
                <div><b>{r.type}</b> - {r.title}</div>
                <button
                  className="primary-btn"
                  type="button"
                  onClick={async () => {
                    const ok = window.confirm(`¿Eliminar el recurso "${r.title}"?`);
                    if (!ok) return;

                    await topicsService.deleteResource(r.id);
                    alert("Recurso eliminado con éxito.");
                    await load();
                  }}
                >
                  Eliminar
                </button>
              </div>

              <a className="link" href={r.url} target="_blank" rel="noreferrer">
                {r.url}
              </a>

              {r.description && <div className="muted">{r.description}</div>}
            </div>
          ))}
        </div>
      )}

      <h3>TopicContent (por participante)</h3>

      {topic.contents.length === 0 ? (
        <p className="muted">No hay contenidos todavía.</p>
      ) : (
        <div className="stack">
          {topic.contents.map((c) => (
            <div key={c.id} className="content-card">
              <div className="muted"><b>participantId:</b> {c.participantId}</div>
              <div>{c.content}</div>
            </div>
          ))}
        </div>
      )}

      <form
        className="card form-card"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!id) return;
          await topicsService.upsertContent(id, { participantId, content });
          setParticipantId("");
          setContent("");
          await load();
        }}
      >
        <h4 className="form-title">Agregar/Actualizar contenido de participante</h4>

        <div className="input-group">
          <label>participantId</label>
          <input
            value={participantId}
            onChange={(e) => setParticipantId(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="toolbar right">
          <button className="primary-btn">Guardar</button>
        </div>
      </form>
    </div>
  );
};