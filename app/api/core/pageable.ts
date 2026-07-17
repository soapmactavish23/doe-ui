export interface Page<T> {
    content: T[];
    size: number;
    page: number;
    totalElements: number;
}

export interface Pageable {
    page: number;
    size: number;
}

export interface DataTableFilter {
    value: string;
    matchMode: 'contains' | 'equals' | 'startsWith' | 'endsWith'; // ajuste conforme suas opções reais
}

export interface DataTableFilterMeta {
    [key: string]: DataTableFilter;
}

export interface LazyTableState<TFilters extends DataTableFilterMeta = DataTableFilterMeta> {
    first: number;
    rows: number;
    page: number;
    sortField?: string;
    sortOrder?: number;
    filters: TFilters;
}
