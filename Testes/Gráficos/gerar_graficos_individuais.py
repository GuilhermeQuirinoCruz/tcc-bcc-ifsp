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


def gerar_graficos(nome_arquivo, requisicoes, nome_chave):
    print('Gerando...')
    df = pandas.read_csv(CAMINHO_CSV + nome_arquivo + '.csv')
    for requisicao in requisicoes:
        df_requisicao = df.loc[df[nome_chave] == requisicao]
        tempos = df_requisicao['tempo(s)'].mul(1000)
        
        TITULO = TITULOS.get(requisicao) or requisicao

        # Histograma
        plot.title(TITULO)
        plot.xlabel('Tempo(ms)')
        plot.ylabel('Operações')

        plot.hist(tempos, bins=50, edgecolor='black', linewidth=0.5)

        plot.show()

        # BoxPlot
        plot.title(TITULO)
        plot.ylabel('Tempo(ms)')
        plot.tick_params(axis='y', which='major', pad=10)

        plot.boxplot([tempos], showmeans=True, showfliers=False, patch_artist=True)

        estatisticas = boxplot_stats(tempos)[0]

        texto_estatistica = f'Média: {estatisticas['mean']}\n'
        texto_estatistica += f'Mediana: {estatisticas['med']}\n'
        texto_estatistica += f'Q1: {estatisticas['q1']}\n'
        texto_estatistica += f'Q3: {estatisticas['q3']}'

        print(texto_estatistica)

        plot.show()

        # Gráfico de linha
        plot.title(TITULO)
        plot.xlabel("Requisição")
        plot.ylabel("Tempo(ms)")

        plot.plot(numpy.arange(0, len(tempos), 1), tempos);

        plot.show()


def gerar_graficos_carregamento():
    gerar_graficos('carregamento', ['armazem', 'setor', 'cliente', 'item', 'estoque'], 'tabela')


def gerar_graficos_transacao():
    gerar_graficos('transacao', ['novo_pedido', 'pagamento', 'pedido_entregue', 'entrega', 'nivel_estoque'], 'requisicao')


def main():
    plot.rcParams.update({'font.size': 14})

    print('Gerando gráficos...')
    gerar_graficos_carregamento()
    gerar_graficos_transacao()

if __name__ == '__main__':
    main()