import { api, apiUnAuth } from '../../core/api';
import { Category } from '../../models/category';
import { CategoryRepository } from './category_repository';

export class CategoryRepositoryImpl implements CategoryRepository {
    async upload(id: number, file: File) {
        const formData = new FormData();
        formData.append('id', id.toString());
        formData.append('file', file);

        await api.put('categorias/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
    async findAll(): Promise<Category[]> {
        const response = await apiUnAuth.get('categorias');
        return response.data;
    }
    async create(category: Category): Promise<Category> {
        const response = await api.post('categorias', category);
        return response.data;
    }
    async update(category: Category): Promise<Category> {
        const response = await api.put('categorias', category);
        return response.data;
    }
    async remove(id: number) {
        await api.delete(`categorias/${id}`);
    }

    async findActives(): Promise<Category[]> {
        return (await api.get('categorias/animais-ativos')).data;
    }
}
