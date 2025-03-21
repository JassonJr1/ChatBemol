"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, formData)
      console.log("Login bem-sucedido:", response.data)

      localStorage.setItem("userId", response.data.userId)

      router.push("/perfil")
    } catch (err) {
      console.error("Erro no login:", err)
      setError("E-mail ou senha incorretos.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Login</h2>

        {error && <p className="text-red-600 bg-red-100 p-2 rounded text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input type="email" name="email" placeholder="Digite seu e-mail" value={formData.email} onChange={handleChange} className="input-style" required />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Senha
            </label>
            <input type="password" name="password" placeholder="Digite sua senha" value={formData.password} onChange={handleChange} className="input-style" required />
          </div>

          <button type="submit" className="btn-primary">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  )
}
