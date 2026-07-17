export interface CrudTemplate<T> {
    findAll?(): Promise<T[]>;
    create?(t: T): Promise<T>;
    update?(t: T): Promise<T>;
    remove?(id: number): Promise<void>;
    findById?(id: number): Promise<T>;
}
