import pandas
import numpy

import matplotlib.pyplot as plot
from matplotlib import colors
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


def gerar_graficos(nome_arquivo, requisicoes, nome_chave):
    print('Gerando...')
    df = pandas.read_csv(CAMINHO_CSV + nome_arquivo + '.csv')
    for requisicao in requisicoes:
        df_requisicao = df.loc[df[nome_chave] == requisicao]
        tempos = df_requisicao['tempo(s)'].mul(1000)
        
        TITULO = TITULOS.get(requisicao) or requisicao

        # Histograma
        fig, ax = plot.subplots(1, 1, sharey=True, tight_layout=True)

        ax.set_title(TITULO)
        ax.set_xlabel('Tempo(ms)')
        ax.set_ylabel('Operações')

        ax.hist(tempos, bins=50, edgecolor='black', linewidth=0.5)
        plot.show()

        # BoxPlot
        fig, ax = plot.subplots()

        ax.set_title(TITULO)
        ax.set_ylabel('Tempo(ms)')
        ax.tick_params(axis='y', which='major', pad=50)

        ax.boxplot([tempos], showmeans=True, showfliers=False, patch_artist=True)

        estatisticas = boxplot_stats(tempos)[0]
        media = estatisticas['mean']
        mediana = estatisticas['med']
        q1 = estatisticas['q1']
        q3 = estatisticas['q3']

        texto_estatistica = f'Média: {media}\n'
        texto_estatistica += f'Mediana: {mediana}\n'
        texto_estatistica += f'Q1: {q1}\n'
        texto_estatistica += f'Q3: {q3}'

        print(texto_estatistica)
        # ax.annotate(texto_estatistica, (1.1, q1), bbox=dict(boxstyle="round", fc="0.8"))
        
        # extra_ticks = [media, mediana, q1, q3]
        # ax.set_yticks(list(ax.get_yticks()) + extra_ticks)
        # ax.hlines(extra_ticks, [0] * len(extra_ticks), [1] * len(extra_ticks),
        #           zorder=0)

        plot.show()

        # Gráfico de linha
        plot.plot(numpy.arange(0, len(tempos), 1), tempos);
        plot.title(TITULO)
        plot.xlabel("Requisição")
        plot.ylabel("Tempo(ms)")

        plot.show()


def gerar_graficos_carregamento():
    gerar_graficos('carregamento', ['armazem', 'setor', 'cliente', 'item', 'estoque'], 'tabela')


def gerar_graficos_transacao():
    gerar_graficos('transacao', ['novo_pedido', 'pagamento', 'pedido_entregue', 'entrega', 'nivel_estoque'], 'requisicao')


def main():
    plot.rcParams.update({'font.size': 14})
    print('Gerando gráficos...')
    # gerar_graficos_carregamento()
    gerar_graficos_transacao()

if __name__ == '__main__':
    main()