/* eslint-disable @next/next/no-img-element */
'use client';

import { Animal, newAnimal } from '@/app/api/models/animal';
import { animalService } from '@/app/api/services/animal/animal_service_impl';
import CardEmpty from '@/app/components/card-empty/CardEmpty';
import CardFlip from '@/app/components/card-flip/CardFlip';
import CardLoading from '@/app/components/card-loading/CardLoading';
import { QueryKey } from '@/app/lib/react-query';
import { useQuery } from '@tanstack/react-query';
import DialogDetails from './components/DialogDetails';
import { useEffect, useState } from 'react';
import LoadingContent from '@/layout/LoadingContent';

export default function AnimalPage() {
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [obj, setObj] = useState<Animal>(newAnimal);
    const [animalId, setAnimalId] = useState<number | undefined>(undefined);

    const [loadingDetails, setLoadingDetails] = useState(false);

    const { data: animals, isLoading } = useQuery<Animal[]>({
        queryKey: [QueryKey.ANIMAL_CATEGORY_ID],
        queryFn: async () => {
            const categoryId = localStorage.getItem('categoryId');
            const result = await animalService.search({
                categoryId: categoryId!,
                name: '',
                scientificName: '',
                pageable: { size: 10, page: 0 }
            });
            return result.content;
        },
        enabled: true
    });

    const { data: animalDetails } = useQuery<Animal>({
        queryKey: [QueryKey.ANIMAL_FIND_BY_ID, animalId],
        queryFn: async () => {
            const result = await animalService.findById(animalId!);
            return result;
        },
        enabled: !!animalId
    });

    useEffect(() => {
        if (!animalDetails) return;

        setObj(animalDetails);
        setVisibleDialog(true);
        setLoadingDetails(false);
    }, [animalDetails]);

    const handleOpenDetails = (id: number) => {
        setLoadingDetails(true);
        setAnimalId(id);
    };

    const handleOnClose = () => {
        setVisibleDialog(false);
        setObj(newAnimal);
        setAnimalId(undefined);
        setLoadingDetails(false);
    };

    return (
        <>
            {loadingDetails && <LoadingContent />}

            <DialogDetails visibleDialog={visibleDialog} obj={obj} onClose={handleOnClose} />

            <section className="rp-wrap">
                <h3 className="rp-title">Selecione o Animal</h3>

                <div className="grid justify-content-center gap-3">
                    {isLoading && <CardLoading />}

                    {!isLoading && (!animals || animals.length === 0) && <CardEmpty title="Nenhum animal encontrado." />}

                    {!isLoading && animals?.map((animal) => <CardFlip key={animal.id} name={animal.name} url={animal.url!} onClick={() => handleOpenDetails(animal.id!)} />)}
                </div>
            </section>
        </>
    );
}
