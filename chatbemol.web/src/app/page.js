export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full text-gray-800">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4">Bem-vindo ao ChatBemol</h1>
        <p className="text-gray-600 mb-6">Conectando você ao melhor atendimento omnichannel!</p>

        <div className="flex flex-col gap-4">
          <a href="/cadastro" className="btn-primary">
            Criar Conta
          </a>
          <a href="/login" className="btn-secondary">
            Entrar
          </a>
        </div>
      </div>
    </div>
  )
}
