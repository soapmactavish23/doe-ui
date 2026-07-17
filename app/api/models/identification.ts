import { Animal, AnimalResponse } from './animal';

export interface IdentificationResponse {
    scientificName: string;
    iaDescription: string;
    confidence: number;
    inferences: InferenceResponse[];
}

export interface InferenceResponse {
    id: number;
    modelName: string;
    confidence: number;
    inferenceTimeMs: number;
    startedAt: Date;
    finishedAt: Date;
    animal: AnimalResponse;
}
