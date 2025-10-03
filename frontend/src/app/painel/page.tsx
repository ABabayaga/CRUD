// src/app/painel/page.tsx
export default function PainelHome() {
    return (
      <section className="p-6">
        <div className="text-center p-6">
        <h1 className="text-4xl font-semibold">Bem-vindo ao Painel</h1>
        <h2 className="text-2xl p-4"> <p>Stoix - Desafio Prático - Desenvolvimento de um Sistema de Gerenciamento de Tarefas</p></h2>
        <p className="mt-2 text-gray-600">
          Use o menu para acessar <strong>Tarefas</strong> e <strong>Usuários</strong>.
        </p>
        </div>
  
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <h2 className="text-lg font-medium">Tarefas</h2>
            <p className="text-sm text-gray-600">Gerencie suas tarefas.</p>
            <a href="/painel/task" className="mt-3 inline-block rounded-lg bg-sky-600 px-4 py-2 text-white hover:bg-sky-700">
              Ir para Tarefas
            </a>
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <h2 className="text-lg font-medium">Usuários</h2>
            <p className="text-sm text-gray-600">Cadastre e edite usuários.</p>
            <a href="/painel/users" className="mt-3 inline-block rounded-lg bg-sky-600 px-4 py-2 text-white hover:bg-sky-700">
              Ir para Usuários
            </a>
          </div>
        </div>
      </section>
    );
  }
  