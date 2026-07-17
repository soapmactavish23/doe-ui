import { confirmDialog } from 'primereact/confirmdialog';

export function confirmDelete<T = unknown>({
    name,
    onAccept,
    message,
    header = 'Deletar Registro',
    icon = 'pi pi-info-circle'
}: {
    name?: string;
    message?: string;
    onAccept: () => void;
    header?: string;
    icon?: string;
}) {
    confirmDialog({
        message: message || `Deseja excluir o registro ${name ?? ''}?`,
        header,
        icon,
        acceptClassName: 'p-button-danger',
        accept: onAccept,
        acceptLabel: 'Sim',
        rejectLabel: 'Não'
    });
}
