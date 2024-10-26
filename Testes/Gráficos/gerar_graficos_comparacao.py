import pandas
import numpy

import matplotlib.pyplot as plot


TAMANHO_FONTE = 16
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

    ax.set_ylim(bottom=0)

    plot.show()


def gerar_graficos_linha(nomes_arquivos, requisicao, nome_chave, legendas):
    TITULO = TITULOS.get(requisicao) or requisicao

    fig, ax = plot.subplots()
    ax.set_title(TITULO)
    ax.set_xlabel('Nº da Requisição')
    ax.set_ylabel('Tempo(ms)')

    for nome_arquivo in nomes_arquivos:
        df = pandas.read_csv(CAMINHO_CSV + nome_arquivo + '.csv')
        df_requisicao = df.loc[df[nome_chave] == requisicao]
        tempos = df_requisicao['tempo(s)'].mul(1000)
        ax.plot(numpy.arange(1, len(tempos) + 1, 1), tempos)
    
    ax.legend(legendas)

    ax.set_xlim(left=0, right=len(tempos) + 1)
    ax.set_xticks(list(ax.get_xticks())[1:-1] + [1, len(tempos)])

    plot.show()


def gerar_graficos(nomes_arquivos, requisicoes, nome_chave, legendas):
    print(f'Gerando gráficos dos arquivos {nomes_arquivos}')

    for requisicao in requisicoes:
        gerar_boxplots(nomes_arquivos, requisicao, nome_chave, legendas)
        gerar_graficos_linha(nomes_arquivos, requisicao, nome_chave, legendas)


def comparar_carregamento():
    gerar_graficos(['carregamento_postgresql', 'carregamento_redis','carregamento_mongodb'],
                   ['armazem', 'setor', 'cliente', 'item', 'estoque'],
                   'tabela',
                   ['PostgreSQL', 'Redis', 'MongoDB'])


def comparar_transacao():
    gerar_graficos(['transacao_postgresql', 'transacao_redis', 'transacao_mongodb'],
                   ['novo_pedido', 'pagamento', 'pedido_entregue', 'entrega', 'nivel_estoque'],
                   'requisicao',
                   ['PostgreSQL', 'Redis', 'MongoDB'])


def main():
    plot.rcParams.update({'font.size': TAMANHO_FONTE})
    
    print('Gerando gráficos...')

    comparar_carregamento()
    comparar_transacao()

if __name__ == '__main__':
    main()