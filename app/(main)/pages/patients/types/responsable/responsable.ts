import { AddressType, newAddress } from '../address/address_type';
import { ResponsableType } from './responsable_type';

export interface Responsable {
    id: string | null;
    name: string;
    contact: string;
    rg: string;
    cpf: string;
    localWorker: string;
    type: ResponsableType | null;
    address: AddressType;
}

export let newResponsable: Responsable = {
    id: null,
    name: '',
    contact: '',
    rg: '',
    cpf: '',
    localWorker: '',
    type: ResponsableType.OTHER,
    address: newAddress
};
