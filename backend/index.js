// backend/index.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');
const pdfPoppler = require('pdf-poppler');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});

const PORT = 3001;

// Diretórios
const tempDirectory = './temp';
const uploadDirectory = './uploads';

// Cria diretórios se não existirem
for (const dir of [tempDirectory, uploadDirectory]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
}

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do Multer
const storage = multer.diskStorage({
    destination: uploadDirectory,
    filename: (req, file, cb) => {
        const filename = `${Date.now()}-${file.originalname}`;
        console.log(`Arquivo recebido para upload: ${filename}`);
        cb(null, filename);
    }
});
const upload = multer({ storage });

// OCR com envio de progresso via socket (com controle a cada 10%)
async function ocrImage(imagePath, socket) {
    let lastEmittedProgress = -10; // para controlar os múltiplos de 10%

    return Tesseract.recognize(imagePath, 'por', {
        logger: m => {
            if (socket && m.status === 'recognizing text') {
                const progress = Math.floor(m.progress * 100);
                if (progress % 10 === 0 && progress !== lastEmittedProgress) {
                    lastEmittedProgress = progress;
                    socket.emit('ocrProgress', { image: path.basename(imagePath), progress });
                    process.stdout.write(`\r🧠 OCR: ${progress}% `);
                }
            }
        }
    }).then(result => {
        // Envia 100% no fim para garantir
        if (socket) socket.emit('ocrProgress', { image: path.basename(imagePath), progress: 100 });
        return result.data.text.trim();
    });
}

// Funções para extrair dados
function extrairCPF(texto) {
    const match = texto.match(/\d{3}[.\s]?\d{3}[.\s]?\d{3}[-\s]?\d{2}/);
    return match ? match[0].replace(/[^\d]/g, '') : null;
}
function extrairDataNascimento(texto) {
    const match = texto.match(/(\d{2}\/\d{2}\/\d{4})/);
    return match ? match[0] : null;
}
function extrairNome(texto) {
    const linhas = texto.split('\n');
    for (const linha of linhas) {
        if (linha.toLowerCase().includes('nome') && !linha.toLowerCase().includes('assinatura')) {
            const partes = linha.split(':');
            if (partes.length > 1) return partes[1].trim();
        }
    }
    return null;
}
function extrairTipoCertidao(texto) {
    if (/nascimento/i.test(texto)) return 'Nascimento';
    if (/casamento/i.test(texto)) return 'Casamento';
    if (/óbito|obito/i.test(texto)) return 'Óbito';
    return 'Desconhecido';
}
function extrairInformacoes(textoOCR) {
    return {
        nome: extrairNome(textoOCR),
        cpf: extrairCPF(textoOCR),
        dataNascimento: extrairDataNascimento(textoOCR),
        tipoCertidao: extrairTipoCertidao(textoOCR)
    };
}

// Rota upload + processamento PDF -> imagens -> OCR
app.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file;
    const socketId = req.headers['x-socket-id'];
    const socket = io.sockets.sockets.get(socketId);

    if (!file || path.extname(file.originalname).toLowerCase() !== '.pdf') {
        console.log('Arquivo inválido recebido.');
        return res.status(400).json({ error: 'Arquivo inválido. Envie um PDF.' });
    }

    console.log(`Processando arquivo PDF: ${file.filename}`);

    const fileName = path.basename(file.filename, '.pdf');
    const options = {
        format: 'jpeg',
        out_dir: tempDirectory,
        out_prefix: fileName,
        page: null,
        dpi: 300
    };

    try {
        console.log('Convertendo PDF para imagens...');
        await pdfPoppler.convert(file.path, options);
        console.log('Conversão concluída.');
    } catch (err) {
        console.error(`Erro ao converter PDF: ${err.message}`);
        return res.status(500).json({ error: `Erro ao converter PDF: ${err.message}` });
    }

    const imageFiles = fs
        .readdirSync(tempDirectory)
        .filter(f => f.startsWith(fileName) && f.endsWith('.jpg'))
        .sort();

    if (imageFiles.length === 0) {
        console.log('Nenhuma imagem gerada para OCR.');
        return res.status(500).json({ error: 'Nenhuma imagem gerada para OCR.' });
    }

    const jsonResult = {
        arquivo: file.originalname,
        paginas: []
    };

    let textoCompleto = '';

    for (let i = 0; i < imageFiles.length; i++) {
        const image = imageFiles[i];
        const imagePath = path.join(tempDirectory, image);
        console.log(`Iniciando OCR da página ${i + 1}`);
        const text = await ocrImage(imagePath, socket);
        jsonResult.paginas.push({
            pagina: i + 1,
            texto: text
        });
        textoCompleto += text + '\n\n';
        fs.unlinkSync(imagePath);
        console.log(`Imagem temporária removida: ${image}`);
    }

    jsonResult.dadosExtraidos = extrairInformacoes(textoCompleto);
    fs.unlinkSync(file.path);
    console.log(`Arquivo PDF original removido: ${file.filename}`);

    console.log('Processamento finalizado. Enviando resposta.');
    return res.json(jsonResult);
});

server.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
