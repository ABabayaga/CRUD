// src/app/painel/page.tsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../lib/api";

export type User = { _id?: string; id?: string; email: string };
export type CreateUserDto = { email: string; password: string };
export type UpdateUserDto = Partial<CreateUserDto>;
export function getUserId(u: User) { return (u.id || u._id)!; }

const emptyForm: CreateUserDto = { email: "", password: "" };

export default function UsersPage() {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<User[]>([]);
  const [q, setQ] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<CreateUserDto>(emptyForm);
  const [toDelete, setToDelete] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<User[]>(`/users${q ? `?q=${encodeURIComponent(q)}` : ""}`);
      setList(data);
    } catch (e: any) {
      setError(e.message ?? "Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [q]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setOpenForm(true);
  }

  function openEdit(u: User) {
    setEditing(u);
    setForm({ email: u.email, password: "" }); 
    setOpenForm(true);
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (editing) {
        const id = getUserId(editing);
        const payload: UpdateUserDto = { ...form };
        if (!payload.password) delete (payload as any).password;
        await apiFetch(`/users/${id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch(`/users`, {
          method: "POST",
          body: JSON.stringify(form),
        });
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
      const id = getUserId(toDelete);
      await apiFetch(`/users/${id}`, { method: "DELETE" });
      setToDelete(null);
      await load();
    } catch (e: any) {
      setError(e.message ?? "Erro ao excluir");
    } finally {
      setLoading(false);
    }
  }

  const total = list.length;

  return (
    <div className="p-4 md:p-6">
      <div className="p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Users</h1>
            <p className="text-sm text-gray-500">Total {total}</p>
          </div>

          <div className="mx-auto">
            <button
              onClick={openCreate}
              className="rounded-lg bg-sky-600 px-4 py-2 text-white hover:bg-sky-700 disabled:opacity-50"
              disabled={loading}
            >
              + Novo Usuário
            </button>
          </div>

        </div>

        {error && (
          <div className="mb-3 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-50 text-left">
              <tr className="text-gray-600">
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((u) => {
                const id = getUserId(u);
                return (
                  <tr key={id} className="border-t last:border-b">
                    <td className="px-4 py-3 font-medium">{u.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(u)}
                          className="rounded-lg border px-3 py-1.5 hover:bg-gray-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setToDelete(u)}
                          className="rounded-lg border border-red-300 px-3 py-1.5 text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {list.length === 0 && !loading && (
                <tr>
                  <td colSpan={2} className="px-4 py-10 text-center text-gray-500">
                    Nenhum usuário encontrado.
                  </td>
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
                <h2 className="text-lg font-semibold">
                  {editing ? "Editar usuário" : "Novo usuário"}
                </h2>
                <button
                  onClick={() => setOpenForm(false)}
                  className="rounded-md p-1 hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={submitForm} className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm">
                    Senha {editing ? <span className="text-gray-400">(deixe em branco para manter)</span> : null}
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
                    required={!editing}
                  />
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setOpenForm(false)}
                    className="rounded-lg border px-4 py-2 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-sky-600 px-4 py-2 text-white hover:bg-sky-700"
                  >
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
              <h3 className="mb-3 text-lg font-semibold">Excluir usuário</h3>
              <p className="text-sm text-gray-600">
                Tem certeza que deseja excluir{" "}
                <span className="font-medium">{toDelete.email}</span>?
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setToDelete(null)}
                  className="rounded-lg border px-4 py-2 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


