'use client';

import { RefObject } from 'react';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';

import { DataTable, DataTableFilterEvent, DataTablePageEvent } from 'primereact/datatable';

import { Fieldset } from 'primereact/fieldset';
import { Tag } from 'primereact/tag';

import { LazyTableState } from '@/app/api/core/pageable';

import { FilterApply } from '@/app/components/datatable/filter-apply';
import { FilterClear } from '@/app/components/datatable/filter-clear';

import { imageBodyTemplateUser } from '@/app/components/datatable/image-body-template';

import { Message } from '@/app/components/Message';

import { User } from '../domain/user';

interface UserDataTableProps {
    dt: RefObject<DataTable<User[]> | null>;
    users: User[];
    totalElements: number;
    loading: boolean;
    lazyState: LazyTableState<any>;

    onNew: () => void;
    onEdit: (user: User) => void;
    onResetPassword: (user: User) => void;
    onDelete: (user: User) => void;
    onChangeStatus: (user: User) => void;

    onPage: (event: DataTablePageEvent) => void;

    onFilter: (event: DataTableFilterEvent) => void;
}

export default function UserDataTable({
    dt,
    users,
    totalElements,
    loading,
    lazyState,

    onNew,
    onEdit,
    onResetPassword,
    onDelete,
    onChangeStatus,

    onPage,
    onFilter
}: UserDataTableProps) {
    const statusBodyTemplate = (rowData: User) => {
        const severity = rowData.status ? 'success' : 'danger';

        const value = rowData.status ? 'ATIVO' : 'INATIVO';

        return <Tag value={value} severity={severity} className="pointer" onClick={() => onChangeStatus(rowData)} />;
    };

    const actionBodyTemplate = (rowData: User) => (
        <>
            <Button type="button" icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => onEdit(rowData)} />

            <Button type="button" icon="pi pi-lock" rounded severity="info" className="mr-2" onClick={() => onResetPassword(rowData)} />

            <Button type="button" icon="pi pi-trash" rounded severity="danger" onClick={() => onDelete(rowData)} />
        </>
    );

    return (
        <Fieldset legend="Gerenciamento de Usuários">
            <DataTable
                value={users}
                dataKey="id"
                paginator
                lazy
                rows={lazyState.rows}
                rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                filterDisplay="row"
                currentPageReportTemplate={Message.currentPageReportTemplate}
                loading={loading}
                emptyMessage={Message.empty}
                totalRecords={totalElements}
                first={lazyState.first}
                header={
                    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                        <Button type="button" label="Novo" icon="pi pi-plus" severity="success" onClick={onNew} />
                    </div>
                }
                onPage={onPage}
                onFilter={onFilter}
                filters={lazyState.filters}
            >
                <Column field="image" body={imageBodyTemplateUser} />

                <Column field="name" header="Nome" filter showFilterMenuOptions={false} filterClear={FilterClear} filterApply={FilterApply} filterPlaceholder="Pesquisar" />

                <Column field="email" header="E-mail" filter showFilterMenuOptions={false} filterClear={FilterClear} filterApply={FilterApply} filterPlaceholder="Pesquisar" />

                <Column
                    field="status"
                    header="Status"
                    showFilterMenu={false}
                    filterMenuStyle={{
                        width: '14rem'
                    }}
                    style={{
                        minWidth: '12rem'
                    }}
                    body={statusBodyTemplate}
                />

                <Column
                    body={actionBodyTemplate}
                    exportable={false}
                    style={{
                        minWidth: '12rem'
                    }}
                />
            </DataTable>
        </Fieldset>
    );
}
