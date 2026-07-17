import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();

export abstract class QueryKey {
    static CATEGORY_FIND_ALL: string = 'CATEGORY_FIND_ALL';
    static CATEGORY_FIND_ACTIVES: string = 'CATEGORY_FIND_ACTIVES';
    static ANIMAL_FIND_ALL: string = 'ANIMAL_FIND_ALL';
    static ANIMAL_FIND_BY_ID: string = 'ANIMAL_FIND_BY_ID';
    static ANIMAL_FIND_ACTIVE: string = 'ANIMAL_FIND_ACTIVE';
    static ANIMAL_CATEGORY_ID: string = 'ANIMAL_CATEGORY_ID';
    static GROUP_FIND_ALL: string = 'GROUP_FIND_ALL';
    static TAX_KEY: string = 'TAX_KEY';
    static COUNT_BY_ANIMAL: string = 'COUNT_BY_ANIMAL';
    static COUNT_BY_ANIMAL_RIGHT: string = 'COUNT_BY_ANIMAL_RIGHT';
    static COUNT_BY_ANIMAL_ERROR: string = 'COUNT_BY_ANIMAL_ERROR';
    static COUNT_BY_MONTH: string = 'COUNT_BY_MONTH';
    static OCCURRENCE_LIST: string = 'OCCURRENCE_LIST';
    static USER_FIND_ALL: string = 'USER_FIND_ALL';
    static LOG_FIND_ALL: string = 'LOG_FIND_ALL';
    static METHODS_FIND_ALL: string = 'METHODS_FIND_ALL';
    static LOAD_VERIFY: string = 'LOAD_VERIFY';
    static SEND_VERIFY: string = 'SEND_VERIFY';
    static LOAD_BY_DEVICE_ID: string = 'LOAD_BY_DEVICE_ID';
}
