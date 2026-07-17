export interface DateRequest {
    year: number;
    month: number;
}

export interface TaxResponse {
    total: number;
    erro: number;
    acerto: number;
    naoSabe: number;
}
