import React, { useState, useEffect, useRef } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { io } from "socket.io-client";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');
  body {
    margin: 0;
    font-family: 'Inter', sans-serif;
    background: #fafafa;
    color: #222;
  }
`;

const Container = styled.div`
  max-width: 900px;
  margin: auto;
  padding: 20px;
`;

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-weight: 700;
  font-size: 1.5rem;
`;

const Title = styled.h1`
  margin: 0;
  font-weight: 700;
`;

const Description = styled.p`
  font-size: 1rem;
  margin-bottom: 30px;
`;

const UploadSection = styled.section`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FileInputLabel = styled.label`
  display: inline-block;
  padding: 18px 36px;
  background-color: #000;
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  border-radius: 25px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #222;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const SelectedFileName = styled.p`
  margin-top: 15px;
  font-weight: 600;
  color: #444;
  word-break: break-word;
  max-width: 100%;
  text-align: center;
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px);}
  to { opacity: 1; transform: translateY(0);}
`;

const JsonOutput = styled.pre`
  margin-top: 40px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.1);
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
  font-size: 0.9rem;
  color: #111;
  animation: ${fadeIn} 0.5s ease forwards;
  white-space: pre-wrap;
  word-break: break-word;
`;

const ErrorMessage = styled.p`
  margin-top: 20px;
  color: red;
  font-weight: 600;
  text-align: center;
`;

const FooterWrapper = styled.footer`
  margin-top: 60px;
  text-align: center;
  color: #777;
  font-size: 0.9rem;
`;

export default function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [extractedText, setExtractedText] = useState(null);
    const [error, setError] = useState(null);
    const socketRef = useRef(null);

    useEffect(() => {
        // Conecta ao socket.io no backend
        socketRef.current = io("http://localhost:3001");

        socketRef.current.on("connect", () => {
            console.log("Socket conectado:", socketRef.current.id);
            toast.info("Conectado ao servidor para notificações de OCR.", { autoClose: 3000 });
        });

        // Recebe notificações do progresso OCR
        socketRef.current.on("ocrProgress", (data) => {
            toast.info(`OCR na imagem ${data.image}: ${data.progress}%`, {
                position: "bottom-right",
                autoClose: 2000,
                pauseOnHover: false,
            });

            // Se for 100%, mostra mensagens finais com delay
            if (data.progress === 100) {
                const mensagensFinais = [
                    "Extração concluída! 🎉",
                    "Processando dados extraídos...",
                    "Tudo pronto! Você pode conferir o resultado."
                ];

                mensagensFinais.forEach((msg, idx) => {
                    setTimeout(() => {
                        toast.success(msg, {
                            position: "bottom-right",
                            autoClose: 3000,
                            pauseOnHover: true,
                        });
                    }, 3000 * (idx + 1));
                });
            }
        });

        socketRef.current.on("disconnect", () => {
            toast.error("Desconectado do servidor de notificações.");
        });

        socketRef.current.on("connect_error", () => {
            toast.error("Erro na conexão com servidor de notificações.");
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setExtractedText(null);
        setError(null);

        if (!file) return;

        if (file.type !== "application/pdf") {
            setError("Por favor, selecione um arquivo PDF válido.");
            return;
        }

        if (!socketRef.current || !socketRef.current.id) {
            setError("Conexão com servidor de notificações não estabelecida.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:3001/upload", {
                method: "POST",
                headers: {
                    // Envia socket id para backend identificar o cliente
                    "x-socket-id": socketRef.current.id,
                },
                body: formData,
            });

            if (!response.ok) throw new Error("Erro ao enviar arquivo");

            const data = await response.json();
            setExtractedText(data);
            toast.success("Arquivo processado com sucesso!");
        } catch (err) {
            console.error(err);
            setError("Erro ao processar o arquivo. Tente novamente.");
            toast.error("Erro ao processar o arquivo.");
        }
    };

    return (
        <>
            <GlobalStyle />
            <ToastContainer />
            <Container>
                <HeaderWrapper>
                    <div>Extrator de Texto de PDF</div>
                </HeaderWrapper>
                <Title>Envio de Documentos</Title>
                <Description>
                    Faça o upload de arquivos no formato PDF e visualize o conteúdo extraído em JSON logo abaixo.
                </Description>

                <UploadSection>
                    <FileInputLabel htmlFor="pdf-upload">
                        Selecione um arquivo PDF
                    </FileInputLabel>
                    <HiddenFileInput
                        id="pdf-upload"
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                    />

                    {selectedFile && (
                        <SelectedFileName>
                            Arquivo selecionado: {selectedFile.name}
                        </SelectedFileName>
                    )}

                    {error && <ErrorMessage>{error}</ErrorMessage>}

                    {extractedText && (
                        <JsonOutput>{JSON.stringify(extractedText, null, 2)}</JsonOutput>
                    )}
                </UploadSection>

                <FooterWrapper>
                    &copy; {new Date().getFullYear()} André Nagybhe Hage Ramos
                </FooterWrapper>
            </Container>
        </>
    );
}
