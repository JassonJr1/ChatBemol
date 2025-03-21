import "./globals.css"
import BaseLayout from "../../components/BaseLayout" // 🔹 Agora usando alias corretamente

export const metadata = {
  title: "ChatBemol",
  description: "Sistema de Cadastro Omnichannel"
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body>
        <BaseLayout>{children}</BaseLayout>
      </body>
    </html>
  )
}
