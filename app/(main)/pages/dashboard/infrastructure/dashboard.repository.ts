import { api } from '@/app/api/core/api';
import { DashResponse } from '../domain/dash_response';

export const dashboardRepository = {
    async countAge(): Promise<DashResponse[]> {
        const response = await api.get<DashResponse[]>('dashboard/idades');
        return response.data;
    },
    async countType(): Promise<DashResponse[]> {
        const response = await api.get<DashResponse[]>('dashboard/tipos');
        return response.data;
    }
};
