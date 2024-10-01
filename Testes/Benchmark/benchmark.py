import pandas
import requests
import json

CAMINHO_CSV = 'csv/'
TAMANHO_CHUNK = 10
LINK_API = 'http://localhost:3000/api/transacao'

def fazer_requisicoes(nome_arquivo):
    for chunk in pandas.read_csv(CAMINHO_CSV + nome_arquivo + '.csv', chunksize=TAMANHO_CHUNK):
        for row in chunk.iterrows():
            parametros = json.loads(row[1].to_json())
            if 'itens' in parametros:
                parametros['itens'] = parametros['itens'].replace('id:', f'"id":').replace('quantidade', f'"quantidade"')
            
            endpoint = LINK_API + parametros['endpoint']
            del parametros['endpoint']
            
            requests.post(endpoint, json=parametros)

def main():
    fazer_requisicoes('pedido')

if __name__ == '__main__':
    main()