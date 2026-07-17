import { CrudTemplate } from '../../core/crud';
import { Category } from '../../models/category';

export interface CategoryRepository extends CrudTemplate<Category> {
    upload(id: number, file: File): Promise<void>;
    findActives() : Promise<Category[]>;
}
