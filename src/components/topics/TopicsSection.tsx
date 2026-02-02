import { useEffect, useState } from "react";
import { topicsService } from "../../services/topics.service";
import type { ApiTopic, CreateTopicPayload } from "../../types/topic.api.types";
import { Link } from "react-router-dom";
import "../../styles/topics.css";
import { candidatesService, type ApiCandidate } from "../../services/candidates.service";

export const TopicsSection = ({ roomId }: { roomId: string }) => {
  const [topics, setTopics] = useState<ApiTopic[]>([]);
  const [candidates, setCandidates] = useState<ApiCandidate[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CreateTopicPayload>({
    title: "",
    topicType: "OTHER",
    content: "",
    resources: [],
    candidateId: "",
    proposalContent: "",
  });

  const load = async () => {
    try {
      setError(null);

      const [topicsData, candidatesData] = await Promise.all([
        topicsService.listByRoom(roomId),
        candidatesService.list(roomId),
      ]);

      setTopics(topicsData);
      setCandidates(candidatesData);
    } catch (e: any) {
      setError(String(e?.message ?? e));
    }
  };

  useEffect(() => {
    (async () => {
      await load();
    })();
    // eslint-disable-next-line
  }, [roomId]);

  const addResourceRow = () => {
    setForm((prev) => ({
      ...prev,
      resources: [
        ...(prev.resources ?? []),
        { type: "LINK", title: "", url: "", description: "", order: 0 },
      ],
    }));
  };

  // eslint-disable-next-line
  const updateResourceRow = (i: number, patch: any) => {
    setForm((prev) => ({
      ...prev,
      resources: (prev.resources ?? []).map((r, idx) =>
        idx === i ? { ...r, ...patch } : r
      ),
    }));
  };

  const removeResourceRow = (i: number) => {
    setForm((prev) => ({
      ...prev,
      resources: (prev.resources ?? []).filter((_, idx) => idx !== i),
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);

      if (!form.title.trim()) {
        setError("Título obligatorio");
        return;
      }

      // Si selecciona candidato, debe venir propuesta
      if (form.candidateId && !(form.proposalContent ?? "").trim()) {
        setError("Si seleccionas un candidato, debes escribir la propuesta.");
        return;
      }

      await topicsService.create(roomId, {
        title: form.title.trim(),
        topicType: form.topicType,
        content: form.content?.trim() || undefined,
        resources: (form.resources ?? []).filter(
          (r) => r.title.trim() && r.url.trim()
        ),
        candidateId: form.candidateId?.trim() ? form.candidateId : undefined,
        proposalContent: form.candidateId?.trim()
          ? (form.proposalContent ?? "").trim()
          : undefined,
      });

      setForm({
        title: "",
        topicType: "OTHER",
        content: "",
        resources: [],
        candidateId: "",
        proposalContent: "",
      });

      await load();
    } catch (e: any) {
      setError(String(e?.message ?? e));
    }
  };

  return (
    <section className="topics-section">
      <div className="section-header">
        <h3 className="section-title">Topics</h3>
      </div>

      {error && <p className="error">{error}</p>}

      {/* LISTA */}
      <div className="grid">
        {topics.map((t) => (
          <div key={t.id} className="card topic-card">
            <div className="row space-between">
              <b>
                {t.order}. {t.title}
              </b>
              <Link className="link" to={`/topics/${t.id}`}>
                Ver detalle
              </Link>
            </div>

            <div className="muted">
              Tipo: <b>{t.topicType ?? "—"}</b> · Recursos: {t.resources.length} · Contenidos:{" "}
              {t.contents.length} · Propuestas: {t.proposals?.length ?? 0}
            </div>

            {t.content && <div className="topic-content">{t.content}</div>}
          </div>
        ))}
      </div>

      {/* CREAR */}
      <form className="card form-card" onSubmit={submit}>
        <h4 className="form-title">Crear Topic</h4>

        <div className="input-group">
          <label>Título</label>
          <input
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          />
        </div>

        <div className="input-group">
          <label>Tipo de topic</label>
          <select
            value={form.topicType}
            onChange={(e) =>
              setForm((p) => ({ ...p, topicType: e.target.value as any }))
            }
          >
            <option value="HEALTH">Salud</option>
            <option value="WORK">Trabajo</option>
            <option value="SECURITY">Seguridad</option>
            <option value="EDUCATION">Educación</option>
            <option value="ECONOMY">Economía</option>
            <option value="ENVIRONMENT">Ambiente</option>
            <option value="OTHER">Otro</option>
          </select>
        </div>

        <div className="input-group">
          <label>Contenido (opcional)</label>
          <textarea
            value={form.content ?? ""}
            onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
          />
        </div>

        {/* Propuesta inicial */}
        <div className="card form-card" style={{ boxShadow: "none" }}>
          <h4 className="form-title">Propuesta inicial (opcional)</h4>

          {candidates.length === 0 ? (
            <p className="muted">
              No hay candidatos creados en esta sala. Crea candidatos en RoomDetails.
            </p>
          ) : (
            <>
              <div className="input-group">
                <label>Candidato</label>
                <select
                  value={form.candidateId ?? ""}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, candidateId: e.target.value }))
                  }
                >
                  <option value="">— Seleccionar —</option>
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Propuesta</label>
                <textarea
                  value={form.proposalContent ?? ""}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, proposalContent: e.target.value }))
                  }
                  placeholder="Escribe la propuesta del candidato para este tema..."
                />
              </div>
            </>
          )}
        </div>

        {/* External resources */}
        <div className="resources-block">
          <div className="toolbar space-between">
            <b>External Resources (opcional)</b>
            <button type="button" className="primary-btn" onClick={addResourceRow}>
              + Recurso
            </button>
          </div>

          <div className="stack">
            {(form.resources ?? []).map((r, i) => (
              <div key={i} className="resource-item card">
                <input
                  className="resource-input"
                  placeholder="type (ej: LINK)"
                  value={r.type}
                  onChange={(e) => updateResourceRow(i, { type: e.target.value })}
                />
                <input
                  className="resource-input"
                  placeholder="title"
                  value={r.title}
                  onChange={(e) => updateResourceRow(i, { title: e.target.value })}
                />
                <input
                  className="resource-input"
                  placeholder="url (https://...)"
                  value={r.url}
                  onChange={(e) => updateResourceRow(i, { url: e.target.value })}
                />
                <input
                  className="resource-input"
                  placeholder="description"
                  value={r.description ?? ""}
                  onChange={(e) => updateResourceRow(i, { description: e.target.value })}
                />

                <div className="toolbar right">
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => removeResourceRow(i)}
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="toolbar right">
          <button className="primary-btn">Crear Topic</button>
        </div>
      </form>
    </section>
  );
};