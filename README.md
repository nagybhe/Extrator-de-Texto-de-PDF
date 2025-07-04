# Extração de Texto de PDFs

## Descrição
Este projeto, desenvolvido em React e Node.js, realiza a extração de texto a partir de arquivos PDF e retorna os dados em formato JSON. É possível selecionar o diretório onde o arquivo está localizado, processar o PDF e gerar automaticamente um arquivo .json com as informações extraídas.

# Licenças
[![License](https://img.shields.io/badge/License-Apache%202.0-yellowgreen.svg)](https://opensource.org/licenses/Apache-2.0) [![Open Source Love svg2](https://badges.frapsoft.com/os/v2/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges)
# Ferramentas e Linguagens Utilizadas
### Ferramentas 🛠️
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/SEUUSERNAME) ![Windows](https://img.shields.io/badge/Windows-000?style=for-the-badge&logo=windows&logoColor=2CA5E0) ![AquaSec](https://img.shields.io/badge/aqua-%231904DA.svg?style=for-the-badge&logo=aqua&logoColor=#0018A8) ![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)

### Linguagens 👩‍💻

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
---
### 📋 Pré-requisitos

- [Node.js](https://nodejs.org/en/download)
- npm

## Estrutura do Projeto
### 📂 Estrutura de Pastas
```bash
project-root/
├── backend/                   # Pasta contendo o código do servidor/API, responsável pela lógica de negócios, processamento de dados e comunicação com o frontend.
│   ├── node_modules/          # Diretório criado pelo npm/Yarn contendo todas as dependências do projeto backend.
│   ├── output/                # Pasta que armazena arquivos gerados pelo backend, como resultados de processamento ou relatórios.
│   ├── pdf/                   # Diretório destinado ao armazenamento ou manipulação de arquivos PDF.
│   ├── temp/                  # Pasta para arquivos temporários gerados durante a execução do backend.
│   ├── uploads/               # Local onde arquivos enviados pelos usuários (upload) são armazenados.
│   ├── eng.traineddata/       # Arquivos de dados treinados para reconhecimento de texto (OCR), em inglês e português, respectivamente.
│   ├── index.js               # Ponto de entrada principal do backend, onde o servidor é inicializado e as rotas são configuradas.
│   ├── package.json           # Arquivo de configuração do Node.js, listando dependências, scripts e metadados do projeto.
│   ├── package-lock.json      # Mantém o controle exato das versões das dependências instaladas.
│   └── por.traineddata        # Arquivos de dados treinados para reconhecimento de texto (OCR), em inglês e português, respectivamente.
│
├── frontend/                  # Aplicação cliente construída em React, responsável pela interface do usuário.
│   ├── node_modules/          # Dependências instaladas para o frontend (React e bibliotecas relacionadas).
│   ├── public/                # Arquivos estáticos públicos, como index.html, imagens ou fonts.
│   ├── src/                   # Código-fonte principal do frontend React:
│   │   ├── App.css            # Estilos CSS do componente principal (App).
│   │   ├── App.js             # Testes unitários para o componente App.
│   │   ├── App.test.js        # Estilos globais aplicados em toda a aplicação.
│   │   ├── index.css          # Estilos globais aplicados em toda a aplicação.
│   │   ├── index.js           # Ponto de entrada do React, onde o aplicativo é renderizado no DOM.
│   │   ├── logo.svg           # Imagem/logo usada na interface.
│   │   ├── reportWebVitals.js # Ferramenta para medir performance da aplicação (ex: tempo de carregamento).
│   │   └── setupTests.js      # Configuração inicial para testes (ex: Jest + React Testing Library).
│   ├── .gitignore             # Define quais arquivos/pastas devem ser ignorados pelo Git (ex: node_modules/).
│   ├── package.json           # Configuração do projeto frontend: dependências, scripts (start, build, test) e metadados.
│   ├── package-lock.json      # Versões exatas das dependências do frontend.
│   └── README.md              # Documentação específica do frontend (como executar, configurar, etc.).
└── README.md                  # Documentação principal do projeto, contendo:
```

## Como Usar
### 1. Instale as dependências no backend/
Antes de rodar o script, instale as dependências necessárias:
```sh
npm install express http cors multer fs path tesseract.js pdf-poppler socket.io
```
### 2. Instale as dependências no frontend/
Antes de rodar o script, instale as dependências necessárias:
```sh
npm npm install react styled-components react-toastify socket.io-client
```

### 3. Execute no backend/
```sh
node index.js
```
### 3. Execute no frontend/
```sh
npm start
```