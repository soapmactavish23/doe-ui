import { Pageable } from '../core/pageable';
import { Accident } from './accident';
import { Category, newCategory } from './category';

export interface AnimalResponse {
    id: number;
    category: Category;
    name: string;
    description: string;
    scientificName: string;
    url: string;
    statusScanner: string;
}

export interface AnimalRequest {
    id: number;
    category: Category;
    name: string;
    description: string;
    scientificName: string;
    url: string;
    statusScanner: string;
    accidents: Accident[];
}

export interface Animal {
    id: number | null;
    category: Category;
    name: string;
    description: string;
    scientificName: string;
    url: string | null;
    statusScanner: boolean;
    accidents: Accident[];
}

export interface AnimalSearchDTO {
    name: string;
    scientificName: string;
    categoryId: string;
    pageable: Pageable;
}

export interface AnimalSummaryResponse {
    id: number;
    name: string;
    scientificName: string;
    url: Pageable;
}

export let newAnimal = {
    id: null,
    name: '',
    url: '',
    category: newCategory,
    description: '',
    scientificName: '',
    statusScanner: true,
    accidents: []
};
