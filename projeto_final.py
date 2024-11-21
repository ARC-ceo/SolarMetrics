import os
import csv
from datetime import datetime
arquivo_usuarios = "usuarios.txt"

def linha_decorativa():
    print("=" * 40)

linha_decorativa()
print("🎉 Bem-vindo à Solar Metrics! ☀️")
linha_decorativa()

def exibir_menu(nome_usuario):
    while True:  
        linha_decorativa()
        print(f"🎉 Bem-vindo, {nome_usuario}! ☀️")
        linha_decorativa()
        print("Escolha uma das opções abaixo:")
        print("1. Iniciar uma nova métrica")
        print("2. Visualizar última métrica")
        print("3. Apagar usuário")
        print("4. Encerrar aplicativo")  
        linha_decorativa()
        opcao = input("Digite o número da opção desejada: ").strip()
        if opcao in ['1', '2', '3', '4']:  
            print(f"Você escolheu a opção {opcao}.")  
            return opcao  
        else:
            print("Opção inválida. Por favor, escolha 1, 2, 3 ou 4.")

def carregar_usuarios(arquivo):
    usuarios = {}
    if os.path.exists(arquivo):
        with open(arquivo, "r", newline="") as f:
            leitor_csv = csv.reader(f)
            for linha in leitor_csv:
                id_usuario = int(linha[0])
                nome = linha[1]
                instalacao = linha[2]
                relatorio = {
                    "data_inicio": linha[3] if len(linha) > 3 else None,
                    "data_fim": linha[4] if len(linha) > 4 else None,
                    "geracao": linha[5] if len(linha) > 5 else None,
                    "consumo": linha[6] if len(linha) > 6 else None
                }
                usuarios[id_usuario] = {
                    "nome": nome,
                    "instalacao": instalacao,
                    "relatorio": relatorio
                }
    return usuarios


def obter_dados_energia():
    dados_energia = {}
    while True:
        try:
            data_inicio = input("Digite a data de início (formato DD-MM-AAAA): ")
            data_inicio_dt = datetime.strptime(data_inicio, "%d-%m-%Y")
            dados_energia["data_inicio"] = data_inicio
            break
        except ValueError:
            print("Formato de data inválido. Por favor, insira no formato DD-MM-AAAA.")

    while True:
        try:
            data_fim = input("Digite a data de término (formato DD-MM-AAAA): ")
            data_fim_dt = datetime.strptime(data_fim, "%d-%m-%Y")
            
            if data_fim_dt >= data_inicio_dt:
                dados_energia["data_fim"] = data_fim
                break
            else:
                print("A data de término deve ser igual ou posterior à data de início.")
        except ValueError:
            print("Formato de data inválido. Por favor, insira no formato DD-MM-AAAA.")

    while True:
        try:
            geracao = float(input("Digite a quantidade de energia gerada (em kWh): "))
            if geracao >= 0:
                dados_energia["geracao"] = geracao
                break
            else:
                print("A geração de energia não pode ser negativa.")
        except ValueError:
            print("Valor inválido. Por favor, insira um número válido para a geração de energia.")

    while True:
        try:
            consumo = float(input("Digite a quantidade de energia consumida (em kWh): "))
            if consumo >= 0:
                dados_energia["consumo"] = consumo
                break
            else:
                print("O consumo de energia não pode ser negativo.")
        except ValueError:
            print("Valor inválido. Por favor, insira um número válido para o consumo de energia.")
    return dados_energia

def calcular_lucro_e_porcentagem(dados_energia):
    energia_gerada = dados_energia['geracao']
    consumo = dados_energia['consumo']
    while True:
        try:
            valor_kwh = float(input("Digite o valor do kWh em reais: "))
            break  
        except ValueError:
            print("Por favor, digite um número válido.")
    lucro = round(valor_kwh * energia_gerada, 2)
    print(f"Economia gerada: R$ {lucro:.2f}")
    if energia_gerada == 0:
        porcentagem = 0 
    else:
        porcentagem = (consumo / energia_gerada) * 100
    print(f"Porcentagem de uso: {porcentagem:.2f}%")


