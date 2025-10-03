// src/app/painel/layout.tsx
import Navibar from "../components/Navibar";

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Navibar/>
        {children}
      </body>
    </html>
  );
}