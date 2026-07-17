import { convertDangerColor, convertDangerType } from '@/app/api/models/accident';
import { Animal } from '@/app/api/models/animal';
import { convertTreatment } from '@/app/api/models/tratment';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Fieldset } from 'primereact/fieldset';
import { Image } from 'primereact/image';

interface DialogProps {
    visibleDialog: boolean;
    obj: Animal;
    onClose?: () => void;
}

export default function DialogDetails({ visibleDialog, obj, onClose }: DialogProps) {
    const handleCancel = () => {
        if (onClose) onClose();
    };

    const footer = (
        <>
            <Button label="Cancelar" icon="pi pi-times" onClick={handleCancel} className="p-button-text" />
        </>
    );

    const accidents = Array.isArray(obj?.accidents) ? obj!.accidents : [];
    console.log(accidents);

    return (
        <Dialog visible={visibleDialog} style={{ width: '80rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Detalhes do Animal" modal className="p-fluid" footer={footer} onHide={handleCancel}>
            <div className="text-center">
                <Image src={obj.url!} preview alt="img-animal" className="img-thumbnail" width="250" />
                <h3>{obj.name}</h3>
                <h6>{obj.scientificName}</h6>
                <hr />
                <p>{obj.description}</p>
            </div>
            <Accordion>
                {accidents.map((accident, idx) => (
                    <AccordionTab
                        key={accident.id ?? idx}
                        header={
                            <span className="flex align-items-center gap-2 w-full">
                                <Badge value={convertDangerType(accident.danger)} severity={convertDangerColor(accident.danger) as any} />
                            </span>
                        }
                    >
                        <p className="m-0">
                            <b>Sintomas:</b> {accident.symptoms || '—'}
                        </p>
                        <hr />
                        <p className="m-0">
                            <b>Exames Laboratoriais:</b> {accident.exams || '—'}
                        </p>
                        <hr />
                        <Fieldset legend="Tratamentos">
                            {accident.treatments.map((treatment, idx) => {
                                return (
                                    <>
                                        <Fieldset key={idx} legend={convertTreatment(treatment.type)}>
                                            <div>
                                                <p className="m-0">
                                                    <b>Tratamento:</b> {treatment.description || '—'}
                                                </p>
                                                <hr />
                                                {treatment.obs && (
                                                    <p className="m-0">
                                                        <b>OBS:</b> {treatment.obs}
                                                    </p>
                                                )}
                                            </div>
                                        </Fieldset>
                                        <br />
                                    </>
                                );
                            })}
                        </Fieldset>
                    </AccordionTab>
                ))}
            </Accordion>
        </Dialog>
    );
}
