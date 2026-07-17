import { CrudTemplate } from '../../core/crud';
import { Page } from '../../core/pageable';
import { Animal, AnimalSearchDTO } from '../../models/animal';
import { UploadDTO } from '../../models/upload_dto';

export interface AnimalRepository extends CrudTemplate<Animal> {
    search(dto: AnimalSearchDTO): Promise<Page<Animal>>;
    upload(dto: UploadDTO): void;
    findActive(categoryId: number): Promise<Animal[]>;
}
