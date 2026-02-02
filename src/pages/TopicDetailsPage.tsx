import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { topicsService } from "../services/topics.service";
import type { ApiTopic } from "../types/topic.api.types";
import "../styles/topics.css";
import { candidatesService, type ApiCandidate } from "../services/candidates.service";

type NewResourceForm = {
  type: "LINK" | "VIDEO" | "DOCUMENT";
  title: string;
  url: string;
  description: string;
  order: number;
};

export const TopicDetailsPage = () => {
  const { id } = useParams();
  const [topic, setTopic] = useState<ApiTopic | null>(null);
  const [error, setError] = useState<string | null>(null);

  // TopicContent (por participante)
  const [participantId, setParticipantId] = useState("");
  const [content, setContent] = useState("");

  // Propuestas por candidato
  const [candidates, setCandidates] = useState<ApiCandidate[]>([]);
  const [proposalDrafts, setProposalDrafts] = useState<Record<string, string>>({});
  const [savingProposalId, setSavingProposalId] = useState<string | null>(null);

  // ✅ External resources: agregar
  const [resForm, setResForm] = useState<NewResourceForm>({
    type: "LINK",
    title: "",
    url: "",
    description: "",
    order: 0,
  });
  const [savingRes, setSavingRes] = useState(false);
  const [resMsg, setResMsg] = useState<string | null>(null);

  const load = async () => {
    if (!id) return;
    try {
      setError(null);
      const data = await topicsService.get(id);
      setTopic(data);

      // cargar candidatos de la sala para poder editar propuestas
      const cand = await candidatesService.list(data.roomId);
      setCandidates(cand);

      // inicializar drafts con lo que ya existe
      const drafts: Record<string, string> = {};
      cand.forEach((c) => {
        const existing = data.proposals?.find((p) => p.candidateId === c.id)?.content ?? "";
        drafts[c.id] = existing;
      });
      setProposalDrafts(drafts);
    } catch (e: any) {
      setError(String(e?.message ?? e));
    }
  };

  useEffect(() => {
    (async () => {
      await load();
    })();
    // eslint-disable-next-line
  }, [id]);

  const proposalsMap = useMemo(() => {
    const map: Record<string, string> = {};
    (topic?.proposals ?? []).forEach((p: any) => {
      map[p.candidateId] = p.content;
    });
    return map;
  }, [topic]);

  if (error) return <div className="page-container"><p className="error">{error}</p></div>;
  if (!topic) return <div className="page-container"><p>Cargando...</p></div>;

  return (
    <div className="page-container">
      <div className="card">
        <h2>{topic.title}</h2>
        <p className="muted"><b>Orden:</b> {topic.order}</p>
        <p className="muted"><b>Tipo:</b> {topic.topicType ?? "—"}</p>
        {topic.content && <p>{topic.content}</p>}
      </div>

      {/* =======================
          PROPUESAS POR CANDIDATO
          ======================= */}
      <div className="card form-card">
        <h3>Propuestas por candidato</h3>
        <p className="muted">
          Aquí defines la propuesta de cada candidato para este topic. (Esto alimenta el torneo.)
        </p>

        {candidates.length === 0 ? (
          <p className="muted">No hay candidatos en esta sala todavía.</p>
        ) : (
          <div className="stack">
            {candidates.map((c) => {
              const saved = proposalsMap[c.id] ?? "";
              const draft = proposalDrafts[c.id] ?? "";
              const changed = draft !== saved;

              return (
                <div key={c.id} className="content-card">
                  <div className="row space-between">
                    <b>{c.name}</b>
                    <span className="muted">
                      {saved.trim() ? "✅ Tiene propuesta" : "— Sin propuesta"}
                    </span>
                  </div>

                  <div className="input-group" style={{ marginTop: 10 }}>
                    <label>Propuesta</label>
                    <textarea
                      value={draft}
                      onChange={(e) =>
                        setProposalDrafts((p) => ({ ...p, [c.id]: e.target.value }))
                      }
                      placeholder="Escribe la propuesta del candidato para este tema..."
                      maxLength={2000}
                    />
                  </div>

                  <div className="toolbar right">
                    <button
                      className="secondary-btn"
                      type="button"
                      disabled={!changed || savingProposalId === c.id}
                      onClick={() => setProposalDrafts((p) => ({ ...p, [c.id]: saved }))}
                    >
                      Descartar
                    </button>

                    <button
                      className="primary-btn"
                      type="button"
                      disabled={savingProposalId === c.id}
                      onClick={async () => {
                        if (!id) return;
                        try {
                          setSavingProposalId(c.id);

                          await topicsService.upsertProposal(id, {
                            candidateId: c.id,
                            content: (proposalDrafts[c.id] ?? "").trim(),
                          });

                          await load();
                        } catch (e: any) {
                          alert(`Error guardando propuesta: ${String(e?.message ?? e)}`);
                        } finally {
                          setSavingProposalId(null);
                        }
                      }}
                    >
                      {savingProposalId === c.id ? "Guardando..." : "Guardar propuesta"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =======================
          EXTERNAL RESOURCES
          ======================= */}
      <h3>External Resources</h3>

      {/* ✅ FORM: agregar recurso */}
      <div className="card form-card">
        <h4 className="form-title">Agregar recurso</h4>
        {resMsg && <p className="muted">{resMsg}</p>}

        <div className="grid">
          <div className="input-group">
            <label>Tipo</label>
            <select
              value={resForm.type}
              onChange={(e) =>
                setResForm((p) => ({ ...p, type: e.target.value as any }))
              }
            >
              <option value="LINK">LINK</option>
              <option value="VIDEO">VIDEO</option>
              <option value="DOCUMENT">DOCUMENT</option>
            </select>
          </div>

          <div className="input-group">
            <label>Título</label>
            <input
              value={resForm.title}
              onChange={(e) => setResForm((p) => ({ ...p, title: e.target.value }))}
            />
          </div>

          <div className="input-group">
            <label>URL (http/https)</label>
            <input
              value={resForm.url}
              onChange={(e) => setResForm((p) => ({ ...p, url: e.target.value }))}
              placeholder="https://..."
            />
          </div>

          <div className="input-group">
            <label>Descripción (opcional)</label>
            <input
              value={resForm.description}
              onChange={(e) => setResForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>

          <div className="input-group">
            <label>Orden</label>
            <input
              type="number"
              value={resForm.order}
              onChange={(e) => setResForm((p) => ({ ...p, order: Number(e.target.value) }))}
              min={0}
            />
          </div>
        </div>

        <div className="toolbar right">
          <button
            className="secondary-btn"
            type="button"
            disabled={savingRes}
            onClick={() => {
              setResForm({ type: "LINK", title: "", url: "", description: "", order: 0 });
              setResMsg(null);
            }}
          >
            Limpiar
          </button>

          <button
            className="primary-btn"
            type="button"
            disabled={savingRes || !resForm.title.trim() || !resForm.url.trim()}
            onClick={async () => {
              if (!id) return;
              try {
                setSavingRes(true);
                setResMsg(null);

                await topicsService.addResource(id, {
                  type: resForm.type,
                  title: resForm.title.trim(),
                  url: resForm.url.trim(),
                  description: resForm.description.trim() ? resForm.description.trim() : undefined,
                  order: resForm.order ?? 0,
                });

                setResForm({ type: "LINK", title: "", url: "", description: "", order: 0 });
                setResMsg("Recurso agregado ✅");
                await load();
              } catch (e: any) {
                setResMsg(`Error agregando recurso: ${String(e?.message ?? e)}`);
              } finally {
                setSavingRes(false);
              }
            }}
          >
            {savingRes ? "Guardando..." : "Agregar"}
          </button>
        </div>
      </div>

      {/* LISTA de recursos */}
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

      {/* =======================
          TOPIC CONTENT
          ======================= */}
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