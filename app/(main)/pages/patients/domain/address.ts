export interface Address {
    street: string;
    complement: string;
    district: string;
    city: string;
    state: string;
    zipCode: string;
    number: string;
}

export const createEmptyAddress = (): Address => ({
    street: '',
    complement: '',
    district: '',
    city: '',
    state: '',
    zipCode: '',
    number: ''
});

export interface ViaCepResponse {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    erro?: boolean;
}
