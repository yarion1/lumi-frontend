import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import UploadPage from './pages/UploadPage';
import InvoicePage from './pages/InvoicePage';
import DashboardPage from './pages/DashboardPage';

const App: React.FC = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/invoices" element={<InvoicePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
        </Router>
    );
};

export default App;
