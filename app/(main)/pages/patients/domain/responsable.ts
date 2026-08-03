import { Address, createEmptyAddress } from './address';

export enum ResponsableType {
    MOTHER = 'MOTHER',
    FATHER = 'FATHER',
    GUARDIAN = 'GUARDIAN',
    OTHER = 'OTHER'
}

export interface Responsable {
    id: string | null;
    name: string;
    contact: string;
    rg: string;
    cpf: string;
    localWorker: string;
    type: ResponsableType | null;
    address: Address;
}

export const createEmptyResponsable = (): Responsable => ({
    id: null,
    name: '',
    contact: '',
    rg: '',
    cpf: '',
    localWorker: '',
    type: ResponsableType.OTHER,
    address: createEmptyAddress()
});

export const cloneResponsable = (responsable: Responsable): Responsable => ({
    ...responsable,
    address: {
        ...responsable.address
    }
});
