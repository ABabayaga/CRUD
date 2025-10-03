"use client";
import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/app/lib/api";
import type { Task, CreateTaskDto, UpdateTaskDto } from "../../lib/type";
import { getTaskId } from "../../lib/type";

const emptyForm: CreateTaskDto = { title: "", description: "", dueDate: "", done: false };

export default function TasksPage() {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<Task[]>([]);
  const [q, setQ] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [form, setForm] = useState<CreateTaskDto>(emptyForm);
  const [toDelete, setToDelete] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<Task[]>(`/tasks${q ? `?q=${encodeURIComponent(q)}` : ""}`);
      setList(data);
    } catch (e: any) {
      setError(e.message ?? "Erro ao carregar tarefas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);
  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [q]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setOpenForm(true);
  }
  function openEdit(t: Task) {
    setEditing(t);
    setForm({
      title: t.title,
      description: t.description ?? "",
      dueDate: t.dueDate ?? "",
      done: t.done ?? false,
    });
    setOpenForm(true);
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (editing) {
        const id = getTaskId(editing);
        const payload: UpdateTaskDto = { ...form };
        if (!payload.dueDate) delete (payload as any).dueDate;
        await apiFetch(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await apiFetch(`/tasks`, { method: "POST", body: JSON.stringify(form) });
      }
      setOpenForm(false);
      setEditing(null);
      setForm(emptyForm);
      await load();
    } catch (e: any) {
      setError(e.message ?? "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setLoading(true);
    setError(null);
    try {
      const id = getTaskId(toDelete);
      await apiFetch(`/tasks/${id}`, { method: "DELETE" });
      setToDelete(null);
      await load();
    } catch (e: any) {
      setError(e.message ?? "Erro ao excluir");
    } finally {
      setLoading(false);
    }
  }

  const total = list.length;
  const doneCount = useMemo(() => list.filter(t => t.done).length, [list]);

  return (
    <div className="p-4 md:p-6">

      <div className="mb-4">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold p-6">Tasks</h1>
            <p className="text-sm text-gray-500">
              Total {total} • Concluídas {doneCount}
            </p>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            onClick={openCreate}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3
                 text-white text-base font-medium shadow-sm transition
                 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                 disabled:opacity-60"
          >
            + Nova Tarefa
          </button>
        </div>
      </div>

      {error && <div className="mb-3 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full table-auto text-sm">
          <thead className="bg-gray-50 text-left">
            <tr className="text-gray-600">
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Prazo</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {list.map(t => {
              const id = getTaskId(t);
              return (
                <tr key={id} className="border-t last:border-b">
                  <td className="px-4 py-3 font-medium">{t.title}</td>
                  <td className="px-4 py-3 text-gray-600">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "-"}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs ${t.done ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {t.done ? "Concluída" : "Pendente"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(t)} className="rounded-lg border px-3 py-1.5 hover:bg-gray-50">Edit</button>
                      <button onClick={() => setToDelete(t)} className="rounded-lg border border-red-300 px-3 py-1.5 text-red-600 hover:bg-red-50">Delete</button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {list.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-gray-500">Nenhuma tarefa encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {loading && <div className="mt-3 text-sm text-gray-500">Carregando…</div>}

      {openForm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editing ? "Editar tarefa" : "Nova tarefa"}</h2>
              <button onClick={() => setOpenForm(false)} className="rounded-md p-1 hover:bg-gray-100">✕</button>
            </div>

            <form onSubmit={submitForm} className="space-y-3">
              <div>
                <label className="mb-1 block text-sm">Título</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm">Descrição</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm">Prazo</label>
                  <input
                    type="date"
                    value={form.dueDate?.slice(0, 10) || ""}
                    onChange={(e) => setForm(f => ({ ...f, dueDate: e.target.value || "" }))}
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <label className="flex items-end gap-2">
                  <input
                    type="checkbox"
                    checked={!!form.done}
                    onChange={(e) => setForm(f => ({ ...f, done: e.target.checked }))}
                    className="h-5 w-5 rounded border-gray-300"
                  />
                  <span className="text-sm">Concluída</span>
                </label>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setOpenForm(false)} className="rounded-lg border px-4 py-2 hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="rounded-lg bg-sky-600 px-4 py-2 text-white hover:bg-sky-700">
                  {editing ? "Salvar" : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toDelete && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl">
            <h3 className="mb-3 text-lg font-semibold">Excluir tarefa</h3>
            <p className="text-sm text-gray-600">Tem certeza que deseja excluir <span className="font-medium">{toDelete.title}</span>?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setToDelete(null)} className="rounded-lg border px-4 py-2 hover:bg-gray-50">Cancelar</button>
              <button onClick={confirmDelete} className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
