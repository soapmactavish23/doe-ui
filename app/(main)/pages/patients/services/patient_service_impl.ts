import { Pageable, Page } from '@/app/api/core/pageable';
import { PatientResponse, PatientRequest, PatientResponseDetail } from '../types/patient';
import { PatientService } from './patient_service';
import { PatientRepositoryImpl } from '../repositories/patient_repository_impl';

class PatientServiceImpl implements PatientService {
    _repository = new PatientRepositoryImpl();

    search(name: string, pageable: Pageable): Promise<Page<PatientResponse>> {
        return this._repository.search(name, pageable);
    }
    create(request: PatientRequest, image: File | null): Promise<PatientResponse> {
        return this._repository.create(request, image);
    }
    update(request: PatientRequest, image: File | null): Promise<PatientResponse> {
        return this._repository.update(request, image);
    }
    findById(id: string): Promise<PatientResponseDetail> {
        return this._repository.findById(id);
    }
    remove(id: string): Promise<void> {
        return this._repository.remove(id);
    }
}

const patientService = new PatientServiceImpl();

export { patientService };
