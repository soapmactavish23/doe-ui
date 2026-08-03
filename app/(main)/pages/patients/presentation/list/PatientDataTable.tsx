'use client';

import { useRef } from 'react';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';

import { DataTable, DataTableFilterEvent, DataTablePageEvent } from 'primereact/datatable';

import { Fieldset } from 'primereact/fieldset';

import { LazyTableState } from '@/app/api/core/pageable';

import { FilterApply } from '@/app/components/datatable/filter-apply';
import { FilterClear } from '@/app/components/datatable/filter-clear';
import { imageBodyTemplate } from '@/app/components/datatable/image-body-template';
import { Message } from '@/app/components/Message';

import { PatientResponse } from '../../domain/patient';

import { PatientFilters } from '../../application/usePatientList';

interface PatientDataTableProps {
    patients: PatientResponse[];
    totalElements: number;
    loading: boolean;

    lazyState: LazyTableState<PatientFilters>;

    onNew: () => void;

    onEdit: (patient: PatientResponse) => void;

    onDelete: (patient: PatientResponse) => void;

    onPage: (event: DataTablePageEvent) => void;

    onFilter: (event: DataTableFilterEvent) => void;
}

export default function PatientDataTable({ patients, totalElements, loading, lazyState, onNew, onEdit, onDelete, onPage, onFilter }: PatientDataTableProps) {
    const dt = useRef<DataTable<PatientResponse[]>>(null);

    const actionBodyTemplate = (rowData: PatientResponse) => {
        return (
            <>
                <Button type="button" icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => onEdit(rowData)} />

                <Button type="button" icon="pi pi-trash" rounded severity="danger" onClick={() => onDelete(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <Button type="button" label="Novo" icon="pi pi-plus" severity="success" onClick={onNew} />
        </div>
    );

    return (
        <Fieldset legend="Gerenciamento de Pacientes">
            <DataTable
                ref={dt}
                value={patients}
                dataKey="id"
                paginator
                lazy
                first={lazyState.first}
                rows={lazyState.rows}
                totalRecords={totalElements}
                filters={lazyState.filters}
                rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                filterDisplay="row"
                currentPageReportTemplate={Message.currentPageReportTemplate}
                loading={loading}
                emptyMessage={Message.empty}
                header={header}
                onPage={onPage}
                onFilter={onFilter}
            >
                <Column field="image" body={imageBodyTemplate} />

                <Column field="name" header="Nome" filter showFilterMenuOptions={false} filterClear={FilterClear} filterApply={FilterApply} filterPlaceholder="Pesquisar" />

                <Column field="cause" header="Doença" />

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
