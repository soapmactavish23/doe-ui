import { Page } from '../../core/pageable';
import { Animal, AnimalSearchDTO } from '../../models/animal';
import { UploadDTO } from '../../models/upload_dto';
import { AnimalRepositoryImpl } from '../../repositories/animal/animal_repository_impl';
import { AnimalService } from './animal_service';

class AnimalServiceImpl implements AnimalService {
    _repository = new AnimalRepositoryImpl();

    async search(dto: AnimalSearchDTO): Promise<Page<Animal>> {
        return await this._repository.search(dto);
    }

    async upload(dto: UploadDTO) {
        await this._repository.upload(dto);
    }

    async create(t: Animal): Promise<Animal> {
        return await this._repository.create(t);
    }
    async update(t: Animal): Promise<Animal> {
        return await this._repository.update(t);
    }
    async remove(id: number) {
        await this._repository.remove(id);
    }

    async findById(id: number): Promise<Animal> {
        return await this._repository.findById(id);
    }

    async findActive(categoryId: number): Promise<Animal[]> {
        return await this._repository.findActive(categoryId);
    }
}

const animalService = new AnimalServiceImpl();

export { animalService };
