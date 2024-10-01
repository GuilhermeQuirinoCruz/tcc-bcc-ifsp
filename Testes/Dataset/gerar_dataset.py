import pandas
# import numpy

# Datasets
CAMINHO_DATASET = 'csv/'

QTD_ARMAZEM = 10
QTD_SETOR = QTD_ARMAZEM * 10
QTD_CLIENTE = QTD_SETOR * 10
QTD_ITEM = 100
QTD_ESTOQUE = QTD_ARMAZEM * QTD_ITEM


# Transações
CAMINHO_TRANSACAO = '../Benchmark/csv/'

QTD_PEDIDO = QTD_CLIENTE
QTD_PAGAMENTO = QTD_PEDIDO
QTD_PEDIDO_ENTREGUE = QTD_PEDIDO
QTD_ENTREGA = QTD_PEDIDO
QTD_NIVEL_ESTOQUE = QTD_SETOR


# Geral
TAMANHO_LOTE = 10


def gerar_csv(nome, colunas, caminho, qtd, get_row):
    print('Gerando CSV [' + nome + ']...')

    CAMINHO = caminho + '.csv'

    df = pandas.DataFrame(columns=colunas)
    df.to_csv(CAMINHO, index=False)
    for i in range(qtd):
        df.loc[i % TAMANHO_LOTE] = get_row(i + 1)

        if i % TAMANHO_LOTE == 0 or i == qtd - 1:
            df.to_csv(CAMINHO, mode='a', header=False, index=False)
            df.drop(df.index, inplace=True)

    print('CSV [' + nome + '] gerado')


def get_row_armazem(i):
    return ['Armazem ' + str(i), '10000001', '0.01']

def get_row_setor(i):
    return [((i - 1) // QTD_ARMAZEM) + 1, 'Setor ' + str(i), '10000001', '0.01']

def get_row_cliente(i):
    return [((i - 1) // QTD_ARMAZEM) + 1, 'Cliente ' + str(i), '1000000' + str(i), '11911111111', '10000001']

def get_row_item(i):
    return ['Item ' + str(i), i]

def get_row_estoque(i):
    return [((i - 1) // QTD_ITEM) + 1, ((i - 1) % QTD_ITEM) + 1, '10']


def gerar_dataset_armazem():
    gerar_csv('Armazém', ['nome', 'cep', 'taxa'], CAMINHO_DATASET + 'armazem', QTD_ARMAZEM, get_row_armazem)

def gerar_dataset_setor():
    gerar_csv('Setor', ['idArmazem', 'nome', 'cep', 'taxa'], CAMINHO_DATASET +  'setor', QTD_SETOR, get_row_setor)

def gerar_dataset_cliente():
    gerar_csv('Cliente', ['idSetor', 'nome', 'cnpj', 'telefone', 'cep'], CAMINHO_DATASET +  'cliente', QTD_CLIENTE, get_row_cliente)

def gerar_dataset_item():
    gerar_csv('Item', ['nome', 'precoUnitario'], CAMINHO_DATASET +  'item', QTD_ITEM, get_row_item)

def gerar_dataset_estoque():
    gerar_csv('Estoque', ['idArmazem', 'idItem', 'quantidade'], CAMINHO_DATASET +  'estoque', QTD_ESTOQUE, get_row_estoque)

def gerar_datasets():
    print('Gerando datasets...')

    gerar_dataset_armazem()
    gerar_dataset_setor()
    gerar_dataset_cliente()
    gerar_dataset_item()
    gerar_dataset_estoque()

    print('Datasets gerados')


def get_row_pedido(i):
    str_itens = '['
    for j in range(((i - 1) % 5) + 1):
        str_itens += f'{'{'}id:{(i + j) % QTD_ITEM}, quantidade:{5 if i % 2 == 0 else 10}{'}'},'
    str_itens = str_itens[:-1]
    str_itens += ']'
    
    return [i, str_itens]

def get_row_pagamento(i):
    return ['1000000' + str(i), 100 + i]

def get_row_pedido_entregue(i):
    return [i]

def get_row_entrega(i):
    return [i]

def get_row_nivel_estoque(i):
    return [i]


def gerar_transacao_pedido():
    gerar_csv('Pedido', ['idCliente', 'itens'], CAMINHO_TRANSACAO + 'pedido', QTD_PEDIDO, get_row_pedido)

def gerar_transacao_pagamento():
    gerar_csv('Pagamento', ['cnpj', 'valor'], CAMINHO_TRANSACAO + 'pagamento', QTD_PAGAMENTO, get_row_pagamento)

def gerar_transacao_pedido_entregue():
    gerar_csv('Pedido Entregue', ['idPedido'], CAMINHO_TRANSACAO + 'pedido_entregue', QTD_PEDIDO_ENTREGUE, get_row_pedido_entregue)

def gerar_transacao_entrega():
    gerar_csv('Entrega', ['idPedido'], CAMINHO_TRANSACAO + 'entrega', QTD_ENTREGA, get_row_entrega)

def gerar_transacao_nivel_estoque():
    gerar_csv('Nível Estoque', ['idSetor'], CAMINHO_TRANSACAO + 'nivel_estoque', QTD_NIVEL_ESTOQUE, get_row_nivel_estoque)

def gerar_transacoes():
    print('Gerando transações...')

    gerar_transacao_pedido_entregue()
    gerar_transacao_pagamento()
    gerar_transacao_entrega()
    gerar_transacao_nivel_estoque()
    gerar_transacao_pedido()

    print('Transações geradas')


def main():

    # Simplificar o body das requisições
    # Mudar a estrutura pra branches
    # Gerar as transações certinho
    # Fazer o benchmark
    # Começar a medir os tempos
    # Salvar os resultados
    # Gerar os gráficos
    # Configurar os contêineres

    gerar_datasets()
    gerar_transacoes()

if __name__ == '__main__':
    main()