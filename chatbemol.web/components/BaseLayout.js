"use client"
import Link from "next/link"
import Image from "next/image"

export default function BaseLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="header-style">
        <div className="container mx-auto flex justify-between items-center">
          {/* Substituindo o texto por uma logo */}
          <Link href="/">
            <Image
              src="/bemol.logo.png"
              alt="ChatBemol Logo"
              width={150} // Ajuste conforme necessário
              height={50}
              className="cursor-pointer"
            />
          </Link>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/cadastro" className="hover:underline">
                  Cadastro
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:underline">
                  Login
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Conteúdo com altura dinâmica */}
      <main className="flex-grow flex items-center justify-center p-6">{children}</main>

      {/* Footer */}
      <footer className="footer-style">
        <p>&copy; 2025 ChatBemol - Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
