import pandas
import requests
import json
import time

CAMINHO_CSV = 'csv/'
TAMANHO_CHUNK = 10
LINK_API = 'http://localhost:3000/api/transacao/'

COLUNAS = ['requisicao', 'tempo(s)']
CAMINHO_RESULTADO = CAMINHO_CSV + 'transacao.csv'

def fazer_requisicoes(nome_arquivo):
    ENDPOINT = LINK_API + nome_arquivo
    REQUISICAO_GET = nome_arquivo in ['pedido_entregue', 'nivel_estoque']

    for chunk in pandas.read_csv(CAMINHO_CSV + nome_arquivo + '.csv', chunksize=TAMANHO_CHUNK):
        resultados = []
        for row in chunk.iterrows():
            parametros = json.loads(row[1].to_json())
            if 'itens' in parametros:
                parametros['itens'] = parametros['itens'].replace('id:', f'"id":').replace('quantidade', f'"quantidade"')
                parametros['itens'] = json.loads(parametros['itens'])
            
            inicio = time.perf_counter()

            if REQUISICAO_GET:
                requests.get(ENDPOINT, json=parametros)
            else:
                requests.post(ENDPOINT, json=parametros)
            
            fim = time.perf_counter()
            
            resultados.append([nome_arquivo, fim - inicio])
        
        df = pandas.DataFrame(resultados, columns=COLUNAS)
        df.to_csv(CAMINHO_RESULTADO, mode='a', header=False, index=False)


def main():
    df = pandas.DataFrame(columns=COLUNAS)
    df.to_csv(CAMINHO_RESULTADO, index=False)

    fazer_requisicoes('novo_pedido')
    fazer_requisicoes('pagamento')
    fazer_requisicoes('pedido_entregue')
    fazer_requisicoes('entrega')
    fazer_requisicoes('nivel_estoque')

if __name__ == '__main__':
    main()