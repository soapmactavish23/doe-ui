import { Address, newAddress } from './address';

export interface Responsable {
    id: string | null;
    name: string;
    contact: string;
    rg: string;
    cpf: string;
    localWorker: string;
    type: 'FATHER' | 'MOTHER' | 'OTHER';
    address: Address;
}

export let newResponsable: Responsable = {
    id: null,
    name: '',
    contact: '',
    rg: '',
    cpf: '',
    localWorker: '',
    type: 'OTHER',
    address: newAddress
};
