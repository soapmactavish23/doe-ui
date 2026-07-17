import { useRef } from 'react';

import { Button } from 'primereact/button';
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';

interface IdentificationImageUploadProps {
    image: File | null;
    onImageSelect: (image: File | null) => void;
}

export function IdentificationImageUpload({ image, onImageSelect }: IdentificationImageUploadProps) {
    const fileUploadRef = useRef<FileUpload>(null);

    const handleImageSelect = (event: FileUploadSelectEvent) => {
        const file = event.files?.[0];

        if (!file) {
            return;
        }

        onImageSelect(file);
    };

    const handleClearImage = () => {
        fileUploadRef.current?.clear();
        onImageSelect(null);
    };

    return (
        <div className="border-1 surface-border border-round-xl p-3 h-full flex flex-column">
            <div className="flex align-items-center gap-2 mb-3">
                <span className="identification-section1__mini-step">1</span>
                <strong>Imagem do animal</strong>
            </div>

            <div className="flex flex-column align-items-center justify-content-center text-center gap-2 border-1 border-dashed border-green-200 border-round-xl surface-50 p-4 flex-1 min-h-12rem">
                <i className="pi pi-cloud-upload text-4xl text-green-600" />

                <strong className="text-900">{image ? image.name : 'Arraste e solte a imagem aqui'}</strong>

                <span className="text-500 text-sm">ou</span>

                {!image ? (
                    <FileUpload
                        ref={fileUploadRef}
                        mode="basic"
                        name="image"
                        accept="image/*"
                        maxFileSize={10000000}
                        chooseLabel="Selecionar imagem"
                        onSelect={handleImageSelect}
                        auto={false}
                        customUpload
                        chooseOptions={{
                            icon: 'pi pi-image',
                            className: 'p-button-success'
                        }}
                    />
                ) : (
                    <Button type="button" label="Remover imagem" icon="pi pi-trash" severity="danger" outlined onClick={handleClearImage} />
                )}
            </div>

            <small className="text-center text-500 mt-3 block line-height-3">
                Formatos: JPG, PNG, WEBP
                <br />
                Tamanho máximo: 10MB
            </small>
        </div>
    );
}
