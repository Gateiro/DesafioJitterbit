-- Comandos SQL utilizados para criação de tabelas dentro

-- Criação da tabela de Pedidos
CREATE TABLE "Order" (
    "orderId" VARCHAR(50) PRIMARY KEY,
    "value" INTEGER NOT NULL,
    "creationDate" TIMESTAMP NOT NULL
);

-- Criação da tabela de Itens
CREATE TABLE "Items" (
    "orderId" VARCHAR(50) REFERENCES "Order"("orderId") ON DELETE CASCADE,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL
);