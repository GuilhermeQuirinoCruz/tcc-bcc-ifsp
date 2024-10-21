import pandas
import numpy

import matplotlib.pyplot as plot
from matplotlib.cbook import boxplot_stats


CAMINHO_CSV = 'resultados/'
TITULOS = {
    'armazem': 'Armazém',
    'setor': 'Setor',
    'cliente': 'Cliente',
    'item': 'Item',
    'estoque': 'Estoque',
    'novo_pedido': 'Novo Pedido',
    'pagamento': 'Pagamento',
    'pedido_entregue': 'Pedido Entregue',
    'entrega': 'Entrega',
    'nivel_estoque': 'Nível Estoque'
}


def gerar_boxplots(nomes_arquivos, requisicao, nome_chave, legendas):
    TITULO = TITULOS.get(requisicao) or requisicao

    fig, ax = plot.subplots()
    ax.set_title(TITULO)
    ax.set_ylabel('Tempo(ms)')

    tempos = []
    for nome_arquivo in nomes_arquivos:
        df = pandas.read_csv(CAMINHO_CSV + nome_arquivo + '.csv')
        df_requisicao = df.loc[df[nome_chave] == requisicao]
        tempos.append(df_requisicao['tempo(s)'].mul(1000))
    
    ax.boxplot(tempos, showmeans=True, showfliers=False, patch_artist=True)
    ax.set_xticklabels(legendas)

    plot.show()


def gerar_graficos_linha(nomes_arquivos, requisicao, nome_chave, legendas):
    TITULO = TITULOS.get(requisicao) or requisicao

    fig, ax = plot.subplots()
    ax.set_title(TITULO)
    ax.set_xlabel('Requisição')
    ax.set_ylabel('Tempo(ms)')

    for nome_arquivo in nomes_arquivos:
        df = pandas.read_csv(CAMINHO_CSV + nome_arquivo + '.csv')
        df_requisicao = df.loc[df[nome_chave] == requisicao]
        tempos = df_requisicao['tempo(s)'].mul(1000)
        ax.plot(numpy.arange(0, len(tempos), 1), tempos)
    
    ax.legend(legendas)

    plot.show()


def gerar_graficos(nomes_arquivos, requisicoes, nome_chave, legendas):
    print('Gerando...')
    for requisicao in requisicoes:
        gerar_boxplots(nomes_arquivos, requisicao, nome_chave, legendas)
        gerar_graficos_linha(nomes_arquivos, requisicao, nome_chave, legendas)


def comparar_carregamento():
    gerar_graficos(['carregamento_postgresql', 'carregamento_mongodb','carregamento_redis'],
                   ['armazem', 'setor', 'cliente', 'item', 'estoque'],
                   'tabela',
                   ['PostgreSQL', 'MongoDB', 'Redis'])


def comparar_transacao():
    gerar_graficos(['transacao_postgresql', 'transacao_mongodb', 'transacao_redis'],
                   ['novo_pedido', 'pagamento', 'pedido_entregue', 'entrega', 'nivel_estoque'],
                   'requisicao',
                   ['PostgreSQL', 'MongoDB', 'Redis'])


def main():
    plot.rcParams.update({'font.size': 14})
    
    print('Gerando gráficos...')
    comparar_carregamento()
    comparar_transacao()

if __name__ == '__main__':
    main()