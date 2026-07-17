export interface Category {
    id: number | null;
    name: string;
    url: string | null;
}

export let newCategory: Category = {
    id: null,
    name: '',
    url: null
};
