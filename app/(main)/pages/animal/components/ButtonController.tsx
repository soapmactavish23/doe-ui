import { Button } from 'primereact/button';

interface ButtonControllerProps {
    labelAdd: string,
    labelRemove: string,
    onAdd: () => void;
    onRemove: () => void;
}

export default function ButtonController(props: ButtonControllerProps) {
    return (
        <div className="grid p-fluid">
            <div className="col-3">
                <Button label={props.labelAdd} severity="success" icon="pi pi-plus" type="button" onClick={props.onAdd} />
            </div>
            <div className="col-3">
                <Button label={props.labelRemove} severity="danger" icon="pi pi-times" type="button" onClick={props.onRemove} />
            </div>
            <div className="col-6"></div>
        </div>
    );
}
