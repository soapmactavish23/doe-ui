'use client';
import { Group, newGroup } from '@/app/(main)/pages/groups/types/group';
import { groupService } from '@/app/(main)/pages/groups/services/group_service_impl';
import { QueryKey } from '@/app/lib/react-query';
import { useQuery } from '@tanstack/react-query';
import { DialogEdit } from './components/DialogEdit';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Fieldset } from 'primereact/fieldset';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { buildActionTemplate } from '@/app/components/datatable/buildActionTemplate';
import { useRef, useState } from 'react';
import { Message } from '@/app/components/Message';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { confirmDelete } from '@/app/components/datatable/confirmDelete';

export default function GroupPage() {
    const [listFiltered, setListFiltered] = useState<Group[]>([]);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Group[]>>(null);

    const {
        data: list,
        isLoading,
        refetch
    } = useQuery<Group[]>({
        queryKey: [QueryKey.GROUP_FIND_ALL],
        queryFn: async () => {
            const response = await groupService.findAll();
            setListFiltered(response);
            return response;
        }
    });

    const [isSending, setIsSending] = useState<boolean>(false);

    const handleOnSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value.toLowerCase();
        const result = list!.filter((res) => res.name.toLowerCase().includes(search));
        setListFiltered(result);
    };

    let [obj, setObj] = useState<Group>(newGroup);

    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);

    const handleOpenNew = () => {
        setObj(newGroup);
        setVisibleDialog(true);
    };

    const handleOpenEdit = (data: Group) => {
        setObj({ ...data });
        setVisibleDialog(true);
    };

    const handleOpenDelete = (rowData: Group) => {
        confirmDelete({
            name: rowData.name,
            onAccept: () => {
                setIsSending(true);
                groupService
                    .remove(rowData.id!)
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

    const handleOnClose = () => {
        setVisibleDialog(false);
        setObj(newGroup);
        refetch();
    };

    return (
        <div className="card">
            <DialogEdit visibleDialog={visibleDialog} obj={obj} onClose={handleOnClose} />
            <ConfirmDialog />
            <Fieldset legend="Gerenciamento de Grupos">
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
                            <Button label="Novo" icon="pi pi-plus" severity="success" onClick={handleOpenNew} />
                            <InputText type="search" placeholder="Pesquisar..." onInput={handleOnSearch} />
                        </div>
                    }
                    loading={isLoading || isSending}
                    emptyMessage={Message.empty}
                >
                    <Column field="name" header="Nome"></Column>
                    <Column body={buildActionTemplate<Group>(handleOpenEdit, handleOpenDelete)} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </Fieldset>
        </div>
    );
}
