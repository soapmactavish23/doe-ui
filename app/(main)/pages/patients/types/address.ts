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
