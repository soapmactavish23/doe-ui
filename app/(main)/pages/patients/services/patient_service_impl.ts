import { Pageable, Page } from '@/app/api/core/pageable';
import { PatientResponse, PatientRequest, PatientResponseDetail, PatientParam } from '../types/patient';
import { PatientService } from './patient_service';
import { PatientRepositoryImpl } from '../repositories/patient_repository_impl';

class PatientServiceImpl implements PatientService {
    _repository = new PatientRepositoryImpl();

    search(dto: PatientParam): Promise<Page<PatientResponse>> {
        return this._repository.search(dto);
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
