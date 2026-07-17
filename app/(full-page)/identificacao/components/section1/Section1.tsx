'use client';

import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';

import { QueryKey } from '@/app/lib/react-query';
import { Animal } from '@/app/api/models/animal';
import { animalService } from '@/app/api/services/animal/animal_service_impl';
import { occurrenceService } from '@/app/api/services/occurrence/occurrence_service_impl';

import { getFirebaseToken } from '@/firebase';

import { IdentificationImageUpload } from './components/IdentificationImageUpload';
import { IdentificationAudioRecorder } from './components/IdentificationAudioRecorder';

import './styles.scss';

interface SectionForm {
    image: File | null;
    audio: File | null;
    description: string;
    deviceId: string;
    latitude: number | null;
    longitude: number | null;
    animalSupposedId: number | null;
    firebaseToken: string;
}

const getOrCreateDeviceId = () => {
    const storageKey = 'radar_peconhento_device_id';
    const currentDeviceId = localStorage.getItem(storageKey);

    if (currentDeviceId) {
        return currentDeviceId;
    }

    const newDeviceId = crypto.randomUUID();
    localStorage.setItem(storageKey, newDeviceId);

    return newDeviceId;
};

export default function Section1() {
    const toast = useRef<Toast>(null);
    const queryClient = useQueryClient();

    const [loading, setLoading] = useState(false);

    const [sectionForm, setSectionForm] = useState<SectionForm>({
        image: null,
        audio: null,
        description: '',
        deviceId: '',
        latitude: null,
        longitude: null,
        animalSupposedId: null,
        firebaseToken: ''
    });

    const { data: animails, isLoading: isLoadingAnimal } = useQuery<Animal[]>({
        queryKey: [QueryKey.ANIMAL_FIND_ACTIVE],
        queryFn: async () => animalService.findActive(1),
        enabled: true
    });

    useEffect(() => {
        setSectionForm((prev) => ({
            ...prev,
            deviceId: getOrCreateDeviceId()
        }));

        getFirebaseToken()
            .then((token: string) => {
                setSectionForm((prev) => ({
                    ...prev,
                    firebaseToken: token
                }));
            })
            .catch(() => {
                setSectionForm((prev) => ({
                    ...prev,
                    firebaseToken: ''
                }));
            });

        navigator.geolocation?.getCurrentPosition(
            (position) => {
                setSectionForm((prev) => ({
                    ...prev,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }));
            },
            () => {
                setSectionForm((prev) => ({
                    ...prev,
                    latitude: null,
                    longitude: null
                }));
            }
        );
    }, []);

    const showErrorToast = (message: string) => {
        toast.current?.show({
            severity: 'error',
            summary: 'Validação',
            detail: message,
            life: 3000
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!sectionForm.image) {
            showErrorToast('A imagem do animal é obrigatória.');
            return;
        }

        if (!sectionForm.animalSupposedId) {
            showErrorToast('Selecione o tipo de animal suspeito.');
            return;
        }

        try {
            setLoading(true);

            await occurrenceService.sendImage({
                animalSupposedId: sectionForm.animalSupposedId,
                image: sectionForm.image,
                audio: sectionForm.audio,
                latitude: sectionForm.latitude,
                longitude: sectionForm.longitude,
                deviceId: sectionForm.deviceId,
                firebaseToken: sectionForm.firebaseToken,
                description: sectionForm.description
            });

            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso!',
                detail: 'Identificação iniciada com sucesso.',
                life: 3000
            });

            setSectionForm((prev) => ({
                ...prev,
                image: null,
                audio: null,
                description: '',
                animalSupposedId: null
            }));

            queryClient.invalidateQueries({
                queryKey: [QueryKey.LOAD_BY_DEVICE_ID]
            });
        } catch (err) {
            console.error(err);

            toast.current?.show({
                severity: 'error',
                summary: 'Erro!',
                detail: 'Erro ao salvar o registro.',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Toast ref={toast} />

            <form onSubmit={handleSubmit}>
                <Card className="identification-section1 border-round-2xl">
                    <div className="grid">
                        <div className="col-12">
                            <div className="flex align-items-center gap-2 mb-3">
                                <span className="identification-section1__step">1</span>

                                <div>
                                    <h2 className="m-0 text-2xl font-bold text-900">Identificação de Animal Peçonhento</h2>

                                    <p className="mt-2 mb-0 text-600 text-sm">Envie os dados do animal para análise por inteligência artificial.</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 md:col-4">
                            <IdentificationImageUpload
                                image={sectionForm.image}
                                onImageSelect={(image) => {
                                    setSectionForm((prev) => ({
                                        ...prev,
                                        image
                                    }));
                                }}
                            />
                        </div>

                        <div className="col-12 md:col-4">
                            <IdentificationAudioRecorder
                                audio={sectionForm.audio}
                                onAudioChange={(audio) => {
                                    setSectionForm((prev) => ({
                                        ...prev,
                                        audio
                                    }));
                                }}
                            />
                        </div>

                        <div className="col-12 md:col-4">
                            <div className="border-1 surface-border border-round-xl p-3 h-full flex flex-column">
                                <div className="flex align-items-center gap-2 mb-3">
                                    <span className="identification-section1__mini-step">3</span>
                                    <strong>Informações adicionais</strong>
                                </div>

                                <label className="text-sm font-semibold mb-2 text-700">Tipo de animal suspeito</label>

                                <Dropdown
                                    options={animails}
                                    loading={isLoadingAnimal}
                                    optionLabel="name"
                                    optionValue="id"
                                    placeholder="Selecione o tipo"
                                    className="w-full mb-3"
                                    value={sectionForm.animalSupposedId}
                                    onChange={(e) =>
                                        setSectionForm((prev) => ({
                                            ...prev,
                                            animalSupposedId: e.value
                                        }))
                                    }
                                />

                                <label className="text-sm font-semibold mb-2 text-700">Descrição opcional</label>

                                <InputTextarea
                                    rows={5}
                                    maxLength={500}
                                    placeholder="Ex: Corpo com anéis vermelhos, pretos e brancos."
                                    className="w-full resize-none"
                                    value={sectionForm.description}
                                    onChange={(e) =>
                                        setSectionForm((prev) => ({
                                            ...prev,
                                            description: e.target.value
                                        }))
                                    }
                                />

                                <div className="text-right text-500 text-xs mt-2">{sectionForm.description.length}/500 caracteres</div>
                            </div>
                        </div>

                        <div className="col-12">
                            <Button type="submit" label="Iniciar identificação" icon="pi pi-send" severity="success" className="w-full" loading={loading} />
                        </div>
                    </div>
                </Card>
            </form>
        </>
    );
}
