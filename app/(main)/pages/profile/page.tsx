'use client';
import { Fieldset } from 'primereact/fieldset';
import { CardProfile } from './components/card_profile';
import CardPassword from './components/card_password';

export default function Profile() {
    return (
        <Fieldset legend="Perfil">
            <CardProfile />
            <br />
            <CardPassword />
        </Fieldset>
    );
}
