/* eslint-disable @next/next/no-img-element */
'use client';

import { newVerifyRequest, VerifyRequest } from '@/app/api/models/request/verify_request';
import { VerifyResponse } from '@/app/api/models/response/verify_response';
import { occurrenceService } from '@/app/api/services/occurrence/occurrence_service_impl';
import { imageBodyTemplate } from '@/app/components/datatable/image-body-template';
import { Message } from '@/app/components/Message';
import { QueryKey } from '@/app/lib/react-query';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';

export default function ValidOccurrence() {
    // ################################### DATATABLE ###################################
    const [listFiltered, setListFiltered] = useState<VerifyResponse[]>();
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<VerifyResponse[]>>(null);

    const {
        data: list,
        isLoading,
        refetch
    } = useQuery<VerifyResponse[]>({
        queryKey: [QueryKey.LOAD_VERIFY],
        queryFn: async () => {
            const response = await occurrenceService.loadForVerify();
            setListFiltered(response);
            return response;
        },
        enabled: true
    });

    const handleOnSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value.toLowerCase();
        const result = list!.filter((res) => {
            const containAnimalUser = res.nameAnimalUser.toLowerCase().includes(search);
            const containAnimal = res.nameAnimal.toLowerCase().includes(search);
            const containAnimalAi = res.nameAnimalAi.toLowerCase().includes(search);
            const containAnalistName = res.analistName.toLowerCase().includes(search);
            if (containAnimalUser || containAnimal || containAnimalAi || containAnalistName) {
                return res;
            }
            return null;
        });
        setListFiltered(result);
    };

    const statusBodyTemplate = (rowData: VerifyResponse) => {
        const severy = extractSevery(rowData.status);

        return <Tag value={rowData.statusDescription} severity={severy} className="pointer"></Tag>;
    };

    const extractSevery = (status: string): 'success' | 'warning' | 'danger' => {
        switch (status) {
            case 'NOT_ANALYSED':
                return 'warning';
            case 'ERROR':
                return 'danger';
            case 'RIGHT':
                return 'success';
            default:
                return 'warning';
        }
    };

    // ################################### DIALOG ###################################
    let [obj, setObj] = useState<VerifyRequest>();

    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);

    const handleOpenEdit = (data: VerifyRequest) => {
        setObj({ ...data });
        setVisibleDialog(true);
    };

    const handleOnClose = () => {
        setVisibleDialog(false);
        setObj(newVerifyRequest);
        refetch();
    };

    return (
        <div className="card">
            <Fieldset legend="Verificar ocorrência">
                <Toast ref={toast} />
                <DataTable
                    ref={dt}
                    value={listFiltered}
                    dataKey="id"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate={Message.currentPageReportTemplate}
                    header={
                        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                            <InputText type="search" placeholder="Pesquisar..." onInput={handleOnSearch} />
                        </div>
                    }
                    loading={isLoading}
                    emptyMessage={Message.empty}
                >
                    <Column
                        field="image"
                        header="Image"
                        body={(rowData: VerifyResponse) => {
                            return <img src={`${rowData.url}`} alt="Imagem" className="shadow-2 border-round" style={{ width: '64px' }} />;
                        }}
                    ></Column>
                    <Column field="nameAnimalUser" header="Animal enviado pelo usuário"></Column>
                    <Column
                        field="image"
                        header="Image"
                        body={(rowData: VerifyResponse) => {
                            return <img src={`${rowData.urlAi}`} alt="Imagem" className="shadow-2 border-round" style={{ width: '64px' }} />;
                        }}
                    ></Column>
                    <Column field="nameAnimalUser" header="Animal identificado pela IA"></Column>
                    <Column field="analistName" header="Analista"></Column>
                    <Column field="nameAnimal" header="Animal identificado pelo analista"></Column>
                    <Column field="status" header="Status" showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} />
                    <Column field="statusDescription" header="Resultado da análise"></Column>
                    <Column field="date" header="Data" body={(rowData) => moment(rowData.date).format('DD/MM/YYYY HH:mm:ss')} />
                    <Column
                        body={
                            <>
                                <Button icon="pi pi-check" rounded severity="success" className="mr-2" onClick={() => console.log('validar')} />
                            </>
                        }
                    ></Column>
                </DataTable>
            </Fieldset>
        </div>
    );
}
