'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { DashResponse } from '../domain/dash_response';
import { dashboardService } from '../application/dashboard.service';
import { QueryKey } from '@/app/lib/react-query';

export function useDashboard() {
    const [ages, setAges] = useState<DashResponse[]>([]);
    const [types, setTypes] = useState<DashResponse[]>([]);

    const ageQuery = useQuery({
        queryKey: [QueryKey.DASHBOARD_COUNT_AGE],
        queryFn: dashboardService.countAge
    });

    const typeQuery = useQuery({
        queryKey: [QueryKey.DASHBOARD_COUNT_TYPE],
        queryFn: dashboardService.countType
    });

    useEffect(() => {
        if (ageQuery.data) {
            setAges(ageQuery.data);
        }
    }, [ageQuery.data]);

    useEffect(() => {
        if (typeQuery.data) {
            setTypes(typeQuery.data);
        }
    }, [typeQuery.data]);

    const loading = ageQuery.isLoading || typeQuery.isLoading;
    const isFetching = ageQuery.isFetching || typeQuery.isFetching;
    const error = ageQuery.error ?? typeQuery.error;

    const refetch = async () => {
        await Promise.all([ageQuery.refetch(), typeQuery.refetch()]);
    };

    return {
        ages,
        types,
        loading,
        isFetching,
        error,
        refetch
    };
}
