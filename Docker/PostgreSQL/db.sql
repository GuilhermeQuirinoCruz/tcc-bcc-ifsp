CREATE DATABASE tpc;

\c tpc

CREATE TABLE armazem(
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    cep CHAR(8),
    taxa DECIMAL(10, 2)
);

CREATE TABLE item(
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco_unitario DECIMAL(10, 2)
);

CREATE TABLE estoque(
    id_armazem INT REFERENCES armazem(id),
    id_item INT REFERENCES item(id),
    quantidade INT,
    PRIMARY KEY (id_armazem, id_item)
);

CREATE TABLE setor(
    id SERIAL PRIMARY KEY,
    id_armazem INT REFERENCES armazem(id),
    nome VARCHAR(50),
    cep CHAR(8),
    taxa DECIMAL(10, 2),
    saldo DECIMAL(10, 2)
);

CREATE TABLE cliente(
    id SERIAL PRIMARY KEY,
    id_setor INT REFERENCES setor(id),
    nome VARCHAR(150) NOT NULL,
    cnpj VARCHAR(14) UNIQUE NOT NULL,
    telefone VARCHAR(15),
    cep CHAR(8),
    data_registro DATE,
    saldo DECIMAL(10, 2)
);

CREATE TABLE pagamento(
    id SERIAL PRIMARY KEY,
    id_cliente INT REFERENCES cliente(id),
    data DATE,
    valor DECIMAL(10, 2)
);

CREATE TABLE pedido(
    id SERIAL PRIMARY KEY,
    id_cliente INT REFERENCES cliente(id),
    data DATE,
    entregue BOOLEAN
);

CREATE TABLE item_pedido(
    id_item INT REFERENCES item(id),
    id_pedido INT REFERENCES pedido(id),
    quantidade INT,
    PRIMARY KEY (id_item, id_pedido)
);