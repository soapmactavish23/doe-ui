import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();

export abstract class QueryKey {
    static GROUP_FIND_ALL: string = 'GROUP_FIND_ALL';
    static USER_FIND_ALL: string = 'USER_FIND_ALL';
    static LOG_FIND_ALL: string = 'LOG_FIND_ALL';
    static METHODS_FIND_ALL: string = 'METHODS_FIND_ALL';
    static PATIENT_FIND_ALL: string = 'PATIENT_FIND_ALL';
    static PATIENT_FIND_BY_ID: string = 'PATIENT_FIND_BY_ID';
}
