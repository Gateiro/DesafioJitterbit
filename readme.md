# API de Gestão de Pedidos - Teste Técnico

Esta é uma API RESTful desenvolvida em **Node.js** com **Express** e **PostgreSQL** . A aplicação permite gerir pedidos e os seus respetivos itens, realizando operações de criação, leitura, atualização e exclusão (CRUD).

## 🚀 Tecnologias Utilizadas

* **Node.js**: Ambiente de execução JavaScript.
* **Express**: Framework para a construção de rotas e APIs.
* **PostgreSQL**: Banco de dados relacional para persistência de dados.
* **node-postgres (pg)**: Driver de ligação ao PostgreSQL.
* **dotenv**: Gestão de variáveis de ambiente.

## 📂 Estrutura do Projeto

* `index.js`: Ponto de entrada da aplicação e configuração do servidor.
* `routes/`: Definição das rotas da API.
* `controllers/`: Lógica de negócio e interação com o banco de dados.
* `database/`: Configurações de conexão e scripts SQL.
* `.env`: Ficheiro para armazenamento de credenciais e variáveis sensíveis.

## 🛠️ Instalação e Configuração

### Pré-requisitos
* Node.js instalado.
* PostgreSQL instalado e em execução localmente.

### 1. Instalar dependências
No terminal, dentro da pasta do projeto, execute:
```bash
npm install

```

### 2. Configurar o Banco de Dados

Crie um banco de dados no seu PostgreSQL local (ex: `teste_entrevista`) e execute o script presente em `database/schema.sql` para criar as tabelas necessárias:

```sql
CREATE TABLE "Order" (
    "orderId" VARCHAR(50) PRIMARY KEY,
    "value" INTEGER NOT NULL,
    "creationDate" TIMESTAMP NOT NULL
);

CREATE TABLE "Items" (
    "orderId" VARCHAR(50) REFERENCES "Order"("orderId") ON DELETE CASCADE,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL
);

```

### 3. Variáveis de Ambiente

Crie um ficheiro `.env` na raiz do projeto com a sua URL de conexão (substitua pelos seus dados):

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/teste_entrevista

```

### 4. Iniciar o Servidor

```bash
node index.js

```

O servidor será iniciado em `http://localhost:3000`.

## 📡 Endpoints da API

| Método | Endpoint | Descrição |
| --- | --- | --- |
| **POST** | `/order` | Cria um novo pedido e os seus itens (mapeamento de PT para EN). |
| **GET** | `/order/list/all` | Lista todos os pedidos registados. |
| **GET** | `/order/id` | Procura um pedido específico pelo ID passado na URL. |
| **PUT** | `/order/id` | Atualiza os dados (valor ou data) de um pedido existente. |
| **DELETE** | `/order/id` | Remove um pedido e os seus itens associados. |

### Exemplo de JSON para Criação (POST)

```json
{
  "numeroPedido": "v10089015vdb",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11Z",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}

```
