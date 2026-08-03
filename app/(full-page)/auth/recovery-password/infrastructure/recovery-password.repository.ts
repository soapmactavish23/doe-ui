import { api, apiUnAuth } from '@/app/api/core/api';

import { RecoveryPasswordRequest } from '../domain/recovery-password';

const RECOVERY_PASSWORD_ENDPOINT = 'usuarios/recovery-password';

export const recoveryPasswordRepository = {
    async recover(request: RecoveryPasswordRequest): Promise<void> {
        await apiUnAuth.post(`usuarios/recuperar-senha?email=${request.email}`);
    }
};
