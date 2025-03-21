"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import axios from "axios"

export default function Cadastro() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    passwordHash: "",
    cpf: "",
    birthDate: "",
    gender: "",
    phoneNumber: "",
    cep: "",
    street: "",
    neighborhood: "",
    number: "",
    city: "",
    state: ""
  })

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState("")
  const [cepError, setCepError] = useState(null)
  const [emailError, setEmailError] = useState(null)

  const handleChange = e => {
    const { name, value } = e.target

    // Validação da força da senha
    if (name === "passwordHash") {
      const strength = value.length < 6 ? "Senha muito curta" : /^[a-zA-Z]+$/.test(value) ? "Fraca (adicione números ou símbolos)" : /^(?=.*[0-9])(?=.*[a-zA-Z])/.test(value) ? "Média (adicione símbolos)" : /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])/.test(value) ? "Forte 💪" : ""

      setPasswordStrength(strength)
    }

    // Formatação automática do CPF
    if (name === "cpf") {
      let formattedCPF = value.replace(/\D/g, "").slice(0, 11)
      if (formattedCPF.length > 3) formattedCPF = `${formattedCPF.slice(0, 3)}.${formattedCPF.slice(3)}`
      if (formattedCPF.length > 7) formattedCPF = `${formattedCPF.slice(0, 7)}.${formattedCPF.slice(7)}`
      if (formattedCPF.length > 11) formattedCPF = `${formattedCPF.slice(0, 11)}-${formattedCPF.slice(11)}`

      setFormData(prev => ({ ...prev, cpf: formattedCPF }))
      return
    }

    // Formatação automática do telefone
    if (name === "phoneNumber") {
      let formattedPhone = value.replace(/\D/g, "").slice(0, 11)
      if (formattedPhone.length > 2) formattedPhone = `(${formattedPhone.slice(0, 2)}) ${formattedPhone.slice(2)}`
      if (formattedPhone.length > 9) formattedPhone = `${formattedPhone.slice(0, 10)}-${formattedPhone.slice(10)}`

      setFormData(prev => ({ ...prev, phoneNumber: formattedPhone }))
      return
    }

    // Validação de e-mail
    if (name === "email") {
      setFormData(prev => ({ ...prev, email: value }))

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (value.length > 0 && !emailRegex.test(value)) {
        setEmailError("E-mail inválido! Verifique e tente novamente.")
      } else {
        setEmailError(null)
      }

      return
    }

    // Formatação automática do CEP
    if (name === "cep") {
      let formattedCep = value.replace(/\D/g, "")
      if (formattedCep.length > 8) {
        formattedCep = formattedCep.slice(0, 8)
      }

      if (formattedCep.length > 5) {
        formattedCep = `${formattedCep.slice(0, 5)}-${formattedCep.slice(5)}`
      }

      setFormData(prevState => ({
        ...prevState,
        cep: formattedCep
      }))

      if (formattedCep.length === 9) {
        validateCep(formattedCep)
      }

      return
    }

    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCepBlur = async () => {
    if (formData.cep.length === 9) {
      // 9 porque inclui o traço (12345-678)
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${formData.cep.replace("-", "")}/json/`)

        if (response.data.erro) {
          setCepError("CEP inválido. Verifique e tente novamente.")
          return
        }

        setCepError(null) // Remove erro caso o CEP seja válido
        setFormData({
          ...formData,
          street: response.data.logradouro || "",
          neighborhood: response.data.bairro || "",
          city: response.data.localidade || "",
          state: response.data.uf || ""
        })
      } catch (err) {
        console.error("Erro ao buscar CEP", err)
        setCepError("Erro ao validar o CEP. Tente novamente.")
      }
    } else {
      setCepError("CEP inválido. Deve ter 8 dígitos.")
    }
  }

  const validateCep = async cep => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep.replace("-", "")}/json/`)

      if (response.data.erro) {
        setCepError("CEP inválido. Verifique e tente novamente.")
        return
      }

      setCepError(null) // Remove o erro caso o CEP seja válido

      // Mantém o CEP formatado e preenche os outros campos
      setFormData(prevState => ({
        ...prevState,
        street: response.data.logradouro || "",
        neighborhood: response.data.bairro || "",
        city: response.data.localidade || "",
        state: response.data.uf || ""
      }))
    } catch (err) {
      console.error("Erro ao buscar CEP", err)
      setCepError("Erro ao validar o CEP. Tente novamente.")
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    if (!formData.name || !formData.email || !formData.passwordHash || !formData.phoneNumber || !formData.cpf || !formData.gender) {
      setError("Todos os campos obrigatórios devem ser preenchidos.")
      setLoading(false)
      return
    }

    const rawCPF = formData.cpf.replace(/\D/g, "")
    if (rawCPF.length !== 11) {
      setError("CPF inválido. Deve conter exatamente 11 dígitos.")
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, formData)
      console.log("Resposta do servidor:", response.data)

      setSuccess("Usuário cadastrado com sucesso!")

      // Limpa o formulário
      setFormData({
        name: "",
        lastName: "",
        email: "",
        passwordHash: "",
        cpf: "",
        birthDate: "",
        gender: "",
        phoneNumber: "",
        cep: "",
        street: "",
        neighborhood: "",
        number: "",
        city: "",
        state: ""
      })

      // Redireciona para a página de sucesso
      router.push("/cadastro/sucesso")
    } catch (err) {
      console.error("Erro na requisição:", err)

      // Caso a resposta tenha dados de erro, exibe mensagens específicas
      if (err.response) {
        console.error("Status:", err.response.status)
        console.error("Dados do erro:", err.response.data)

        if (err.response.data.message) {
          setError(err.response.data.message)
        } else if (err.response.data.errors) {
          // Se houver múltiplos erros, exibe todos eles
          const errorMessages = Object.values(err.response.data.errors).flat().join(" | ")
          setError(`Erro ao cadastrar: ${errorMessages}`)
        } else {
          setError(`Erro ${err.response.status}: ${err.response.data.title || "Erro ao cadastrar usuário."}`)
        }
      } else if (err.request) {
        console.error("Erro na comunicação com o servidor:", err.request)
        setError("Erro na comunicação com o servidor. Verifique a conexão.")
      } else {
        console.error("Erro desconhecido:", err.message)
        setError("Erro inesperado. Tente novamente.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Cadastro</h2>

        {error && <p className="text-red-600 bg-red-100 p-2 rounded text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seção 1: Dados Pessoais */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">1. Dados Pessoais</h3>
            {/* Nome e Sobrenome */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Nome
                </label>
                <input type="text" name="name" placeholder="Ex: Jasson" value={formData.name} onChange={handleChange} className="input-style" required />
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  Sobrenome
                </label>
                <input type="text" name="lastName" placeholder="Ex: Silva" value={formData.lastName} onChange={handleChange} className="input-style" required />
              </div>
            </div>

            {/* E-mail e CPF */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  E-mail
                </label>
                <input type="email" name="email" placeholder="email@exemplo.com" value={formData.email} onChange={handleChange} className="input-style" required />
                {emailError && <p className="text-sm text-red-600 mt-0.5">{emailError}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="cpf" className="text-sm font-medium text-gray-700">
                  CPF
                </label>
                <input type="text" name="cpf" placeholder="Ex: 123.456.789-00" value={formData.cpf} onChange={handleChange} className="input-style" required />
              </div>
            </div>

            {/* Telefone e Data de Nascimento */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                  Telefone
                </label>
                <input type="text" name="phoneNumber" placeholder="(DDD) 91234-5678" value={formData.phoneNumber} onChange={handleChange} className="input-style" required />
              </div>

              <div className="space-y-2">
                <label htmlFor="birthDate" className="text-sm font-medium text-gray-700">
                  Data de Nascimento
                </label>
                <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="input-style" required />
              </div>
            </div>

            {/* Gênero */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="gender" className="text-sm font-medium text-gray-700">
                  Gênero
                </label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="input-style" required>
                  <option value="">Selecione uma opção</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>
          </div>

          {/* Seção 2: Endereço */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">2. Endereço</h3>
            {/* CEP e Rua */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="cep" className="text-sm font-medium text-gray-700">
                  CEP
                </label>
                <input type="text" name="cep" placeholder="Ex: 12345-678" value={formData.cep} onChange={handleChange} className="input-style" required />
                {cepError && <p className="text-sm text-red-600 mt-0.5">{cepError}</p>}
              </div>
            </div>

            {/* Bairro e Numero */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="neighborhood" className="text-sm font-medium text-gray-700">
                  Bairro
                </label>
                <input type="text" name="neighborhood" placeholder="Ex: Centro" value={formData.neighborhood} onChange={handleChange} className="input-style" readOnly />
              </div>
              <div className="space-y-2">
                <label htmlFor="number" className="text-sm font-medium text-gray-700">
                  Número
                </label>
                <input type="text" name="number" placeholder="Ex: 482" value={formData.number} onChange={handleChange} className="input-style" required />
              </div>
            </div>

            {/* Cidade e Estado */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium text-gray-700">
                  Cidade
                </label>
                <input type="text" name="city" placeholder="Ex: Manaus" value={formData.city} onChange={handleChange} className="input-style" readOnly />
              </div>
              <div className="space-y-2">
                <label htmlFor="state" className="text-sm font-medium text-gray-700">
                  Estado
                </label>
                <input type="text" name="state" placeholder="Ex: AM" value={formData.state} onChange={handleChange} className="input-style" readOnly />
              </div>
            </div>
          </div>

          {/* Seção 3: Senha */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Senha</h3>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} name="passwordHash" placeholder="Digite sua senha" value={formData.passwordHash} onChange={handleChange} className="input-style pr-10" required />
              <button type="button" className="absolute right-3 top-3 text-gray-600 hover:text-gray-800" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Esconder" : "Mostrar"}
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              A senha deve ter pelo menos <strong>6 caracteres</strong>.
            </p>
            {passwordStrength && <p className={`text-sm mt-1 font-semibold ${passwordStrength === "Senha muito curta" ? "text-gray-700" : passwordStrength === "Fraca (adicione números ou símbolos)" ? "text-gray-700" : passwordStrength === "Média (adicione símbolos)" ? "text-gray-700" : "text-gray-700"}`}>{passwordStrength}</p>}
          </div>

          <button type="submit" className="btn-primary">
            {loading ? "Cadastrando..." : "Criar Conta"}
          </button>
        </form>
      </div>
    </div>
  )
}
