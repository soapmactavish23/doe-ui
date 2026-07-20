/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { LazyTableState } from '@/app/api/core/pageable';
import { buildActionTemplate } from '@/app/components/datatable/buildActionTemplate';
import { confirmDelete } from '@/app/components/datatable/confirmDelete';
import { FilterApply } from '@/app/components/datatable/filter-apply';
import { FilterClear } from '@/app/components/datatable/filter-clear';
import { imageBodyTemplateUser } from '@/app/components/datatable/image-body-template';
import { Message } from '@/app/components/Message';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { DataTable, DataTablePageEvent, DataTableFilterEvent } from 'primereact/datatable';
import { Fieldset } from 'primereact/fieldset';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { QueryKey } from '@/app/lib/react-query';
import { userService } from '@/app/(main)/pages/users/services/user_service_impl';
import { newUser, User } from '@/app/(main)/pages/users/types/user';
import { DialogEdit } from './components/DialogEdit';
import { Tag } from 'primereact/tag';

export default function UserPage() {
    // ################################### DATATABLE ###################################
    const [list, setList] = useState<User[]>([]);
    const [totalElements, setTotalElements] = useState<number>(0);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<User[]>>(null);
    const [isSending, setIsSending] = useState<boolean>(false);

    // ################################### LAZY ###################################
    const [lazyState, setLazyState] = useState<LazyTableState | any>({
        first: 0,
        rows: 10,
        page: 0,
        sortField: '',
        sortOrder: 0,
        filters: {
            name: { value: '', matchMode: 'contains' },
            email: { value: '', matchMode: 'contains' }
        }
    });

    const { isLoading, refetch } = useQuery<User[]>({
        queryKey: [QueryKey.USER_FIND_ALL],
        queryFn: async () => {
            const response = await userService.search({
                email: lazyState.filters.name.value,
                pageable: {
                    page: lazyState.page,
                    size: lazyState.rows
                },
                name: lazyState.filters.name.value
            });
            setList(response.content);
            setTotalElements(response.totalElements);
            return response.content;
        },
        enabled: true
    });

    // ################################### DIALOG ###################################
    let [obj, setObj] = useState<User>(newUser);
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);

    const handleOpenNew = () => {
        setObj(newUser);
        setVisibleDialog(true);
    };

    const handleOpenEdit = (data: User) => {
        setObj({ ...data });
        setVisibleDialog(true);
    };

    const handleOpenResetPassword = (data: User) => {
        confirmDialog({
            message: `Deseja realmente resetar a senha do usuário ${data.name}?`,
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Confirmar',
            rejectLabel: 'Cancelar',
            accept: () => {
                setIsSending(true);
                userService
                    .resetPassword(data.id!)
                    .then(() => {
                        setIsSending(false);
                        toast.current!.show({
                            severity: 'success',
                            summary: Message.successMsg,
                            detail: 'Sucesso ao resetar a senha do usuário.',
                            life: 3000
                        });
                        refetch();
                    })
                    .catch((err) => {
                        setIsSending(false);
                        console.error(err);
                        toast.current?.show({
                            severity: 'error',
                            summary: Message.errorMsg,
                            detail: 'Erro ao resetar a senha do usuário.'
                        });
                    });
            }
        });
    };

    const handleOpenDelete = (rowData: User) => {
        confirmDelete({
            name: rowData.name,
            onAccept: () => {
                setIsSending(true);
                userService.remove!(rowData.id!)
                    .then(() => {
                        setIsSending(false);
                        toast.current!.show({
                            severity: 'success',
                            summary: Message.successMsg,
                            detail: Message.successDelete,
                            life: 3000
                        });
                        refetch();
                    })
                    .catch((err) => {
                        setIsSending(false);
                        console.error(err);
                        toast.current?.show({
                            severity: 'error',
                            summary: Message.errorMsg,
                            detail: Message.errorDelete
                        });
                    });
            }
        });
    };

    const statusBodyTemplate = (rowData: User) => {
        const severy = rowData.status ? 'success' : 'danger';
        const value = rowData.status ? 'ATIVO' : 'INATIVO';

        return (
            <Tag
                value={value}
                severity={severy}
                className="pointer"
                onClick={async () => {
                    await userService.changeStatus(rowData.id!);
                    await refetch();
                }}
            ></Tag>
        );
    };

    const handleOnClose = () => {
        setVisibleDialog(false);
        setObj(newUser);
        refetch();
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <DialogEdit visibleDialog={visibleDialog} obj={obj} onClose={handleOnClose} />
            <ConfirmDialog />
            <Fieldset legend="Gerenciamento de Usuários">
                <DataTable
                    ref={dt}
                    value={list}
                    dataKey="id"
                    paginator
                    lazy
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    filterDisplay="row"
                    currentPageReportTemplate={Message.currentPageReportTemplate}
                    loading={isLoading || isSending}
                    emptyMessage={Message.empty}
                    totalRecords={totalElements}
                    first={lazyState.first}
                    header={
                        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                            <Button label="Novo" icon="pi pi-plus" severity="success" onClick={handleOpenNew} />
                        </div>
                    }
                    onPage={async (event: DataTablePageEvent) => {
                        setLazyState({
                            first: event.first,
                            filters: { ...lazyState.filters },
                            page: event.page,
                            rows: event.rows
                        });
                        await refetch();
                    }}
                    onFilter={async (event: DataTableFilterEvent) => {
                        setLazyState({
                            first: 0,
                            filters: event.filters,
                            page: event.page,
                            rows: event.rows
                        });
                        await refetch();
                    }}
                    filters={lazyState.filters}
                >
                    <Column field="image" body={imageBodyTemplateUser}></Column>
                    <Column field="name" header="Nome" filter showFilterMenuOptions={false} filterClear={FilterClear} filterApply={FilterApply} filterPlaceholder="Pesquisar" />
                    <Column field="email" header="E-mail" filter showFilterMenuOptions={false} filterClear={FilterClear} filterApply={FilterApply} filterPlaceholder="Pesquisar"></Column>
                    <Column field="status" header="Status" showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} />
                    <Column
                        body={(rowData) => {
                            return (
                                <>
                                    <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => handleOpenEdit(rowData)} />
                                    <Button icon="pi pi-lock" rounded severity="info" className="mr-2" onClick={() => handleOpenResetPassword(rowData)} />
                                    <Button icon="pi pi-trash" rounded severity="danger" onClick={() => handleOpenDelete(rowData)} />
                                </>
                            );
                        }}
                        exportable={false}
                        style={{ minWidth: '12rem' }}
                    ></Column>
                </DataTable>
            </Fieldset>
        </div>
    );
}
