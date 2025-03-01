# Extração de Texto de PDFs

## Descrição
Este script em Node.js realiza a extração de texto de arquivos PDF e os salva como arquivos `.txt`. Ele percorre um diretório especificado, processa cada PDF encontrado e gera um arquivo de texto correspondente.

## Tecnologias Utilizadas
- **Node.js**: Ambiente de execução para JavaScript no servidor.
- **fs (File System)**: Manipula arquivos e diretórios.
- **path**: Gerencia caminhos de arquivos no sistema.
- **pdf-parse**: Biblioteca para extração de texto de PDFs.

## Estrutura do Projeto
```
/project-root
│── pdf/               # Diretório contendo os arquivos PDF
│── script.js          # Script principal para extração
```

## Como Usar
### 1. Instale as dependências
Antes de rodar o script, instale as dependências necessárias:
```sh
npm install pdf-parse
```

### 2. Execute o script
```sh
node index.js
```

O script irá procurar arquivos PDF no diretório `./pdf/`, extrair o texto de cada um e salvar um arquivo `.txt` correspondente no mesmo diretório.

## Funcionamento
1. Lista todos os arquivos PDF dentro do diretório `./pdf/`.
2. Para cada arquivo PDF:
   - Lê o conteúdo binário.
   - Extrai o texto utilizando `pdf-parse`.
   - Salva o texto extraído em um arquivo `.txt` com o mesmo nome do PDF.
3. Exibe logs do progresso.

## Exemplo de Saída no Console
```
2 arquivo(s) PDF encontrado(s).
Processando "documento1.pdf"...
Texto extraído de "documento1.pdf" e salvo como "documento1.txt".
Processando "documento2.pdf"...
Texto extraído de "documento2.pdf" e salvo como "documento2.txt".
Processamento concluído!
```

## Possíveis Erros
- **Nenhum PDF encontrado**: O diretório `./pdf/` pode estar vazio.
- **Erro ao ler o PDF**: O arquivo pode estar corrompido ou protegido por senha.

