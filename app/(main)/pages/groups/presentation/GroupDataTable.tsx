'use client';

import { ChangeEvent, useMemo, useState } from 'react';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';

import { Group } from '../domain/group';

interface GroupDataTableProps {
    groups: Group[];
    loading?: boolean;
    onNew: () => void;
    onEdit: (group: Group) => void;
    onDelete: (group: Group) => void;
}

export default function GroupDataTable({ groups, loading = false, onNew, onEdit, onDelete }: GroupDataTableProps) {
    const [search, setSearch] = useState('');

    const filteredGroups = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        if (!normalizedSearch) {
            return groups;
        }

        return groups.filter((group) => group.name.toLowerCase().includes(normalizedSearch));
    }, [groups, search]);

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const actionTemplate = (rowData: Group) => {
        return (
            <div className="flex gap-2">
                <Button type="button" icon="pi pi-pencil" rounded outlined aria-label={`Editar ${rowData.name}`} onClick={() => onEdit(rowData)} />

                <Button type="button" icon="pi pi-trash" severity="danger" rounded outlined aria-label={`Excluir ${rowData.name}`} onClick={() => onDelete(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <Button type="button" label="Novo" icon="pi pi-plus" severity="success" onClick={onNew} />

            <span className="p-input-icon-left">
                <i className="pi pi-search" />

                <InputText type="search" value={search} placeholder="Pesquisar..." onChange={handleSearch} />
            </span>
        </div>
    );

    return (
        <DataTable
            value={filteredGroups}
            dataKey="id"
            header={header}
            loading={loading}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            emptyMessage="Nenhum grupo encontrado"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Exibindo {first} a {last} de {totalRecords} registros"
            responsiveLayout="scroll"
        >
            <Column field="name" header="Nome" sortable />

            <Column
                header="Ações"
                body={actionTemplate}
                exportable={false}
                style={{
                    width: '10rem'
                }}
            />
        </DataTable>
    );
}
