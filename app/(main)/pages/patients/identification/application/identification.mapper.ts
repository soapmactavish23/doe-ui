import { createEmptyPatientRequest, PatientRequest, PatientSex } from '../../domain/patient';
import { createEmptyResponsable, Responsable, ResponsableType } from '../../domain/responsable';

type JsonObject = Record<string, unknown>;

export const identificationMapper = {
    toPatientRequest(result: JsonObject): PatientRequest {
        const patient = createEmptyPatientRequest();

        return {
            ...patient,
            name: toText(result.name),
            birthDate: toDate(result.birthDate),
            sex: toSex(result.sex),
            cause: toText(result.cause),
            startTreatment: toDate(result.startTreatment),
            responsables: Array.isArray(result.responsables) ? result.responsables.map(toResponsable) : []
        };
    }
};

function toResponsable(value: unknown): Responsable {
    const data = toObject(value);
    const address = toObject(data.address);
    const responsable = createEmptyResponsable();

    return {
        ...responsable,
        id: null,
        name: toText(data.name),
        contact: toText(data.contact),
        rg: toText(data.rg),
        cpf: toText(data.cpf),
        localWorker: toText(data.localWorker),
        type: toResponsableType(data.type),
        address: {
            ...responsable.address,
            street: toText(address.street),
            number: toText(address.number),
            complement: toText(address.complement),
            district: toText(address.district),
            city: toText(address.city),
            state: toText(address.state),
            zipCode: toText(address.zipCode)
        }
    };
}

function toObject(value: unknown): JsonObject {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
        return {};
    }

    return value as JsonObject;
}

function toText(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
}

function toDate(value: unknown): Date | null {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return null;
    }

    const date = new Date(`${value}T00:00:00`);

    return !Number.isNaN(date.getTime()) && date.getFullYear() === Number(value.slice(0, 4)) && date.getMonth() + 1 === Number(value.slice(5, 7)) && date.getDate() === Number(value.slice(8, 10)) ? date : null;
}

function toSex(value: unknown): PatientSex | undefined {
    return value === 'MALE' || value === 'FEMALE' ? value : undefined;
}

function toResponsableType(value: unknown): ResponsableType {
    switch (value) {
        case 'MOTHER':
            return ResponsableType.MOTHER;
        case 'FATHER':
            return ResponsableType.FATHER;
        case 'GUARDIAN':
            return ResponsableType.GUARDIAN;
        default:
            return ResponsableType.OTHER;
    }
}
