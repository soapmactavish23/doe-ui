export interface Address {
    street: string;
    complement: string;
    district: string;
    city: string;
    state: string;
    zipCode: string;
}

export const createEmptyAddress = (): Address => ({
    street: '',
    complement: '',
    district: '',
    city: '',
    state: '',
    zipCode: ''
});
