'use client';

import { Fieldset } from 'primereact/fieldset';

import { useProfile } from './application/useProfile';

import { CardProfile } from './presentation/CardProfile';
import CardPassword from './presentation/CardPassword';

export default function ProfilePage() {
    const { profile, loading, saving, saveProfile } = useProfile();

    return (
        <Fieldset legend="Perfil">
            <CardProfile profile={profile} loading={loading} saving={saving} onSave={saveProfile} />

            <br />

            <CardPassword userId={profile.id} />
        </Fieldset>
    );
}
