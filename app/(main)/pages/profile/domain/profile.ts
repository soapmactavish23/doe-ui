export interface Profile {
    id: string;
    name: string;
}

export const createEmptyProfile = (): Profile => ({
    id: '',
    name: ''
});
