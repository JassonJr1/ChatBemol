# ChatBemol

Sistema de cadastro de usuários desenvolvido como parte do desafio técnico da Bemol Digital.  
O projeto utiliza **Next.js (Frontend)** e **.NET + SQL Server (Backend)**.

## Tecnologias Utilizadas

- Frontend: [Next.js](https://nextjs.org/) com Tailwind CSS
- Backend: [ASP.NET Core](https://dotnet.microsoft.com/) com Entity Framework Core
- Banco de dados: SQL Server
- API de CEP: [ViaCEP](https://viacep.com.br/)

---

## Funcionalidades

- Cadastro de usuário com validações completas (e-mail, CPF, telefone, senha, CEP, etc.)
- Validação automática de endereço via CEP (usando a API do ViaCEP)
- Login com e-mail e senha
- Visualização dos dados do usuário logado
- Redirecionamento pós-cadastro e pós-login
- Validações visuais e responsivas com Tailwind CSS
- Interface adaptada com base no visual da Bemol

---

## Diagramas em C4 Model

### 1. Visão da Infraestrutura

![Diagrama de Infraestrutura](Diagrams/Infraestrutura%20-%20C4%20Diagram.png)

### 2. Design da Solução

![Diagrama de Design da Solução](Diagrams/Design%20-%20C4%20Diagram.png)

---

## Como rodar o projeto localmente

### Requisitos

- Node.js (v18 ou superior)
- .NET 7 ou superior
- SQL Server (local ou remoto)

---

### 1. Clonar o projeto

```bash
git clone https://github.com/seu-usuario/chatbemol.git
cd chatbemol
```

---

### 2. Configuração do Banco de Dados

Crie o arquivo `ChatBemol.Api/appsettings.Development.json` com base no modelo abaixo:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=ChatBemolDB;User Id=seu_usuario;Password=sua_senha;TrustServerCertificate=True;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

Você também pode copiar o arquivo ![appsettings.Development.json.example](ChatBemol.Api/appsettings.Development.json.example) e renomear para appsettings.Development.json.

---

### 3. Rodar o Backend

```bash
cd ChatBemol.Api
dotnet restore
dotnet ef database update
dotnet run
```

A API será executada em: `http://localhost:5189`

---

### 4. Configurar variáveis de ambiente

Antes de rodar o frontend, crie um arquivo chamado `.env.local` dentro da pasta `chatbemol.web` com o seguinte conteúdo:

```env
NEXT_PUBLIC_API_URL=http://localhost:5189
```

Essa variável define a URL base da API utilizada pelo frontend.
Se você estiver rodando o backend em uma porta diferente, atualize esse valor conforme necessário.

---

### 5. Rodar o Frontend

```bash
cd chatbemol.web
npm install
npm run dev
```

O frontend será executado em: `http://localhost:3000`

---

## Questionario

As respostas para as perguntas do desafio podem ser encontradas [aqui](Questionario.md)
