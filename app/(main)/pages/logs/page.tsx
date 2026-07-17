/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { DataTableFilterMeta, LazyTableState } from '@/app/api/core/pageable';
import { LogResponse } from '@/app/api/models/log';
import { User } from '@/app/api/models/user';
import { logService } from '@/app/api/services/log/log_service_impl';
import { userService } from '@/app/api/services/user/user_service_impl';
import { FilterApply } from '@/app/components/datatable/filter-apply';
import { FilterClear } from '@/app/components/datatable/filter-clear';
import { Message } from '@/app/components/Message';
import { QueryKey } from '@/app/lib/react-query';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterEvent, DataTablePageEvent } from 'primereact/datatable';
import { Dropdown, DropdownProps } from 'primereact/dropdown';
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useEffect, useRef, useState } from 'react';

interface LogFilters extends DataTableFilterMeta {
    userId: { value: string; matchMode: 'contains' };
    method: { value: string; matchMode: 'contains' };
    startDate: { value: string; matchMode: 'contains' };
    endDate: { value: string; matchMode: 'contains' };
}

export default function Log() {
    // ################################### DATATABLE ###################################
    const [list, setList] = useState<LogResponse[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<LogResponse[]>>(null);

    // ################################### LAZY ###################################
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    const endDate = new Date();
    const [lazyState, setLazyState] = useState<LazyTableState<LogFilters>>({
        first: 0,
        rows: 10,
        page: 0,
        sortField: '',
        sortOrder: 0,
        filters: {
            userId: { value: '', matchMode: 'contains' },
            method: { value: '', matchMode: 'contains' },
            startDate: { value: startDate.toISOString().split('T')[0], matchMode: 'contains' },
            endDate: { value: endDate.toISOString().split('T')[0], matchMode: 'contains' }
        }
    });

    const loadLogs = async () => {
        setIsLoading(true);
        const start = lazyState.filters.startDate.value;
        const end = lazyState.filters.endDate.value;
        const startDateTime = `${start}T00:00:00`;
        const endDateTime = `${end}T23:59:59`;
        const response = await logService.search({
            userId: lazyState.filters.userId.value,
            startDate: startDateTime,
            endDate: endDateTime,
            method: lazyState.filters.method.value,
            pageable: {
                page: lazyState.page - 1,
                size: lazyState.rows
            }
        });
        setList(response.content);
        setTotalElements(response.totalElements);
        setIsLoading(false);
        return response.content;
    };

    const { data: methodsList, isLoading: isLoadingMethods } = useQuery<string[]>({
        queryKey: [QueryKey.METHODS_FIND_ALL],
        queryFn: async () => await logService.findMethods(),
        enabled: true
    });

    const { isLoading: isLoadingUser, refetch: refetchUser } = useQuery<User[]>({
        queryKey: [QueryKey.USER_FIND_ALL],
        queryFn: async () => {
            const response = await userService.search({
                email: '',
                pageable: {
                    page: 0,
                    size: 10
                },
                name: ''
            });
            setUsers(response.content);
            return response.content;
        },
        enabled: true
    });

    const exportCSV = (selectionOnly: boolean) => {
        dt.current!.exportCSV({ selectionOnly });
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <Fieldset legend="Consultar de Logs">
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
                    loading={isLoading}
                    emptyMessage={Message.empty}
                    totalRecords={totalElements}
                    first={lazyState.first}
                    header={
                        <>
                            <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                                <div className="grid p-fluid">
                                    <div className="col-6">
                                        <InputText type="date" value={lazyState.filters.startDate.value} />
                                    </div>
                                    <div className="col-6">
                                        <InputText type="date" value={lazyState.filters.endDate.value} />
                                    </div>
                                </div>
                                <Button label="Exportar Excel" icon="pi pi-download" severity="success" onClick={() => exportCSV(false)} />
                            </div>
                        </>
                    }
                    onPage={async (event: DataTablePageEvent) => {
                        setLazyState({
                            first: event.first,
                            filters: { ...lazyState.filters },
                            page: event.page ?? 0,
                            rows: event.rows
                        });
                        await loadLogs();
                    }}
                    onFilter={async (event: DataTableFilterEvent) => {
                        setLazyState({
                            first: 0,
                            filters: event.filters as LogFilters,
                            page: event.page,
                            rows: event.rows
                        });
                        await loadLogs();
                    }}
                    filters={lazyState.filters}
                >
                    <Column
                        field="user.name"
                        header="Usuário"
                        filter
                        showFilterMenuOptions={false}
                        body={(rowData: LogResponse) => rowData.user.name}
                        filterElement={
                            <>
                                <Dropdown
                                    value={lazyState.filters.userId.value}
                                    placeholder="Selecione o usuário"
                                    filter={true}
                                    options={users}
                                    optionValue="id"
                                    optionLabel="name"
                                    loading={isLoadingUser}
                                    onChange={async (event) => {
                                        lazyState.filters.userId.value = event.target.value;
                                        setLazyState(lazyState);
                                        await loadLogs();
                                    }}
                                />
                            </>
                        }
                    />
                    <Column field="address" header="Endereço (IP)" filter showFilterMenuOptions={false} filterClear={FilterClear} filterApply={FilterApply} filterPlaceholder="Pesquisar" />
                    <Column field="endPoint" header="End Point" filter showFilterMenuOptions={false} filterClear={FilterClear} filterApply={FilterApply} filterPlaceholder="Pesquisar" />
                    <Column
                        field="method"
                        header="Método"
                        filter
                        showFilterMenuOptions={false}
                        filterElement={
                            <>
                                <Dropdown
                                    value={lazyState.filters.method.value}
                                    placeholder="Selecione o método"
                                    filter={true}
                                    options={methodsList}
                                    loading={isLoadingMethods}
                                    onChange={async (event) => {
                                        lazyState.filters.method.value = event.target.value;
                                        setLazyState(lazyState);
                                        await loadLogs();
                                    }}
                                />
                            </>
                        }
                    />
                    <Column field="date" header="Data" body={(rowData) => moment(rowData.date).format('DD/MM/YYYY HH:mm:ss')} />
                </DataTable>
            </Fieldset>
        </div>
    );
}
