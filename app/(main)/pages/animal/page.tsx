/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { Animal, newAnimal } from '@/app/api/models/animal';
import { Category, newCategory } from '@/app/api/models/category';
import { animalService } from '@/app/api/services/animal/animal_service_impl';
import { categoryService } from '@/app/api/services/category/category_service_impl';
import { confirmDelete } from '@/app/components/datatable/confirmDelete';
import { FilterApply } from '@/app/components/datatable/filter-apply';
import { FilterClear } from '@/app/components/datatable/filter-clear';
import { imageBodyTemplate } from '@/app/components/datatable/image-body-template';
import { Message } from '@/app/components/Message';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { DataTable, DataTablePageEvent, DataTableFilterEvent } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { Fieldset } from 'primereact/fieldset';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import { DialogEdit } from './components/DialogEdit';
import { useQuery } from '@tanstack/react-query';
import { QueryKey } from '@/app/lib/react-query';
import { DataTableFilterMeta, LazyTableState } from '@/app/api/core/pageable';

interface AnimalFilters extends DataTableFilterMeta {
    name: { value: ''; matchMode: 'contains' };
    scientificName: { value: ''; matchMode: 'contains' };
    categoryId: { value: ''; matchMode: 'contains' };
}

export default function AnimalPage() {
    // ################################### DATATABLE ###################################
    const [list, setList] = useState<Animal[]>([]);
    const [totalElements, setTotalElements] = useState<number>(0);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Animal[]>>(null);

    // ################################### LAZY ###################################
    const [lazyState, setLazyState] = useState<LazyTableState<AnimalFilters>>({
        first: 0,
        rows: 10,
        page: 0,
        sortField: '',
        sortOrder: 0,
        filters: {
            name: { value: '', matchMode: 'contains' },
            scientificName: { value: '', matchMode: 'contains' },
            categoryId: { value: '', matchMode: 'contains' }
        }
    });

    const { isLoading, refetch } = useQuery<Animal[]>({
        queryKey: [QueryKey.ANIMAL_FIND_ALL],
        queryFn: async () => {
            const response = await animalService.search({
                categoryId: lazyState.filters.categoryId.value,
                pageable: {
                    page: lazyState.page,
                    size: lazyState.rows
                },
                name: lazyState.filters.name.value,
                scientificName: lazyState.filters.scientificName.value
            });
            setList(response.content);
            setTotalElements(response.totalElements);
            return response.content;
        },
        enabled: true
    });

    const { data: categories } = useQuery<Category[]>({
        queryKey: [QueryKey.CATEGORY_FIND_ALL],
        queryFn: async () => await categoryService.findAll(),
        enabled: true
    });

    useEffect(() => {
        refetch();
    }, [lazyState]);

    // ################################### DIALOG ###################################
    let [obj, setObj] = useState<Animal>(newAnimal);
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);

    const handleOpenNew = () => {
        setObj({
            id: null,
            name: '',
            url: '',
            category: newCategory,
            description: '',
            scientificName: '',
            statusScanner: true,
            accidents: []
        });
        setVisibleDialog(true);
    };

    const handleOpenEdit = async (data: Animal) => {
        const result = await animalService.findById(data.id!);
        setObj(result);
        setVisibleDialog(true);
    };

    const handleOpenDelete = (rowData: Animal) => {
        confirmDelete({
            name: rowData.name,
            onAccept: () => {
                animalService
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
        setObj(newAnimal);
        refetch();
    };

    return (
        <div className="card">
            <DialogEdit visibleDialog={visibleDialog} obj={obj} onClose={handleOnClose} />
            <ConfirmDialog />
            <Fieldset legend="Gerenciamento de Animais">
                <Toast ref={toast} />
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
                        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                            <Button label="Novo" icon="pi pi-plus" severity="success" onClick={handleOpenNew} />
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
                            filters: event.filters as AnimalFilters,
                            page: event.page,
                            rows: event.rows
                        });
                        await refetch();
                    }}
                    filters={lazyState.filters}
                >
                    <Column field="image" body={imageBodyTemplate}></Column>
                    <Column field="name" header="Nome" filter showFilterMenuOptions={false} filterClear={FilterClear} filterApply={FilterApply} filterPlaceholder="Pesquisar" />
                    <Column field="scientificName" header="Nome Ciêntifico" filter showFilterMenuOptions={false} filterClear={FilterClear} filterApply={FilterApply} filterPlaceholder="Pesquisar"></Column>
                    <Column
                        field="category.name"
                        header="Categoria"
                        filter
                        showFilterMenuOptions={false}
                        filterElement={
                            <>
                                <Dropdown
                                    value={lazyState.filters.categoryId.value}
                                    onChange={(e) => {
                                        if (e.value) {
                                            lazyState.page = 0;
                                            lazyState.filters.categoryId.value = e.value;
                                        } else {
                                            lazyState.filters.categoryId.value = '';
                                        }
                                        setLazyState(lazyState);
                                        refetch();
                                    }}
                                    showClear
                                    optionValue="id"
                                    optionLabel="name"
                                    options={categories}
                                    placeholder="Selecione"
                                    filter
                                />
                            </>
                        }
                    ></Column>
                    <Column
                        exportable={false}
                        style={{ minWidth: '12rem' }}
                        body={(rowData: Animal) => {
                            return (
                                <React.Fragment>
                                    <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => handleOpenEdit(rowData)} />
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
