import api from './api';
import { AxiosProgressEvent } from 'axios';

export const uploadInvoices = (formData: FormData, onUploadProgress?: (progressEvent: AxiosProgressEvent) => void) => {
    return api.post('/invoices/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
    });
};

export const getInvoices = (filters: { clientNumber?: string; referenceMonth?: string }) => {
    return api.get('/invoices', { params: filters });
};

export const downloadInvoice = (clientNumber: string, referenceMonth: string) => {
    return api.get('/invoices/download', {
        params: { clientNumber, referenceMonth },
        responseType: 'blob',
    });
};

export const getDashboardData = (filters?: { clientNumber?: string; referenceMonth?: string }) => {
    return api.get('/invoices/dashboard-data', { params: filters });
};

export const getCustomers = () => {
    return api.get('invoices/customers');
};
