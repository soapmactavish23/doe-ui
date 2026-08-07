'use client';

import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { useGroup } from './application/useGroup';

import GroupDataTable from './presentation/GroupDataTable';
import GroupDialog from './presentation/GroupDialog';

import { Group } from './domain/group';
import { Toast } from 'primereact/toast';

export default function GroupsPage() {
    const { groups, selectedGroup, dialogVisible, loading, saving, openNew, openEdit, closeDialog, save, remove, toast } = useGroup();

    const handleDelete = (group: Group) => {
        confirmDialog({
            header: 'Confirmar exclusão',
            message: `Deseja realmente excluir o grupo "${group.name}"?`,
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                await remove(group);
            }
        });
    };

    return (
        <div className="card">
            <ConfirmDialog />
            <Toast ref={toast} />
            <GroupDialog visible={dialogVisible} group={selectedGroup} loading={saving} onSave={save} onClose={closeDialog} />
            <GroupDataTable groups={groups} loading={loading} onNew={openNew} onEdit={openEdit} onDelete={handleDelete} />
        </div>
    );
}
