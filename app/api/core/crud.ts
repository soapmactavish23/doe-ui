export interface CrudTemplate<T> {
    findAll?(): Promise<T[]>;
    create?(t: T): Promise<T>;
    update?(t: T): Promise<T>;
    remove?(id: string): Promise<void>;
    findById?(id: string): Promise<T>;
}
