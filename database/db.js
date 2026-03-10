//Configuração de conexão com o PostgreSQL localmente.

// 1. Avisar ao Node que vamos usar o PostgreSQL
const { Pool } = require('pg'); 

// 2. Carregar variáveis do .env (onde está a senha do Postgres local)
require('dotenv').config();

// 3. Cria a conexão usando a URL que aponta para localhost
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// 4. Exporta para os outros arquivos usarem
module.exports = pool;