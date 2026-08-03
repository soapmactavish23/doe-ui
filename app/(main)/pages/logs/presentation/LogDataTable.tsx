'use client';

import { useRef } from 'react';

import moment from 'moment';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';

import { DataTable, DataTablePageEvent } from 'primereact/datatable';

import { Dropdown } from 'primereact/dropdown';
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';

import { Message } from '@/app/components/Message';

import { LogResponse } from '../domain/log';

import { useLogs } from '../application/useLogs';

export default function LogDataTable() {
    const dt = useRef<DataTable<LogResponse[]>>(null);

    const {
        logs,
        users,
        methods,

        filters,

        first,
        rows,
        totalElements,

        loading,
        loadingUsers,
        loadingMethods,

        changePage,
        updateFilter
    } = useLogs();

    const exportCSV = () => {
        dt.current?.exportCSV({
            selectionOnly: false
        });
    };

    const handlePage = (event: DataTablePageEvent) => {
        changePage(event.first, event.page ?? 0, event.rows);
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <div className="grid p-fluid">
                <div className="col-6">
                    <InputText type="date" value={filters.startDate} onChange={(event) => updateFilter('startDate', event.target.value)} />
                </div>

                <div className="col-6">
                    <InputText type="date" value={filters.endDate} onChange={(event) => updateFilter('endDate', event.target.value)} />
                </div>
            </div>

            <Button label="Exportar Excel" icon="pi pi-download" severity="success" onClick={exportCSV} />
        </div>
    );

    return (
        <Fieldset legend="Consultar de Logs">
            <DataTable
                ref={dt}
                value={logs}
                dataKey="id"
                paginator
                lazy
                first={first}
                rows={rows}
                totalRecords={totalElements}
                rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate={Message.currentPageReportTemplate}
                loading={loading}
                emptyMessage={Message.empty}
                header={header}
                onPage={handlePage}
            >
                <Column
                    field="user.name"
                    header="Usuário"
                    body={(rowData: LogResponse) => rowData.user.name}
                    filter
                    showFilterMenuOptions={false}
                    filterElement={
                        <Dropdown value={filters.userId} placeholder="Selecione o usuário" filter showClear options={users} optionValue="id" optionLabel="name" loading={loadingUsers} onChange={(event) => updateFilter('userId', event.value ?? '')} />
                    }
                />

                <Column field="address" header="Endereço (IP)" />

                <Column field="endPoint" header="End Point" />

                <Column
                    field="method"
                    header="Método"
                    filter
                    showFilterMenuOptions={false}
                    filterElement={<Dropdown value={filters.method} placeholder="Selecione o método" filter showClear options={methods} loading={loadingMethods} onChange={(event) => updateFilter('method', event.value ?? '')} />}
                />

                <Column field="date" header="Data" body={(rowData: LogResponse) => moment(rowData.date).format('DD/MM/YYYY HH:mm:ss')} />
            </DataTable>
        </Fieldset>
    );
}
