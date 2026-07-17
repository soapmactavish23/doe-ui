import { Category } from '../../models/category';
import { CategoryRepositoryImpl } from '../../repositories/category/category_repository_impl';
import { CategoryService } from './category_service';

class CategoryServiceImpl implements CategoryService {
    _repository = new CategoryRepositoryImpl();
    
    async upload(id: number, file: File) {
        await this._repository.upload(id, file);
    }

    async create(t: Category): Promise<Category> {
        return await this._repository.create(t);
    }

    async findAll(): Promise<Category[]> {
        return await this._repository.findAll();
    }

    async remove(id: number) {
        await this._repository.remove(id);
    }

    async update(t: Category): Promise<Category> {
        return this._repository.update(t);
    }

    async findActives(): Promise<Category[]> {
        return await this._repository.findActives();
    }
}

const categoryService = new CategoryServiceImpl();

export { categoryService };
