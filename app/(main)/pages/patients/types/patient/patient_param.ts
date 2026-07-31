import { Pageable } from '@/app/api/core/pageable';

export interface PatientParam {
    name: string;
    pageable: Pageable;
}
