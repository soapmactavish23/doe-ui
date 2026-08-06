import { DashResponse } from '../domain/dash_response';
import { dashboardRepository } from '../infrastructure/dashboard.repository';

export const dashboardService = {
    async countAge(): Promise<DashResponse[]> {
        return dashboardRepository.countAge();
    },
    async countType(): Promise<DashResponse[]> {
        return dashboardRepository.countType();
    }
};
