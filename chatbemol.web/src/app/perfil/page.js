"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function Perfil() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId")
      if (!userId) {
        router.push("/login")
        return
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`)
        setUser(response.data)
      } catch (err) {
        setError("Erro ao carregar os dados do usuário.")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userId")
    router.push("/login")
  }

  if (loading) return <p className="text-gray-800 text-center">Carregando...</p>
  if (error) return <p className="text-red-600 text-center">{error}</p>

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Perfil do Usuário</h2>

        {user && (
          <div className="space-y-4 text-gray-800">
            <p>
              <strong className="text-gray-900">Nome:</strong> {user.name} {user.lastName}
            </p>
            <p>
              <strong className="text-gray-900">E-mail:</strong> {user.email}
            </p>
            <p>
              <strong className="text-gray-900">CPF:</strong> {user.cpf}
            </p>
            <p>
              <strong className="text-gray-900">Telefone:</strong> {user.phoneNumber}
            </p>
            <p>
              <strong className="text-gray-900">Data de Nascimento:</strong> {user.birthDate ? new Date(user.birthDate).toLocaleDateString("pt-BR") : "Não informado"}
            </p>
            <p>
              <strong className="text-gray-900">Gênero:</strong> {user.gender}
            </p>
            <p>
              <strong className="text-gray-900">Endereço:</strong> {user.street}, {user.number}, {user.neighborhood} - {user.city}/{user.state}
            </p>
            <p>
              <strong className="text-gray-900">CEP:</strong> {user.cep}
            </p>
          </div>
        )}

        {/* Botão de Sair */}
        <div className="mt-6 flex justify-center">
          <button onClick={handleLogout} className="btn-primary bg-red-600 hover:bg-red-700">
            Sair
          </button>
        </div>
      </div>
    </div>
  )
}
