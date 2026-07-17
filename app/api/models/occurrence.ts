import { Accident } from './accident';
import { AnimalResponse, AnimalSummaryResponse, newAnimal } from './animal';
import { IdentificationResponse } from './identification';

export interface Occurrence {
    id: number;
    animal: AnimalResponse;
    supposedAnimal: AnimalResponse;
    date: Date;
    latitude: number;
    longitude: number;
    url: string;
}

export interface OccurrenceRequest {
    image: File;
    audio: File | null;
    description: string;
    deviceId: string;
    latitude: number | null;
    longitude: number | null;
    animalSupposedId: number | null;
    firebaseToken: string;
}

export interface OccurrenceResponse {
    id: number;
    animal: AnimalSummaryResponse;
    supposedAnimal: AnimalSummaryResponse;
    image: string;
    date: Date;
    animalName: string;
    latitude: number;
    longitude: number;
    imageUrl: string;
    audioUrl: string | null;
    description: string | null;
    status: 'Finalizado' | 'Em análise' | 'Erro';
    identificationResponse: IdentificationResponse;
}

export interface OccurrenceListResponse {
    id: number;
    image: string;
    date: Date;
    animalName: string;
    status: 'Finalizado' | 'Em análise' | 'Erro';
}
