const FIREBASE_TOKEN_KEY = 'doe.firebase.token';
const IDENTIFICATION_ID_KEY = 'doe.identification.id';

export const identificationStorage = {
    saveFirebaseToken(token: string): void {
        sessionStorage.setItem(FIREBASE_TOKEN_KEY, token);
    },

    getFirebaseToken(): string | null {
        if (typeof window === 'undefined') return null;

        return sessionStorage.getItem(FIREBASE_TOKEN_KEY);
    },

    removeFirebaseToken(): void {
        sessionStorage.removeItem(FIREBASE_TOKEN_KEY);
    },

    saveIdentificationId(id: string): void {
        sessionStorage.setItem(IDENTIFICATION_ID_KEY, id);
    },

    getIdentificationId(): string | null {
        if (typeof window === 'undefined') return null;

        return sessionStorage.getItem(IDENTIFICATION_ID_KEY);
    },

    removeIdentificationId(): void {
        sessionStorage.removeItem(IDENTIFICATION_ID_KEY);
    },

    clearIdentification(): void {
        this.removeIdentificationId();
    }
};
