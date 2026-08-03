import { RecoveryPasswordRequest } from '../domain/recovery-password';

import { recoveryPasswordRepository } from '../infrastructure/recovery-password.repository';

export const recoveryPasswordService = {
    async recover(request: RecoveryPasswordRequest): Promise<void> {
        const normalizedRequest: RecoveryPasswordRequest = {
            email: request.email.trim().toLowerCase()
        };

        await recoveryPasswordRepository.recover(normalizedRequest);
    }
};
