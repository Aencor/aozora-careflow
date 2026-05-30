import "./globals.css";

export const metadata = {
  title: "Aozora Care-Flow | Control de Visitas y Trazabilidad Hospitalaria",
  description: "Sistema premium de monitoreo, check-in y control de accesos de visitas, pacientes y personal médico.",
  icons: {
    icon: '/favicon.ico',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="h-full scroll-smooth">
      <body className="min-h-full bg-[#090d16] text-[#f8fafc] antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}
