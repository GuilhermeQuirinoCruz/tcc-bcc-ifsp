import pandas
import requests
import json
import time

CAMINHO_CSV = 'csv/'
TAMANHO_CHUNK = 4
LINK_API = 'http://localhost:3000/api/'

COLUNAS = ['tabela', 'tempo(s)']
CAMINHO_RESULTADO = '../Benchmark/csv/carregamento.csv'

def fazer_requisicoes(nome_arquivo):
    ENDPOINT = LINK_API + nome_arquivo

    for chunk in pandas.read_csv(CAMINHO_CSV + nome_arquivo + '.csv', chunksize=TAMANHO_CHUNK):
        resultados = []
        for row in chunk.iterrows():
            parametros = json.loads(row[1].to_json())

            inicio = time.perf_counter()
            
            requests.post(ENDPOINT, json=parametros)

            fim = time.perf_counter()
            
            resultados.append([nome_arquivo, fim - inicio])

        df = pandas.DataFrame(resultados, columns=COLUNAS)
        df.to_csv(CAMINHO_RESULTADO, mode='a', header=False, index=False)


def main():
    df = pandas.DataFrame(columns=COLUNAS)
    df.to_csv(CAMINHO_RESULTADO, index=False)
    
    fazer_requisicoes('armazem')
    fazer_requisicoes('setor')
    fazer_requisicoes('cliente')
    fazer_requisicoes('item')
    fazer_requisicoes('estoque')

if __name__ == '__main__':
    main()