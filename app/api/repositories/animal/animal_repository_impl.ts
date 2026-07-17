import { api } from '../../core/api';
import { Page } from '../../core/pageable';
import { Animal, AnimalSearchDTO } from '../../models/animal';
import { UploadDTO } from '../../models/upload_dto';
import { AnimalRepository } from './animal_repository';

export class AnimalRepositoryImpl implements AnimalRepository {
    async upload(dto: UploadDTO) {
        const formData = new FormData();
        formData.append('id', dto.id.toString());
        formData.append('file', dto.file);

        await api.put('animais/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    async search(dto: AnimalSearchDTO): Promise<Page<Animal>> {
        const response = await api.get(`animais?name=${dto.name}&scientificName=${dto.scientificName}&categoryId=${dto.categoryId}&page=${dto.pageable.page}&size=${dto.pageable.size}`);

        return await response.data;
    }

    async create(t: Animal): Promise<Animal> {
        const response = await api.post('animais', t);
        return response.data;
    }

    async update(t: Animal): Promise<Animal> {
        const response = await api.put('animais', t);
        return response.data;
    }

    async remove(id: number) {
        await api.delete(`animais/${id}`);
    }

    async findById(id: number): Promise<Animal> {
        const response = await api.get(`animais/${id}`);
        return response.data;
    }

    async findActive(categoryId: number): Promise<Animal[]> {
        const response = await api.get(`animais/categoria/status/${categoryId}`);
        return response.data;
    }
}
