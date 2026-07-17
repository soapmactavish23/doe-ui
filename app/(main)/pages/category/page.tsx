'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { Fieldset } from 'primereact/fieldset';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { DialogEdit } from './components/DialogEdit';
import { InputText } from 'primereact/inputtext';
import { categoryService } from '@/app/api/services/category/category_service_impl';
import { Category, newCategory } from '@/app/api/models/category';
import { Message } from '@/app/components/Message';
import { buildActionTemplate } from '@/app/components/datatable/buildActionTemplate';
import { imageBodyTemplate } from '@/app/components/datatable/image-body-template';
import { confirmDelete } from '@/app/components/datatable/confirmDelete';
import { useQuery } from '@tanstack/react-query';
import { QueryKey } from '@/app/lib/react-query';

export default function Categories() {
    // ################################### DATATABLE ###################################
    const [listFiltered, setListFiltered] = useState<Category[]>([]);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Category[]>>(null);

    const {
        data: list,
        isLoading,
        refetch
    } = useQuery<Category[]>({
        queryKey: [QueryKey.CATEGORY_FIND_ALL],
        queryFn: async () => {
            const response = await categoryService.findAll();
            setListFiltered(response);
            return response;
        },
        enabled: true
    });

    const handleOnSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value.toLowerCase();
        const result = list!.filter((res) => res.name.toLowerCase().includes(search));
        setListFiltered(result);
    };

    // ################################### DIALOG ###################################
    let [obj, setObj] = useState<Category>(newCategory);

    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);

    const handleOpenNew = () => {
        setObj(newCategory);
        setVisibleDialog(true);
    };

    const handleOpenEdit = (data: Category) => {
        setObj({ ...data });
        setVisibleDialog(true);
    };

    const handleOpenDelete = (rowData: Category) => {
        confirmDelete({
            name: rowData.name,
            onAccept: () => {
                categoryService
                    .remove(rowData.id!)
                    .then(() => {
                        toast.current!.show({
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

    const handleOnClose = () => {
        setVisibleDialog(false);
        setObj(newCategory);
        refetch();
    };

    return (
        <div className="card">
            <DialogEdit visibleDialog={visibleDialog} obj={obj} onClose={handleOnClose} />
            <ConfirmDialog />
            <Fieldset legend="Gerenciamento de Categorias">
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
                    loading={isLoading}
                    emptyMessage={Message.empty}
                >
                    <Column field="image" header="Image" body={imageBodyTemplate}></Column>
                    <Column field="name" header="Nome"></Column>
                    <Column body={buildActionTemplate<Category>(handleOpenEdit, handleOpenDelete)} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </Fieldset>
        </div>
    );
}
