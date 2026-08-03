'use client';

import { useState } from 'react';

import { DataTableFilterEvent, DataTablePageEvent } from 'primereact/datatable';

import { DataTableFilterMeta } from 'primereact/datatable';

import { useQuery } from '@tanstack/react-query';

import { LazyTableState } from '@/app/api/core/pageable';
import { QueryKey } from '@/app/lib/react-query';

import { Group } from '../../groups/domain/group';
import { groupService } from '../../groups/application/group.service';

import { createEmptyUser, User } from '../domain/user';

import { userService } from './user.service';

interface UserFilters extends DataTableFilterMeta {
    name: {
        value: string;
        matchMode: 'contains';
    };

    email: {
        value: string;
        matchMode: 'contains';
    };
}

const initialLazyState: LazyTableState<UserFilters> = {
    first: 0,
    rows: 10,
    page: 0,
    sortField: '',
    sortOrder: 0,
    filters: {
        name: {
            value: '',
            matchMode: 'contains'
        },

        email: {
            value: '',
            matchMode: 'contains'
        }
    }
};

export function useUsers() {
    const [lazyState, setLazyState] = useState<LazyTableState<UserFilters>>(initialLazyState);

    const [selectedUser, setSelectedUser] = useState<User>(createEmptyUser());

    const [dialogVisible, setDialogVisible] = useState(false);

    const [sending, setSending] = useState(false);

    const { data, isLoading, refetch } = useQuery({
        queryKey: [QueryKey.USER_FIND_ALL, lazyState.page, lazyState.rows, lazyState.filters.name.value, lazyState.filters.email.value],

        queryFn: () =>
            userService.search({
                name: lazyState.filters.name.value ?? '',

                email: lazyState.filters.email.value ?? '',

                pageable: {
                    page: lazyState.page ?? 0,
                    size: lazyState.rows
                }
            })
    });

    const { data: groups = [], isLoading: loadingGroups } = useQuery<Group[]>({
        queryKey: [QueryKey.GROUP_FIND_ALL],

        queryFn: () => groupService.findAll()
    });

    const openNew = () => {
        setSelectedUser(createEmptyUser());

        setDialogVisible(true);
    };

    const openEdit = (user: User) => {
        setSelectedUser({
            ...user,
            group: {
                ...user.group
            }
        });

        setDialogVisible(true);
    };

    const closeDialog = () => {
        setDialogVisible(false);

        setSelectedUser(createEmptyUser());
    };

    const save = async (user: User): Promise<void> => {
        try {
            setSending(true);

            if (user.id) {
                await userService.update(user);
            } else {
                await userService.create(user);
            }

            closeDialog();

            await refetch();
        } finally {
            setSending(false);
        }
    };

    const remove = async (user: User): Promise<void> => {
        if (!user.id) {
            throw new Error('Usuário sem identificador');
        }

        try {
            setSending(true);

            await userService.remove(user.id);

            await refetch();
        } finally {
            setSending(false);
        }
    };

    const resetPassword = async (user: User): Promise<void> => {
        if (!user.id) {
            throw new Error('Usuário sem identificador');
        }

        try {
            setSending(true);

            await userService.resetPassword(user.id);

            await refetch();
        } finally {
            setSending(false);
        }
    };

    const changeStatus = async (user: User): Promise<void> => {
        if (!user.id) {
            throw new Error('Usuário sem identificador');
        }

        try {
            setSending(true);

            await userService.changeStatus(user.id);

            await refetch();
        } finally {
            setSending(false);
        }
    };

    const handlePage = (event: DataTablePageEvent) => {
        setLazyState((current) => ({
            ...current,
            first: event.first,
            page: event.page ?? 0,
            rows: event.rows
        }));
    };

    const handleFilter = (event: DataTableFilterEvent) => {
        setLazyState((current) => ({
            ...current,
            first: 0,
            page: 0,
            filters: event.filters as UserFilters
        }));
    };

    return {
        users: data?.content ?? [],
        totalElements: data?.totalElements ?? 0,

        groups,

        selectedUser,
        dialogVisible,
        lazyState,

        loading: isLoading || sending,

        saving: sending,
        loadingGroups,

        openNew,
        openEdit,
        closeDialog,

        save,
        remove,
        resetPassword,
        changeStatus,

        handlePage,
        handleFilter,
        refetch
    };
}
