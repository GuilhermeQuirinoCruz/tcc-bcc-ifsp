import pandas
import numpy

import matplotlib.pyplot as plot
# from matplotlib import colors
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


def gerar_boxplots(nomes_arquivos, requisicao, nome_chave):
    TITULO = TITULOS.get(requisicao) or requisicao

    for nome_arquivo in nomes_arquivos:
        df = pandas.read_csv(CAMINHO_CSV + nome_arquivo + '.csv')
        df_requisicao = df.loc[df[nome_chave] == requisicao]
        tempos = df_requisicao['tempo(s)'].mul(1000)

        plot.title(TITULO)
        plot.ylabel('Tempo(ms)')

        plot.boxplot([tempos], showmeans=True, showfliers=False, patch_artist=True)
    
    plot.legend(nomes_arquivos)

    plot.show()


def gerar_graficos(nomes_arquivos, requisicoes, nome_chave):
    print('Gerando...')

    # BoxPlot

    for requisicao in requisicoes:
        gerar_boxplots(nomes_arquivos, requisicao, nome_chave)

        # Histograma
        # plot.title(TITULO)
        # plot.xlabel('Tempo(ms)')
        # plot.ylabel('Operações')

        # plot.hist(tempos, bins=50, edgecolor='black', linewidth=0.5)

        # plot.show()

        # BoxPlot
        # plot.title(TITULO)
        # plot.ylabel('Tempo(ms)')
        # plot.tick_params(axis='y', which='major', pad=10)

        # plot.boxplot([tempos], showmeans=True, showfliers=False, patch_artist=True)

        # estatisticas = boxplot_stats(tempos)[0]

        # texto_estatistica = f'Média: {estatisticas['mean']}\n'
        # texto_estatistica += f'Mediana: {estatisticas['med']}\n'
        # texto_estatistica += f'Q1: {estatisticas['q1']}\n'
        # texto_estatistica += f'Q3: {estatisticas['q3']}'

        # print(texto_estatistica)

        # plot.show()

        # Gráfico de linha
        # plot.title(TITULO)
        # plot.xlabel("Requisição")
        # plot.ylabel("Tempo(ms)")

        # plot.plot(numpy.arange(0, len(tempos), 1), tempos);

        # plot.show()


def comparar_carregamento():
    gerar_graficos(['carregamento_postgresql', 'carregamento_mongodb','carregamento_redis'],
                   ['armazem', 'setor', 'cliente', 'item', 'estoque'],
                   'tabela')


def comparar_transacao():
    gerar_graficos(['transacao_postgresql', 'transacao_mongodb', 'transacao_redis'],
                   ['novo_pedido', 'pagamento', 'pedido_entregue', 'entrega', 'nivel_estoque'],
                   'requisicao')


def main():
    plot.rcParams.update({'font.size': 14})
    
    print('Gerando gráficos...')
    comparar_carregamento()
    # comparar_transacao()

if __name__ == '__main__':
    main()