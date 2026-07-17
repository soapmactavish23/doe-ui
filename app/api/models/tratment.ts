

export const TreatmentTypes = [
    { id: 'SPECIF', description: 'Específico' },
    { id: 'NONSPECIFC', description: 'Não específico' }
];

export interface Treatment {
    description: string;
    obs: string;
    type: string;
}

export function convertTreatment(name: string): any {
    const danger = TreatmentTypes.find((d) => d.id === name);
    return danger ? danger.description : null;
}
