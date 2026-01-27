import { useEffect, useState } from "react";
import { topicsService } from "../../services/topics.service";
import type { ApiTopic, CreateTopicPayload } from "../../types/topic.api.types";
import { Link } from "react-router-dom";

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
    <div style={{ marginTop: 20 }}>
      <h3>Topics</h3>
      {error && <p className="error">{error}</p>}

      {/* LISTA */}
      <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
        {topics.map((t) => (
          <div key={t.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <b>{t.order}. {t.title}</b>
              <Link to={`/topics/${t.id}`}>Ver detalle</Link>
            </div>
            <div>Recursos: {t.resources.length} | Contenidos: {t.contents.length}</div>
            {t.content && <div style={{ marginTop: 6 }}>{t.content}</div>}
          </div>
        ))}
      </div>

      {/* CREAR */}
      <form onSubmit={submit} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
        <h4>Crear Topic</h4>

        <div className="input-group">
          <label>Título</label>
          <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
        </div>

        <div className="input-group">
          <label>Contenido (opcional)</label>
          <textarea value={form.content ?? ""} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} />
        </div>

        <div style={{ marginTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <b>External Resources (opcional)</b>
            <button type="button" className="primary-btn" onClick={addResourceRow}>
              + Recurso
            </button>
          </div>

          {(form.resources ?? []).map((r, i) => (
            <div key={i} style={{ display: "grid", gap: 6, border: "1px solid #eee", padding: 10, borderRadius: 8, marginTop: 10 }}>
              <input
                placeholder="type (ej: LINK)"
                value={r.type}
                onChange={(e) => updateResourceRow(i, { type: e.target.value })}
              />
              <input
                placeholder="title"
                value={r.title}
                onChange={(e) => updateResourceRow(i, { title: e.target.value })}
              />
              <input
                placeholder="url (https://...)"
                value={r.url}
                onChange={(e) => updateResourceRow(i, { url: e.target.value })}
              />
              <input
                placeholder="description"
                value={r.description ?? ""}
                onChange={(e) => updateResourceRow(i, { description: e.target.value })}
              />
              <button type="button" className="primary-btn" onClick={() => removeResourceRow(i)}>
                Quitar
              </button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12 }}>
          <button className="primary-btn">Crear Topic</button>
        </div>
      </form>
    </div>
  );
};
