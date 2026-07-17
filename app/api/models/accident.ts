import { Animal, AnimalResponse, newAnimal } from './animal';
import { Treatment } from './tratment';

export const DangerList = [
    { id: 'LIGHT', description: 'Leve', severity: 'success' },
    { id: 'MODERATE', description: 'Moderado', severity: 'primary' },
    { id: 'SERIOUS', description: 'Grave', severity: 'danger' }
];

export function convertDangerType(name: string): string {
    const danger = DangerList.find((d) => d.id === name);
    return danger ? danger.description : 'Desconhecido';
}

export function convertDangerColor(name: string) : any {
    const danger = DangerList.find((d) => d.id === name);
    return danger ? danger.severity : 'Desconhecido';
}

export function convertDanger(name: string) : any {
    const danger = DangerList.find((d) => d.id === name);
    return danger ? danger.id : null;
}

export interface Accident {
    id: number;
    danger: string;
    exams: string;
    symptoms: string;
    treatments: Treatment[];
}

export let newAccident: Accident = {
    id: 0,
    danger: 'LIGHT',
    exams: '',
    symptoms: '',
    treatments: []
};
