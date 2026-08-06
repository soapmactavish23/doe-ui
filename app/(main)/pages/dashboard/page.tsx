'use client';

import imgLogo from '@/public/logo.png';

import { Fieldset } from 'primereact/fieldset';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useDashboard } from './application/useDashboard';
import { DashboardChart } from './presentation/DashboardChart';

export default function Dashboard() {
    const { ages, types, loading, error } = useDashboard();

    return (
        <div className="card">
            <div className="text-center mb-5">
                <img src={imgLogo.src} alt="Logo da Doe" height="100" className="mb-3" />

                <div className="text-900 text-3xl font-medium mb-3">Doe</div>
            </div>

            {loading && (
                <div className="flex justify-content-center align-items-center h-20rem">
                    <ProgressSpinner />
                </div>
            )}

            {!loading && error && <Message severity="error" text="Não foi possível carregar os dados do dashboard." className="w-full mb-4" />}

            {!loading && !error && (
                <div className="grid">
                    <div className="col-12 lg:col-6">
                        <Fieldset legend="Faixa etária dos pacientes">
                            <DashboardChart data={ages} label="Pacientes por faixa etária" type="bar" />
                        </Fieldset>
                    </div>

                    <div className="col-12 lg:col-6">
                        <Fieldset legend="Tipos de câncer dos pacientes">
                            <DashboardChart data={types} label="Pacientes por tipo de câncer" type="pie" />
                        </Fieldset>
                    </div>
                </div>
            )}
        </div>
    );
}
