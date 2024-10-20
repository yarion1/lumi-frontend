import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Container, Button, Dropdown, Form } from 'react-bootstrap';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { getDashboardData, getCustomers } from '../services/invoiceService';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const DashboardPage: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [chartType, setChartType] = useState<string>('bar');
    const [clientNumber, setClientNumber] = useState<string>('');
    const [year, setYear] = useState<string>('');
    const [month, setMonth] = useState<string>('');
    const [customers, setCustomers] = useState<any[]>([]);

    const fetchCustomers = async () => {
        try {
            const response = await getCustomers();
            setCustomers(response.data);
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
        }
    };

    const fetchDashboardData = (filters = false) => {
        const referenceMonth = month && year ? `${month}/${year}` : year;
        const params = filters ? { clientNumber, referenceMonth } : {};
        getDashboardData(params)
            .then((response) => {
                setDashboardData(response.data);
            })
            .catch((error) => {
                console.error('Erro ao buscar dados do dashboard:', error);
            });
    };

    useEffect(() => {
        fetchCustomers();
        fetchDashboardData();
    }, []);

    if (!dashboardData) return <div>Carregando...</div>;

    const energyData = {
        labels: ['Consumo de Energia', 'Energia Compensada'],
        datasets: [
            {
                label: 'Energia (kWh)',
                data: [dashboardData.totalEnergyConsumed, dashboardData.totalEnergyCompensated],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const financialData = {
        labels: ['Valor Total Sem GD', 'Economia GD'],
        datasets: [
            {
                label: 'Valor (R$)',
                data: [dashboardData.totalValueWithoutGD, dashboardData.totalEconomyGD],
                backgroundColor: ['rgba(153, 102, 255, 0.6)', 'rgba(255, 206, 86, 0.6)'],
                borderColor: ['rgba(153, 102, 255, 1)', 'rgba(255, 206, 86, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const ChartComponent = ({ data }: { data: any }) => {
        switch (chartType) {
            case 'line':
                return <Line data={data} options={{ responsive: true, maintainAspectRatio: true }} />;
            case 'pie':
                return <Pie data={data} options={{ responsive: true, maintainAspectRatio: true }} />;
            default:
                return <Bar data={data} options={{ responsive: true, maintainAspectRatio: true }} />;
        }
    };

    return (
        <Container className="my-4">
            <Row className="mb-4">
                <Col xs={12} md={4}>
                    <Form.Group controlId="clientNumber">
                        <Form.Label>Cliente</Form.Label>
                        <Form.Control
                            as="select"
                            value={clientNumber}
                            onChange={(e) => setClientNumber(e.target.value)}
                        >
                            <option value="">Todos os Clientes</option>
                            {customers.map((customer) => (
                                <option key={customer.id} value={customer.clientNumber}>
                                    {customer.clientNumber} - {customer.ucNumber}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col xs={12} md={4}>
                    <Form.Group controlId="referenceMonth">
                        <Form.Label>Ano</Form.Label>
                        <Form.Control
                            as="select"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        >
                            <option value="">Selecione o Ano</option>
                            {['2022', '2023', '2024'].map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col xs={12} md={4}>
                    <Form.Group controlId="referenceMonth">
                        <Form.Label>Mês</Form.Label>
                        <Form.Control
                            as="select"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                        >
                            <option value="">Selecione o Mês</option>
                            {['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'].map((month) => (
                                <option key={month} value={month}>
                                    {month}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col xs={12} className="d-flex align-items-end mt-3">
                    <Button onClick={() => fetchDashboardData(true)} variant="primary">
                        Aplicar Filtros
                    </Button>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <Dropdown>
                        <Dropdown.Toggle variant="primary">
                            Tipo de Gráfico: {chartType}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setChartType('bar')}>Barra</Dropdown.Item>
                            <Dropdown.Item onClick={() => setChartType('line')}>Linha</Dropdown.Item>
                            <Dropdown.Item onClick={() => setChartType('pie')}>Pizza</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col xs={12} md={3} className="mb-3">
                    <Card>
                        <Card.Body>
                            <Card.Title>Total de Energia Consumida</Card.Title>
                            <Card.Text>{dashboardData.totalEnergyConsumed} kWh</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={3} className="mb-3">
                    <Card>
                        <Card.Body>
                            <Card.Title>Total de Energia Compensada</Card.Title>
                            <Card.Text>{dashboardData.totalEnergyCompensated} kWh</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={3} className="mb-3">
                    <Card>
                        <Card.Body>
                            <Card.Title>Valor Total Sem GD</Card.Title>
                            <Card.Text>R$ {dashboardData.totalValueWithoutGD.toFixed(2)}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={3} className="mb-3">
                    <Card>
                        <Card.Body>
                            <Card.Title>Economia GD</Card.Title>
                            <Card.Text>R$ {dashboardData.totalEconomyGD.toFixed(2)}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col xs={12} lg={6} className="mb-4">
                    <Card>
                        <Card.Body>
                            <Card.Title>Consumo de Energia Elétrica (kWh)</Card.Title>
                            <div style={{ position: 'relative', height: '300px' }}>
                                <ChartComponent data={energyData} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} lg={6} className="mb-4">
                    <Card>
                        <Card.Body>
                            <Card.Title>Resultados Financeiros (R$)</Card.Title>
                            <div style={{ position: 'relative', height: '300px' }}>
                                <ChartComponent data={financialData} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DashboardPage;
