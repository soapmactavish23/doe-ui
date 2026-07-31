export interface AddressType {
    street: string;
    complement: string;
    district: string;
    city: string;
    state: string;
    zipCode: string;
}

export let newAddress: AddressType = {
    street: '',
    complement: '',
    district: '',
    city: '',
    state: '',
    zipCode: ''
};
