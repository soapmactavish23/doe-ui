/* eslint-disable react/display-name */
import { Button } from 'primereact/button';
import React from 'react';

export function buildActionTemplate<T>(onEdit: (data: T) => void, onDelete: (data: T) => void) {
    return (rowData: T) => (
        <React.Fragment>
            <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => onEdit(rowData)} />
            <Button icon="pi pi-trash" rounded severity="danger" onClick={() => onDelete(rowData)} />
        </React.Fragment>
    );
}
