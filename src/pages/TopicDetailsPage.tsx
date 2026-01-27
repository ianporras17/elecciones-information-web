import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { topicsService } from "../services/topics.service";
import type { ApiTopic } from "../types/topic.api.types";

export const TopicDetailsPage = () => {
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
      <h2>{topic.title}</h2>
      <p><b>Orden:</b> {topic.order}</p>
      {topic.content && <p>{topic.content}</p>}

      <h3>External Resources</h3>

      {topic.resources.length === 0 ? (
        <p>No hay recursos externos.</p>
      ) : (
        topic.resources.map((r) => (
          <div
            key={r.id}
            style={{
              border: "1px solid #ddd",
              padding: 10,
              borderRadius: 8,
              marginBottom: 8,
              display: "grid",
              gap: 6,
            }}
          >
            <div><b>{r.type}</b> - {r.title}</div>
            <a href={r.url} target="_blank" rel="noreferrer">{r.url}</a>
            {r.description && <div>{r.description}</div>}

            <div style={{ display: "flex", gap: 10 }}>
              {/* (Opcional) editar después */}
              {/* <button className="primary-btn" type="button">Editar</button> */}

              <button
                className="primary-btn"
                type="button"
                onClick={async () => {
                  const ok = window.confirm(`¿Eliminar el recurso "${r.title}"?`);
                  if (!ok) return;

                  await topicsService.deleteResource(r.id);

                  // mensaje de éxito
                  alert("Recurso eliminado con éxito.");

                  // recargar topic
                  await load();
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))
      )}

      <h3>TopicContent (por participante)</h3>
      {topic.contents.map((c) => (
        <div key={c.id} style={{ border: "1px solid #ddd", padding: 10, borderRadius: 8, marginBottom: 8 }}>
          <div><b>participantId:</b> {c.participantId}</div>
          <div>{c.content}</div>
        </div>
      ))}

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!id) return;
          await topicsService.upsertContent(id, { participantId, content });
          setParticipantId("");
          setContent("");
          await load();
        }}
        style={{ marginTop: 12, border: "1px solid #ddd", padding: 12, borderRadius: 8 }}
      >
        <h4>Agregar/Actualizar contenido de participante</h4>
        <input placeholder="participantId" value={participantId} onChange={(e) => setParticipantId(e.target.value)} />
        <textarea placeholder="content" value={content} onChange={(e) => setContent(e.target.value)} />
        <button className="primary-btn">Guardar</button>
      </form>
    </div>
  );
};
