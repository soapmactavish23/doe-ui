import { useRef, useState } from 'react';
import { Responsable } from '../../types/responsable';
import { DataTable } from 'primereact/datatable';
import { Fieldset } from 'primereact/fieldset';
import { Message } from '@/app/components/Message';
import { Column } from 'primereact/column';
import { buildActionTemplate } from '@/app/components/datatable/buildActionTemplate';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { confirmDelete } from '@/app/components/datatable/confirmDelete';

interface DataTableResponsablesProps {
    list: Responsable[];
}

export default function DataTableResponsables({ list }: DataTableResponsablesProps) {
    const [listFiltered, setListFiltered] = useState<Responsable[]>(list);
    const dt = useRef<DataTable<Responsable[]>>(null);
    const [isSending, setIsSending] = useState<boolean>(false);

    const handleOpenNew = () => {
        // setObj(newGroup);
        // setVisibleDialog(true);
    };

    const handleOpenEdit = (data: Responsable) => {
        // setObj({ ...data });
        // setVisibleDialog(true);
    };

    const handleOpenDelete = (rowData: Responsable) => {
        confirmDelete({
            name: rowData.name,
            onAccept: () => {
                // setIsSending(true);
            }
        });
    };

    const handleOnClose = () => {
        // setVisibleDialog(false);
        // setObj(newGroup);
        // refetch();
    };

    const handleOnSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value.toLowerCase();
        const result = list!.filter((res) => res.name.toLowerCase().includes(search));
        setListFiltered(result);
    };

    return (
        <Fieldset legend="Responsáveis">
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
                        <Button label="Novo" icon="pi pi-plus" severity="success" onClick={handleOpenNew} />
                        <InputText type="search" placeholder="Pesquisar..." onInput={handleOnSearch} />
                    </div>
                }
                loading={isSending}
                emptyMessage={Message.empty}
            >
                <Column field="name" header="Nome"></Column>
                <Column field="contact" header="Contato"></Column>
                <Column field="type" header="Tipo"></Column>
                <Column field="localWorker" header="Local de Trabalho"></Column>
                <Column body={buildActionTemplate<Responsable>(handleOpenEdit, handleOpenDelete)} exportable={false} style={{ minWidth: '12rem' }}></Column>
            </DataTable>
        </Fieldset>
    );
}
