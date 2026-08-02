export interface Address {
    street: string;
    complement: string;
    district: string;
    city: string;
    state: string;
    zipCode: string;
}

export let newAddress: Address = {
    street: '',
    complement: '',
    district: '',
    city: '',
    state: '',
    zipCode: ''
};

export function defaultValuesAddress(address: Address | null): any {
    return {
        zipCode: address?.zipCode ?? '',
        street: address?.street ?? '',
        complement: address?.complement ?? '',
        city: address?.city ?? '',
        state: address?.state ?? '',
        district: address?.district ?? ''
    };
}
