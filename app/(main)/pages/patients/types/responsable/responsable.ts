import { Address, defaultValuesAddress, newAddress } from '../address/address';
import { FormDialogInputResponsable } from './responsable_schema';
import { ResponsableType } from './responsable_type';

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

export function defaultValuesResponsable(obj: Responsable | null): any {
    return {
        name: obj?.name ?? '',
        contact: obj?.contact ?? '',
        rg: obj?.rg ?? '',
        cpf: obj?.cpf ?? '',
        localWorker: obj?.localWorker ?? '',
        type: obj?.type ?? ResponsableType.OTHER,
        address: defaultValuesAddress(obj?.address ?? null)
    };
}
