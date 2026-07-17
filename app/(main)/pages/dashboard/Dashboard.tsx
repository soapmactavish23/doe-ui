import { Fieldset } from 'primereact/fieldset';
import FilterDashboard from '../../components/FilterDashboard';
import CardTax from '../../components/CardTax';
import ChartTotal from '../../components/charts/components/ChartTotal';
import ChartBarRight from '../../components/charts/components/ChartBarRight';
import ChartBarError from '../../components/charts/components/ChartBarError';
import ChartLine from '../../components/charts/components/ChartLine';
import Map from '../../components/Map';
import { useState } from 'react';
import { TaxResponse } from '@/app/api/models/tax_dto';
import { useQuery } from '@tanstack/react-query';
import { occurrenceService } from '@/app/api/services/occurrence/occurrence_service_impl';
import { QueryKey } from '@/app/lib/react-query';
import { Occurrence } from '@/app/api/models/occurrence';

export default function Dashboard() {
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);

    const { data: taxResponse, refetch: loadTax } = useQuery<TaxResponse>({
        queryKey: [QueryKey.TAX_KEY],
        queryFn: async () => {
            const response = await occurrenceService.loadTax();
            return response;
        }
    });

    const { data: listOccurrences, refetch: findByDate } = useQuery<Occurrence[]>({
        queryKey: [QueryKey.OCCURRENCE_LIST],
        queryFn: async () => {
            const response = await occurrenceService.findByDate({
                month: month,
                year: year
            });
            return response;
        }
    });

    const setDate = async ({ month, year }: { month: number; year: number }) => {
        setMonth(month);
        setYear(year);
        loadTax();
        findByDate();
    };

    return (
        <Fieldset legend="Dados Coletados">
            <FilterDashboard setDate={setDate} />
            <br />
            <br />
            <div className="grid">
                <CardTax title="Erro" subtitle="Ocorrências que a IA errou" value={taxResponse?.erro ?? 0} icon="pi pi-times" color="red" />
                <CardTax title="Acerto" subtitle="Ocorrências que a IA acertou" value={taxResponse?.acerto ?? 0} icon="pi pi-check" color="green" />
                <CardTax title="Não Analisado" subtitle="Ocorrências em que os usuários não sabem" value={taxResponse?.naoSabe ?? 0} icon="pi pi-bars" color="yellow" />
                <CardTax title="Total" subtitle="Total de ocorrências" value={taxResponse?.total ?? 0} icon="pi pi-list" color="blue" />
                <ChartTotal />
                <ChartBarRight />
                <ChartBarError />
                <ChartLine />
                <Map occurrences={listOccurrences ?? []} />
            </div>
        </Fieldset>
    );
}
