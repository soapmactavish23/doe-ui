export interface Group {
    id: string | null;
    name: string;
}

export function createEmptyGroup(): Group {
    return {
        id: null,
        name: ''
    };
}
