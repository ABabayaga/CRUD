// src/app/layout.tsx
import "./globals.css";

export const metadata = {
  title: 'Stoix – Painel',
  description: 'Sistema de gerenciamento de tarefas',
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
