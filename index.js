const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

// Diretório contendo os PDFs
const pdfDirectory = './pdf';

// Função para listar arquivos no diretório
function listPDFsInDirectory(directory) {
    return fs
        .readdirSync(directory)
        .filter((file) => path.extname(file).toLowerCase() === 'pdf');
}

// Função para processar cada PDF
async function processPDF(filePath) {
    try {
        const dataBuffer = fs.readFileSync(filePath);

        // Extrai o texto do PDF
        const pdfData = await pdfParse(dataBuffer);

        const fileName = path.basename(filePath, '.pdf');
        const outputFilePath = path.join(pdfDirectory, `${fileName}.txt`);

        // Salva o texto extraído em um arquivo .txt
        fs.writeFileSync(outputFilePath, pdfData.text);

        // Log do progresso
        console.log(`Texto extraído de "${fileName}.pdf" e salvo como "${fileName}.txt".`);
    } catch (error) {
        console.error(`Erro ao processar "${filePath}":`, error.message);
    }
}

// Função para processar todos os PDFs no diretório
async function processAllPDFsInDirectory(directory) {
    const pdfFiles = listPDFsInDirectory(directory);

    if (pdfFiles.length === 0) {
        console.log('Nenhum arquivo PDF encontrado no diretório.');
        return;
    }

    console.log(`${pdfFiles.length} arquivo(s) PDF encontrado(s).`);
    for (const file of pdfFiles) {
        const filePath = path.join(directory, file);
        console.log(`Processando "${file}"...`);
        await processPDF(filePath);
    }
    console.log('Processamento concluído!');
}

// Inicia o processamento
processAllPDFsInDirectory(pdfDirectory);
