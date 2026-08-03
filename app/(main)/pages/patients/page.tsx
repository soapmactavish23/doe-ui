'use client';

import { useRef } from 'react';

import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

import { confirmDelete } from '@/app/components/datatable/confirmDelete';
import { Message } from '@/app/components/Message';

import { usePatientList } from './application/usePatientList';

import { PatientResponse } from './domain/patient';

import PatientDataTable from './presentation/list/PatientDataTable';

export default function PatientsPage() {
    const toast = useRef<Toast>(null);

    const {
        patients,
        totalElements,
        lazyState,
        loading,

        openNew,
        openEdit,
        remove,

        handlePage,
        handleFilter
    } = usePatientList();

    const handleDelete = (patient: PatientResponse) => {
        confirmDelete({
            name: patient.name,

            onAccept: async () => {
                try {
                    await remove(patient);

                    toast.current?.show({
                        severity: 'success',
                        summary: Message.successMsg,
                        detail: Message.successDelete,
                        life: 3000
                    });
                } catch (error) {
                    console.error('Erro ao excluir paciente:', error);

                    toast.current?.show({
                        severity: 'error',
                        summary: Message.errorMsg,
                        detail: Message.errorDelete
                    });
                }
            }
        });
    };

    return (
        <div className="card">
            <Toast ref={toast} />

            <ConfirmDialog />

            <PatientDataTable patients={patients} totalElements={totalElements} loading={loading} lazyState={lazyState} onNew={openNew} onEdit={openEdit} onDelete={handleDelete} onPage={handlePage} onFilter={handleFilter} />
        </div>
    );
}
