import { Page, Pageable } from '@/app/api/core/pageable';
import { PatientParam, PatientRequest, PatientResponse, PatientResponseDetail } from '../types/patient/patient_response_detail';

export interface PatientRepository {
    search(dto: PatientParam): Promise<Page<PatientResponse>>;
    create(request: PatientRequest, image: File | null): Promise<PatientResponse>;
    update(request: PatientRequest, image: File | null): Promise<PatientResponse>;
    findById(id: string): Promise<PatientResponseDetail>;
    remove(id: string): Promise<void>;
}
