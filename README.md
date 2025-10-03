# Stoix - CRUD de Tarefas (CSRF)

## 📋 Descrição
Monorepo com backend (NestJS + MongoDB) e frontend (Next.js + Tailwind)...

## 🚀 Tecnologias
- **Backend**: NestJS (TypeScript), Mongoose (MongoDB), csurf (CSRF), bcryptjs
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS
- **Infra**: Docker Compose

- ## 🔧 Como rodar

### Backend (Docker)

**Pré-requisitos**: Docker e Docker Compose

1. Copie o arquivo de exemplo e ajuste as variáveis:
```bash
cd backend
cp .env.example .env

cd .. 
docker compose up --build -d api

Veja os logs
docker compose logs -f --tail=100 api

## 👤 Usuário Padrão (Seed)

Ao subir o backend, é criado automaticamente um usuário para testes:

- **Email**: `admin@stoix.com`
- **Senha**: `123456`

> 💡 Use essas credenciais para fazer login no frontend.
