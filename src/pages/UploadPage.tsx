import React, { useState } from 'react';
import { Container, Form, Button, ProgressBar, Alert } from 'react-bootstrap';
import { uploadInvoices } from '../services/invoiceService';
import { AxiosProgressEvent } from 'axios';

const UploadPage: React.FC = () => {
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [uploading, setUploading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFiles(event.target.files);
    };

    const handleUpload = async () => {
        if (!selectedFiles || selectedFiles.length === 0) {
            setError('Por favor, selecione pelo menos um arquivo para fazer o upload.');
            return;
        }

        if (selectedFiles.length > 10) {
            setError('Você só pode fazer o upload de até 10 arquivos por vez.');
            return;
        }

        setError(null);
        setSuccessMessage(null);
        setUploading(true);
        setUploadProgress(0);

        const formData = new FormData();
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('files', selectedFiles[i]);
        }

        try {
            await uploadInvoices(formData, (progressEvent: AxiosProgressEvent) => {
                const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                setUploadProgress(progress);
            });

            setSuccessMessage('Upload concluído com sucesso!');
        } catch (error) {
            console.error('Erro ao fazer o upload:', error);
            setError('Erro ao fazer o upload. Por favor, tente novamente.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Container className="my-4">
            <h2 className="mb-4">Upload de Faturas</h2>

            <Form>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Selecione até 10 arquivos para upload</Form.Label>
                    <Form.Control type="file" multiple onChange={handleFileChange} />
                </Form.Group>

                {selectedFiles && selectedFiles.length > 0 && (
                    <div className="mb-3">
                        <strong>Arquivos Selecionados:</strong>
                        <ul>
                            {Array.from(selectedFiles).map((file, index) => (
                                <li key={index}>
                                    {file.name} ({(file.size / 1024).toFixed(2)} KB)
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <Button variant="primary" onClick={handleUpload} disabled={uploading}>
                    {uploading ? 'Enviando...' : 'Fazer Upload'}
                </Button>
            </Form>

            {uploading && (
                <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} className="mt-3" />
            )}

            {error && (
                <Alert variant="danger" className="mt-3">
                    {error}
                </Alert>
            )}

            {successMessage && (
                <Alert variant="success" className="mt-3">
                    {successMessage}
                </Alert>
            )}
        </Container>
    );
};

export default UploadPage;
