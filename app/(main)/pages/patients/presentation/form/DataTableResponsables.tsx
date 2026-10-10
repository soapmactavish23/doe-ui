'use client';

import { ChangeEvent, useMemo, useRef, useState } from 'react';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';

import { Message } from '@/app/components/Message';
import { buildActionTemplate } from '@/app/components/datatable/buildActionTemplate';
import { confirmDelete } from '@/app/components/datatable/confirmDelete';

import { cloneResponsable, createEmptyResponsable, Responsable, ResponsableType, ResponsableTypeDescription } from '../../domain/responsable';

import DialogResponsable from './DialogResponsable';

interface DataTableResponsablesProps {
    list: Responsable[];
    onChange: (list: Responsable[]) => void;
}

export default function DataTableResponsables({ list, onChange }: DataTableResponsablesProps) {
    const dt = useRef<DataTable<Responsable[]>>(null);

    const [visibleDialog, setVisibleDialog] = useState(false);

    const [selectedResponsable, setSelectedResponsable] = useState<Responsable>(createEmptyResponsable());

    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const [search, setSearch] = useState('');

    const filteredList = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        if (!normalizedSearch) {
            return list;
        }

        return list.filter((responsable) => responsable.name.toLowerCase().includes(normalizedSearch));
    }, [list, search]);

    const handleOpenNew = () => {
        setEditingIndex(null);

        setSelectedResponsable(createEmptyResponsable());

        setVisibleDialog(true);
    };

    const handleOpenEdit = (responsable: Responsable) => {
        const index = list.indexOf(responsable);

        if (index < 0) {
            return;
        }

        setEditingIndex(index);

        setSelectedResponsable(cloneResponsable(responsable));

        setVisibleDialog(true);
    };

    const handleOpenDelete = (responsable: Responsable) => {
        const index = list.indexOf(responsable);

        if (index < 0) {
            return;
        }

        confirmDelete({
            name: responsable.name,
            onAccept: () => {
                const updatedList = list.filter((_, currentIndex) => currentIndex !== index);

                onChange(updatedList);
            }
        });
    };

    const handleCloseDialog = () => {
        setVisibleDialog(false);
        setEditingIndex(null);

        setSelectedResponsable(createEmptyResponsable());
    };

    const handleSave = (responsable: Responsable) => {
        if (editingIndex === null) {
            const updatedList = [...list, cloneResponsable(responsable)];

            onChange(updatedList);
        } else {
            const updatedList = list.map((currentResponsable, index) => {
                if (index !== editingIndex) {
                    return currentResponsable;
                }

                return cloneResponsable({
                    ...responsable,
                    id: list[editingIndex].id ?? responsable.id ?? null
                });
            });

            onChange(updatedList);
        }

        handleCloseDialog();
    };

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    return (
        <>
            <DialogResponsable visible={visibleDialog} responsable={selectedResponsable} onClose={handleCloseDialog} onSave={handleSave} />

            <Fieldset legend="Responsáveis">
                <DataTable
                    ref={dt}
                    value={filteredList}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate={Message.currentPageReportTemplate}
                    header={
                        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                            <Button type="button" label="Novo" icon="pi pi-plus" severity="success" onClick={handleOpenNew} />

                            <InputText type="search" value={search} placeholder="Pesquisar..." onChange={handleSearch} />
                        </div>
                    }
                    emptyMessage={Message.empty}
                >
                    <Column field="name" header="Nome" />

                    <Column field="contact" header="Contato" />

                    <Column field="type" header="Tipo" body={(rowData) => ResponsableTypeDescription[rowData.type as ResponsableType] ?? '-'} />

                    <Column field="localWorker" header="Local de Trabalho" />

                    <Column
                        body={buildActionTemplate<Responsable>(handleOpenEdit, handleOpenDelete)}
                        exportable={false}
                        style={{
                            minWidth: '12rem'
                        }}
                    />
                </DataTable>
            </Fieldset>
        </>
    );
}
