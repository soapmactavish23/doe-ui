import { Page, Pageable } from '@/app/api/core/pageable';
import { PatientRequest, PatientResponse, PatientResponseDetail } from '../types/patient';

export interface PatientService {
    search(name: string, pageable: Pageable): Promise<Page<PatientResponse>>;
    create(request: PatientRequest, image: File | null): Promise<PatientResponse>;
    update(request: PatientRequest, image: File | null): Promise<PatientResponse>;
    findById(id: string): Promise<PatientResponseDetail>;
    remove(id: string): Promise<void>;
}
