import { useEffect, useState } from "react";
import { topicsService } from "../../services/topics.service";
import type { ApiTopic, CreateTopicPayload } from "../../types/topic.api.types";
import { Link } from "react-router-dom";
import "../../styles/topics.css";

export const TopicsSection = ({ roomId }: { roomId: string }) => {
  const [topics, setTopics] = useState<ApiTopic[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CreateTopicPayload>({
    title: "",
    content: "",
    resources: [],
  });

  const load = async () => {
    try {
      setError(null);
      const data = await topicsService.listByRoom(roomId);
      setTopics(data);
      // eslint-disable-next-line
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
      resources: (prev.resources ?? []).map((r, idx) => (idx === i ? { ...r, ...patch } : r)),
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

      await topicsService.create(roomId, {
        title: form.title.trim(),
        content: form.content?.trim() || undefined,
        resources: (form.resources ?? []).filter((r) => r.title.trim() && r.url.trim()),
      });

      setForm({ title: "", content: "", resources: [] });
      await load();
      // eslint-disable-next-line
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
                Recursos: {t.resources.length} | Contenidos: {t.contents.length}
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
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
            />
          </div>

          <div className="input-group">
            <label>Contenido (opcional)</label>
            <textarea
              value={form.content ?? ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, content: e.target.value }))
              }
            />
          </div>

          <div className="resources-block">
            <div className="toolbar space-between">
              <b>External Resources (opcional)</b>
              <button
                type="button"
                className="primary-btn"
                onClick={addResourceRow}
              >
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
                    onChange={(e) =>
                      updateResourceRow(i, { title: e.target.value })
                    }
                  />
                  <input
                    className="resource-input"
                    placeholder="url (https://...)"
                    value={r.url}
                    onChange={(e) =>
                      updateResourceRow(i, { url: e.target.value })
                    }
                  />
                  <input
                    className="resource-input"
                    placeholder="description"
                    value={r.description ?? ""}
                    onChange={(e) =>
                      updateResourceRow(i, { description: e.target.value })
                    }
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
