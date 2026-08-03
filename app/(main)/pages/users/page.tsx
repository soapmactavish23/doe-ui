'use client';

import { useRef } from 'react';

import { DataTable } from 'primereact/datatable';

import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';

import { Toast } from 'primereact/toast';

import { confirmDelete } from '@/app/components/datatable/confirmDelete';
import { Message } from '@/app/components/Message';

import { User } from './domain/user';

import { useUsers } from './application/useUsers';

import UserDialog from './presentation/UserDialog';
import UserDataTable from './presentation/UserDataTable';

export default function UserPage() {
    const toast = useRef<Toast>(null);

    const dt = useRef<DataTable<User[]>>(null);

    const {
        users,
        totalElements,
        groups,
        selectedUser,
        dialogVisible,
        lazyState,
        loading,
        saving,
        loadingGroups,
        openNew,
        openEdit,
        closeDialog,
        save,
        remove,
        resetPassword,
        changeStatus,

        handlePage,
        handleFilter
    } = useUsers();

    const handleResetPassword = (user: User) => {
        confirmDialog({
            message: `Deseja realmente resetar a senha do usuário ${user.name}?`,

            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',

            acceptLabel: 'Confirmar',
            rejectLabel: 'Cancelar',

            accept: async () => {
                try {
                    await resetPassword(user);

                    toast.current?.show({
                        severity: 'success',
                        summary: Message.successMsg,
                        detail: 'Sucesso ao resetar a senha do usuário.',
                        life: 3000
                    });
                } catch (error) {
                    console.error(error);

                    toast.current?.show({
                        severity: 'error',
                        summary: Message.errorMsg,
                        detail: 'Erro ao resetar a senha do usuário.'
                    });
                }
            }
        });
    };

    const handleDelete = (user: User) => {
        confirmDelete({
            name: user.name,

            onAccept: async () => {
                try {
                    await remove(user);

                    toast.current?.show({
                        severity: 'success',
                        summary: Message.successMsg,
                        detail: Message.successDelete,
                        life: 3000
                    });
                } catch (error) {
                    console.error(error);

                    toast.current?.show({
                        severity: 'error',
                        summary: Message.errorMsg,
                        detail: Message.errorDelete
                    });
                }
            }
        });
    };

    const handleChangeStatus = async (user: User) => {
        try {
            await changeStatus(user);
        } catch (error) {
            console.error(error);

            toast.current?.show({
                severity: 'error',
                summary: Message.errorMsg,
                detail: 'Erro ao alterar o status do usuário.'
            });
        }
    };

    return (
        <div className="card">
            <Toast ref={toast} />

            <ConfirmDialog />

            <UserDialog visible={dialogVisible} user={selectedUser} groups={groups} loading={saving} loadingGroups={loadingGroups} onSave={save} onClose={closeDialog} />

            <UserDataTable
                dt={dt}
                users={users}
                totalElements={totalElements}
                loading={loading}
                lazyState={lazyState}
                onNew={openNew}
                onEdit={openEdit}
                onResetPassword={handleResetPassword}
                onDelete={handleDelete}
                onChangeStatus={handleChangeStatus}
                onPage={handlePage}
                onFilter={handleFilter}
            />
        </div>
    );
}
