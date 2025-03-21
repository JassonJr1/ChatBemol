export default function CadastroSucesso() {
  return (
    <div className="flex flex-col items-center justify-center w-full text-gray-800">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-green-600">Cadastro Concluído!</h1>
        <p className="text-gray-600 mb-6">Seu cadastro foi realizado com sucesso.</p>

        <a href="/" className="btn-primary">
          Ir para a Página Inicial
        </a>
      </div>
    </div>
  )
}