def registrar_usuario(arquivo, usuarios, nome, instalacao):
    if usuarios:
        proximo_id = max(usuarios.keys()) + 1
    else:
        proximo_id = 1  
    usuarios_info = {
        "nome": nome,
        "instalacao": instalacao,
        "relatorio": {
            "data_inicio": None,
            "data_fim": None,
            "geracao": None,
            "consumo": None
        }
    }
    usuarios[proximo_id] = usuarios_info
    with open(arquivo, "w", newline="") as f:
        escritor_csv = csv.writer(f)
        for id_usuario, dados in usuarios.items():
            escritor_csv.writerow([
                id_usuario,
                dados["nome"],
                dados["instalacao"],
                dados["relatorio"]["data_inicio"],
                dados["relatorio"]["data_fim"],
                dados["relatorio"]["geracao"],
                dados["relatorio"]["consumo"]
            ])
    return usuarios

def adicionar_relatorio(usuarios, id_usuario, dados_energia, arquivo):
    usuarios[id_usuario]["relatorio"] = dados_energia  
    with open(arquivo, "w", newline="") as f:
        escritor_csv = csv.writer(f)
        for id_usuario, dados in usuarios.items():
            escritor_csv.writerow([
                id_usuario,
                dados["nome"],
                dados["instalacao"],
                dados["relatorio"]["data_inicio"],
                dados["relatorio"]["data_fim"],
                dados["relatorio"]["geracao"],
                dados["relatorio"]["consumo"]
            ])

def exibir_relatorio(usuario_atual):
    relatorio = usuario_atual.get("relatorio", {})  
    if relatorio:  
        print("Relatório do usuário:")
        print(f"Data de Início: {relatorio.get('data_inicio', 'Não disponível')}")
        print(f"Data de Fim: {relatorio.get('data_fim', 'Não disponível')}")
        print(f"Geração: {relatorio.get('geracao', 'Não disponível')}")
        print(f"Consumo: {relatorio.get('consumo', 'Não disponível')}")
    else:
        print("Nenhum relatório encontrado para este usuário.")


def buscar_cadastro (usuarios, nome_procurado):
    for id_usuario, info in usuarios.items():
        if info["nome"].lower() == nome_procurado.lower():
            return id_usuario, info
    return None, None


def excluir_usuario(usuarios, id_usuario,arquivo):
    nome_usuario = usuarios[id_usuario]["nome"]
    del usuarios[id_usuario]
    with open(arquivo, "w", newline="") as f:
        escritor_csv = csv.writer(f)
        for id_usuario, dados in usuarios.items():
            escritor_csv.writerow([
                id_usuario,
                dados["nome"],
                dados["instalacao"],
                dados["relatorio"]["data_inicio"],
                dados["relatorio"]["data_fim"],
                dados["relatorio"]["geracao"],
                dados["relatorio"]["consumo"]
            ])
    print(f"Usuário '{nome_usuario}' excluído com sucesso.")
    


#  MAIN 
def main():
    usuarios = carregar_usuarios(arquivo_usuarios)
    nome_usuario = input("Por favor, digite seu nome para continuar: ")
    id_usuario, info_usuario = buscar_cadastro(usuarios, nome_usuario)
    if info_usuario==None:
        linha_decorativa()
        print(f"Olá, {nome_usuario}. Não conseguimos encontrar seu cadastro.")
        print("Vamos fazer seu cadastro agora!")
        nome_instalacao = input("Qual nome você gostaria de colocar para sua instalação solar? ")
        registrar_usuario(arquivo_usuarios,usuarios,nome_usuario,nome_instalacao)
        print(f"Você se cadastrou com sucesso! Nome da instalação: {nome_instalacao}")
        linha_decorativa()
        id_usuario, info_usuario = buscar_cadastro (usuarios, nome_usuario)
    while(True):
        opcao = exibir_menu(nome_usuario)
        if opcao == '1':
            print("Iniciando uma nova métrica...")
            dados_energia = obter_dados_energia()
            adicionar_relatorio(usuarios, id_usuario,dados_energia,arquivo_usuarios)
            linha_decorativa()
            calcular_lucro_e_porcentagem(dados_energia)
        elif opcao == '2':
            print("Visualizando a última métrica...")
            exibir_relatorio(info_usuario)
        elif opcao == '3':
            print("Apagando usuário...")
            excluir_usuario(usuarios,id_usuario,arquivo_usuarios)
            break
        elif opcao == '4':
            print("Aplicativo encerrado. Até logo!")
            break

if __name__ == "__main__":
    main()