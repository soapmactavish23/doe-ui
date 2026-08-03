'use client';

import { useCallback, useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { QueryKey } from '@/app/lib/react-query';

import { createInitialLogFilters, LogFilters, LogResponse, LogUser } from '../domain/log';

import { logService } from './log.service';
import { userService } from '../../users/application/user.service';

export function useLogs() {
    const [logs, setLogs] = useState<LogResponse[]>([]);

    const [users, setUsers] = useState<LogUser[]>([]);

    const [filters, setFilters] = useState<LogFilters>(createInitialLogFilters());

    const [first, setFirst] = useState(0);
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(10);

    const [totalElements, setTotalElements] = useState(0);

    const [loading, setLoading] = useState(false);

    const { data: methods = [], isLoading: loadingMethods } = useQuery<string[]>({
        queryKey: [QueryKey.METHODS_FIND_ALL],
        queryFn: () => logService.findMethods()
    });

    const { isLoading: loadingUsers } = useQuery<LogUser[]>({
        queryKey: [QueryKey.USER_FIND_ALL],

        queryFn: async () => {
            const response = await userService.search({
                email: '',
                name: '',
                pageable: {
                    page: 0,
                    size: 100
                }
            });

            const loadedUsers: LogUser[] = response.content.map((user) => ({
                id: user.id!,
                name: user.name
            }));

            setUsers(loadedUsers);

            return loadedUsers;
        }
    });

    const loadLogs = useCallback(async () => {
        try {
            setLoading(true);

            const response = await logService.search({
                filters,
                page,
                size: rows
            });

            setLogs(response.content);
            setTotalElements(response.totalElements);
        } catch (error) {
            console.error('Erro ao carregar logs:', error);

            throw error;
        } finally {
            setLoading(false);
        }
    }, [filters, page, rows]);

    useEffect(() => {
        void loadLogs();
    }, [loadLogs]);

    const changePage = (nextFirst: number, nextPage: number, nextRows: number) => {
        setFirst(nextFirst);
        setPage(nextPage);
        setRows(nextRows);
    };

    const updateFilter = <K extends keyof LogFilters>(field: K, value: LogFilters[K]) => {
        setFirst(0);
        setPage(0);

        setFilters((current) => ({
            ...current,
            [field]: value
        }));
    };

    return {
        logs,
        users,
        methods,

        filters,

        first,
        page,
        rows,
        totalElements,

        loading,
        loadingUsers,
        loadingMethods,

        changePage,
        updateFilter,
        loadLogs
    };
}
