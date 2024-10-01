import pandas
import requests
import json

CAMINHO_CSV = 'csv/'
TAMANHO_CHUNK = 4
LINK_API = 'http://localhost:3000/api/'

def fazer_requisicoes(nome_arquivo):
    ENDPOINT = LINK_API + nome_arquivo
    for chunk in pandas.read_csv(CAMINHO_CSV + nome_arquivo + '.csv', chunksize=TAMANHO_CHUNK):
        for row in chunk.iterrows():
            parametros = json.loads(row[1].to_json())

            requests.post(ENDPOINT, json=parametros)


def main():
    fazer_requisicoes('armazem')
    fazer_requisicoes('setor')
    fazer_requisicoes('cliente')
    fazer_requisicoes('item')
    fazer_requisicoes('estoque')

if __name__ == '__main__':
    main()