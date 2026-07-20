/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { DataTable, DataTableFilterEvent, DataTablePageEvent } from 'primereact/datatable';
import { Fieldset } from 'primereact/fieldset';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { PatientResponse } from './types/patient';
import { Message } from '@/app/components/Message';
import { DataTableFilterMeta, LazyTableState } from '@/app/api/core/pageable';
import { QueryKey } from '@/app/lib/react-query';
import { useQuery } from '@tanstack/react-query';
import { patientService } from './services/patient_service_impl';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { imageBodyTemplate } from '@/app/components/datatable/image-body-template';
import { FilterClear } from '@/app/components/datatable/filter-clear';
import { FilterApply } from '@/app/components/datatable/filter-apply';
import { confirmDelete } from '@/app/components/datatable/confirmDelete';
import { ConfirmDialog } from 'primereact/confirmdialog';

interface PatientFilters extends DataTableFilterMeta {
    name: { value: ''; matchMode: 'contains' };
}

export default function Patients() {
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<PatientResponse[]>>(null);
    const [list, setList] = useState<PatientResponse[]>([]);
    const [totalElements, setTotalElements] = useState<number>(0);

    const [lazyState, setLazyState] = useState<LazyTableState<PatientFilters>>({
        first: 0,
        rows: 10,
        page: 0,
        sortField: '',
        sortOrder: 0,
        filters: {
            name: { value: '', matchMode: 'contains' }
        }
    });

    const { isLoading, refetch } = useQuery<PatientResponse[]>({
        queryKey: [QueryKey.PATIENT_FIND_ALL],
        queryFn: async () => {
            const response = await patientService.search({
                name: lazyState.filters.name.value,
                pageable: {
                    page: lazyState.page,
                    size: lazyState.rows
                }
            });
            setList(response.content);
            setTotalElements(response.totalElements);
            return response.content;
        }
    });

    const handleOpenDelete = (rowData: PatientResponse) => {
        confirmDelete({
            name: rowData.name,
            onAccept: () => {
                patientService
                    .remove(rowData.id)
                    .then(() => {
                        toast.current?.show({
                            severity: 'success',
                            summary: Message.successMsg,
                            detail: Message.successDelete,
                            life: 3000
                        });
                        refetch();
                    })
                    .catch((err) => {
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

    return (
        <div className="card">
            <Toast ref={toast} />
            <ConfirmDialog />
            <Fieldset legend="Gerenciamento de Pacientes">
                <DataTable
                    ref={dt}
                    value={list}
                    totalRecords={totalElements}
                    dataKey="id"
                    paginator
                    lazy
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    filterDisplay="row"
                    currentPageReportTemplate={Message.currentPageReportTemplate}
                    loading={isLoading}
                    emptyMessage={Message.empty}
                    first={lazyState.first}
                    filters={lazyState.filters}
                    header={
                        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                            <Button
                                label="Novo"
                                icon="pi pi-plus"
                                severity="success"
                                onClick={() => {
                                    console.log('Novo');
                                }}
                            />
                        </div>
                    }
                    onPage={async (event: DataTablePageEvent) => {
                        setLazyState({
                            first: event.first,
                            filters: { ...lazyState.filters },
                            page: event.page ?? 0,
                            rows: event.rows
                        });

                        await refetch();
                    }}
                    onFilter={async (event: DataTableFilterEvent) => {
                        setLazyState({
                            first: 0,
                            filters: event.filters as PatientFilters,
                            page: event.page,
                            rows: event.rows
                        });
                        await refetch();
                    }}
                >
                    <Column field="image" body={imageBodyTemplate}></Column>
                    <Column field="name" header="Nome" filter showFilterMenuOptions={false} filterClear={FilterClear} filterApply={FilterApply} filterPlaceholder="Pesquisar"></Column>
                    <Column field="cause" header="Doença"></Column>
                    <Column
                        exportable={false}
                        style={{ minWidth: '12rem' }}
                        body={(rowData: PatientResponse) => {
                            return (
                                <React.Fragment>
                                    <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => console.log('Editar')} />
                                    <Button icon="pi pi-trash" rounded severity="danger" onClick={() => handleOpenDelete(rowData)} />
                                </React.Fragment>
                            );
                        }}
                    ></Column>
                </DataTable>
            </Fieldset>
        </div>
    );
}
