import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Table, Row, Col, Spinner, Dropdown } from 'react-bootstrap';
import { getInvoices, downloadInvoice } from '../services/invoiceService';
import { AiOutlineFilePdf } from 'react-icons/ai';

const InvoicePage: React.FC = () => {
    const [clientNumber, setClientNumber] = useState<string>('');
    const [year, setYear] = useState<string>('2024');
    const [referenceMonth, setReferenceMonth] = useState<string>('');
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const years = ['2018', '2019', '2020', '2021', '2022', '2023', '2024'];
    const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

    const fetchInvoices = () => {
        setLoading(true);
        const referencePeriod = referenceMonth ? `${referenceMonth}/${year}` : year;
        getInvoices({ clientNumber, referenceMonth: referencePeriod })
            .then((response) => {
                setInvoices(response.data);
            })
            .catch((error) => {
                console.error('Erro ao buscar faturas:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const handleDownload = (clientNumber: string, referenceMonth: string) => {
        downloadInvoice(clientNumber, referenceMonth)
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `fatura_${clientNumber}_${referenceMonth}.pdf`);
                document.body.appendChild(link);
                link.click();
            })
            .catch((error) => {
                console.error('Erro ao baixar a fatura:', error);
            });
    };

    return (
        <Container fluid className="my-4">
            <h2 className="mb-4">Biblioteca de Faturas</h2>

            {/* Filtros de Ano, Mês e Número do Cliente */}
            <Row className="mb-4">
                <Col xs={12} md={4}>
                    <Form.Group controlId="clientNumber">
                        <Form.Label>Número do Cliente</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ex.: 1234567890"
                            value={clientNumber}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClientNumber(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                    <Form.Label>Selecionar Ano</Form.Label>
                    <Form.Control
                        as="select"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    >
                        {years.map((yearItem) => (
                            <option key={yearItem} value={yearItem}>
                                {yearItem}
                            </option>
                        ))}
                    </Form.Control>
                </Col>
                <Col xs={12} md={3}>
                    <Form.Label>Selecionar Mês (opcional)</Form.Label>
                    <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary" id="dropdown-month">
                            {referenceMonth || 'Todos os Meses'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {months.map((month) => (
                                <Dropdown.Item key={month} onClick={() => setReferenceMonth(month)}>
                                    {month}
                                </Dropdown.Item>
                            ))}
                            <Dropdown.Item onClick={() => setReferenceMonth('')}>Todos os Meses</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col xs={12} md={2} className="d-flex align-items-end">
                    <Button variant="primary" onClick={fetchInvoices} className="w-100">
                        {loading ? <Spinner animation="border" size="sm" /> : 'Buscar Faturas'}
                    </Button>
                </Col>
            </Row>

            {invoices.length > 0 && (
                <Table striped bordered hover responsive className="mt-4">
                    <thead style={{ backgroundColor: '#003300', color: 'white' }}>
                    <tr>
                        <th>Número da UC</th>
                        <th>Distribuidora</th>
                        <th>Mês de Referência</th>
                        <th>Download da Fatura</th>
                    </tr>
                    </thead>
                    <tbody>
                    {invoices.map((invoice) => (
                        <tr key={invoice.id}>
                            <td>{invoice.clientNumber}</td>
                            <td>{invoice.distributor}</td>
                            <td>{invoice.referenceMonth}</td>
                            <td className="text-center">
                                <Button
                                    variant="link"
                                    onClick={() => handleDownload(invoice.clientNumber, invoice.referenceMonth)}
                                >
                                    <AiOutlineFilePdf size={20} />
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}

            {invoices.length === 0 && !loading && (
                <div className="text-center my-4">
                    <p>Nenhuma fatura encontrada para os critérios informados.</p>
                </div>
            )}
        </Container>
    );
};

export default InvoicePage;
