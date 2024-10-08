import pandas
import requests
import json

CSV_PATH = 'csv/'
CHUNK_SIZE = 4
LINK = 'http://localhost:3000/api'

def fazer_requisicoes(nome_arquivo):
    for chunk in pandas.read_csv(CSV_PATH + nome_arquivo + '.csv', chunksize=CHUNK_SIZE):
        for row in chunk.iterrows():
            parametros = json.loads(row[1].to_json())
            endpoint = LINK + parametros['endpoint']
            del parametros['endpoint']

            r = requests.post(endpoint, json=parametros)

def carregar_armazem():
    fazer_requisicoes('armazem')

def carregar_setor():
    fazer_requisicoes('setor')

def carregar_cliente():
    fazer_requisicoes('cliente')

def carregar_item():
    fazer_requisicoes('item')

def carregar_estoque():
    fazer_requisicoes('estoque')

def main():
    carregar_armazem()
    carregar_setor()
    carregar_cliente()
    carregar_item()
    carregar_estoque()

if __name__ == '__main__':
    main()