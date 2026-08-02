'use client';

import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';

import { Message } from '@/app/components/Message';
import { buildActionTemplate } from '@/app/components/datatable/buildActionTemplate';
import { confirmDelete } from '@/app/components/datatable/confirmDelete';

import { newResponsable, Responsable } from '../../types/responsable/responsable';

import DialogResponsable from './DialogResponsable';

interface DataTableResponsablesProps {
    list: Responsable[];
    onChange: (list: Responsable[]) => void;
}

function cloneResponsable(responsable: Responsable): Responsable {
    return {
        ...responsable,
        address: {
            ...responsable.address
        }
    };
}

export default function DataTableResponsables({ list, onChange }: DataTableResponsablesProps) {
    const dt = useRef<DataTable<Responsable[]>>(null);

    const [isSending] = useState(false);

    const [visibleDialog, setVisibleDialog] = useState(false);

    const [obj, setObj] = useState<Responsable>(cloneResponsable(newResponsable));

    /*
     * Como os responsáveis novos podem não possuir ID,
     * guardamos o índice selecionado para realizar a edição.
     */
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const [search, setSearch] = useState('');

    /*
     * A lista filtrada é derivada da propriedade list.
     * Não é necessário manter uma segunda lista em useState.
     */
    const listFiltered = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        if (!normalizedSearch) {
            return list;
        }

        return list.filter((responsable) => {
            return responsable.name.toLowerCase().includes(normalizedSearch);
        });
    }, [list, search]);

    /*
     * Caso a lista seja recarregada, fecha qualquer edição
     * que esteja apontando para um índice inexistente.
     */
    useEffect(() => {
        if (editingIndex !== null && editingIndex >= list.length) {
            setEditingIndex(null);
            setVisibleDialog(false);
        }
    }, [list.length, editingIndex]);

    const handleOpenNew = () => {
        setEditingIndex(null);
        setObj(cloneResponsable(newResponsable));
        setVisibleDialog(true);
    };

    const handleOpenEdit = (rowData: Responsable) => {
        /*
         * A tabela filtrada mantém as mesmas referências dos
         * elementos presentes na lista original.
         */
        const index = list.findIndex((responsable) => responsable === rowData);

        if (index < 0) {
            return;
        }

        setEditingIndex(index);
        setObj(cloneResponsable(rowData));
        setVisibleDialog(true);
    };

    const handleOpenDelete = (rowData: Responsable) => {
        const index = list.findIndex((responsable) => responsable === rowData);

        if (index < 0) {
            return;
        }

        confirmDelete({
            name: rowData.name,
            onAccept: () => {
                const updatedList = list.filter((_, currentIndex) => currentIndex !== index);

                onChange(updatedList);
            }
        });
    };

    const handleOnClose = () => {
        setVisibleDialog(false);
        setEditingIndex(null);
        setObj(cloneResponsable(newResponsable));
    };

    const handleOnSearch = (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const handleOnSave = (responsable: Responsable) => {
        let updatedList: Responsable[];

        if (editingIndex !== null) {
            updatedList = list.map((currentResponsable, index) => {
                if (index !== editingIndex) {
                    return currentResponsable;
                }

                return cloneResponsable({
                    ...responsable,

                    /*
                     * Mantém o ID original na edição.
                     */
                    id: list[editingIndex].id ?? responsable.id ?? null
                });
            });
        } else {
            updatedList = [
                ...list,
                cloneResponsable({
                    ...responsable,
                    id: responsable.id ?? null
                })
            ];
        }

        /*
         * Atualiza o estado do FormPatient.
         */
        onChange(updatedList);

        /*
         * Fecha e limpa o diálogo após adicionar ou editar.
         */
        handleOnClose();
    };

    return (
        <>
            <DialogResponsable visibleDialog={visibleDialog} obj={obj} onClose={handleOnClose} onSave={handleOnSave} />

            <Fieldset legend="Responsáveis">
                <DataTable
                    ref={dt}
                    value={listFiltered}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate={Message.currentPageReportTemplate}
                    header={
                        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                            <Button type="button" label="Novo" icon="pi pi-plus" severity="success" onClick={handleOpenNew} />

                            <InputText type="search" value={search} placeholder="Pesquisar..." onChange={handleOnSearch} />
                        </div>
                    }
                    loading={isSending}
                    emptyMessage={Message.empty}
                >
                    <Column field="name" header="Nome" />

                    <Column field="contact" header="Contato" />

                    <Column field="type" header="Tipo" />

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
