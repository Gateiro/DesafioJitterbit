const pool = require('../database/db');

// --- 1. CRIAR UM NOVO PEDIDO (POST /order) ---
const createOrder = async (req, res) => {
    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    // Validação inicial (Erro 400 - Bad Request)
    if (!numeroPedido || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ 
            error: "Dados inválidos. O número do pedido e uma lista de itens são obrigatórios." 
        });
    }

    const client = await pool.connect(); // Obtém conexão para criação

    try {
        await client.query('BEGIN'); // Inicia a inserção de segurança

        const orderId = numeroPedido;
        const value = valorTotal;
        const creationDate = dataCriacao ? new Date(dataCriacao).toISOString() : new Date().toISOString();

        // Inserção do Pedido
        const insertOrderQuery = `INSERT INTO "Order" ("orderId", "value", "creationDate") VALUES ($1, $2, $3)`;
        await client.query(insertOrderQuery, [orderId, value, creationDate]);

        const mappedItems = [];
        for (const item of items) {
            const productId = parseInt(item.idItem);
            const quantity = item.quantidadeItem;
            const price = item.valorItem;

            if (isNaN(productId)) throw new Error("ID do item inválido");

            const insertItemQuery = `INSERT INTO "Items" ("orderId", "productId", "quantity", "price") VALUES ($1, $2, $3, $4)`;
            await client.query(insertItemQuery, [orderId, productId, quantity, price]);

            mappedItems.push({ productId, quantity, price });
        }

        await client.query('COMMIT'); // Finaliza com sucesso

        // Resposta 201 (Created)
        return res.status(201).json({ orderId, value, creationDate, items: mappedItems });

    } catch (error) {
        await client.query('ROLLBACK'); // Desfaz tudo em caso de erro
        
        // Trata erro de ID duplicado já que não há autoincremento nessas tabelas (Código 23505 do Postgres)
        if (error.code === '23505') {
            return res.status(409).json({ error: "Conflito: Já existe um pedido com este número." });
        }

        console.error("Erro ao criar pedido:", error);
        return res.status(500).json({ error: "Erro interno ao processar o pedido. Tente novamente mais tarde." });
    } finally {
        client.release(); // Libera a conexão
    }
};

// --- 2. OBTER DADOS DO PEDIDO (GET /order/:id) ---
const getOrderById = async (req, res) => {
    const { id } = req.params;

    try {
        const orderResult = await pool.query('SELECT * FROM "Order" WHERE "orderId" = $1', [id]);

        // Erro 404 (Not Found) se não existir
        if (orderResult.rows.length === 0) {
            return res.status(404).json({ error: "Pedido não encontrado." });
        }

        const order = orderResult.rows[0];
        const itemsResult = await pool.query('SELECT "productId", "quantity", "price" FROM "Items" WHERE "orderId" = $1', [id]);

        return res.status(200).json({
            orderId: order.orderId,
            value: order.value,
            creationDate: order.creationDate,
            items: itemsResult.rows
        });

    } catch (error) {
        console.error("Erro ao buscar pedido:", error);
        return res.status(500).json({ error: "Erro na comunicação com o banco de dados." });
    }
};

// --- 3. LISTAR TODOS (GET /order/list/all) ---
const listOrders = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Order" ORDER BY "creationDate" DESC');
        return res.status(200).json(result.rows);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao listar os pedidos." });
    }
};

// --- 4. DELETAR UM PEDIDO (DELETE /order/:id) ---
const deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM "Order" WHERE "orderId" = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "O pedido informado não existe." });
        }

        // 200 OK com mensagem clara de sucesso
        return res.status(200).json({ message: `Pedido ${id} removido com sucesso.` });
    } catch (error) {
        return res.status(500).json({ error: "Falha ao tentar remover o pedido." });
    }
};

// --- 5. ATUALIZAR UM PEDIDO (PUT /order/:id) ---
const updateOrder = async (req, res) => {
    const { id } = req.params;
    const { valorTotal, dataCriacao } = req.body;

    // Validação: Ao menos um campo deve ser enviado para atualizar
    if (valorTotal === undefined && !dataCriacao) {
        return res.status(400).json({ error: "Informe ao menos um campo para atualizar (valorTotal ou dataCriacao)." });
    }

    try {
        // 1. Verificar se o pedido existe
        const checkOrder = await pool.query('SELECT * FROM "Order" WHERE "orderId" = $1', [id]);
        if (checkOrder.rows.length === 0) {
            return res.status(404).json({ error: "Pedido não encontrado para atualização." });
        }

        // 2. Montar o comando SQL
        // Atualizar os campos enviados
        const newValue = valorTotal !== undefined ? valorTotal : checkOrder.rows[0].value;
        const newDate = dataCriacao ? new Date(dataCriacao).toISOString() : checkOrder.rows[0].creationDate;

        const updateQuery = `
            UPDATE "Order" 
            SET "value" = $1, "creationDate" = $2 
            WHERE "orderId" = $3
        `;
        
        await pool.query(updateQuery, [newValue, newDate, id]);

        // Retorna o Status 200 com os dados atualizados
        return res.status(200).json({
            message: "Pedido atualizado com sucesso.",
            updatedData: {
                orderId: id,
                value: newValue,
                creationDate: newDate
            }
        });

    } catch (error) {
        console.error("Erro ao atualizar pedido:", error);
        return res.status(500).json({ error: "Erro interno ao tentar atualizar o pedido." });
    }
};

module.exports = { createOrder, getOrderById, listOrders, deleteOrder, updateOrder };