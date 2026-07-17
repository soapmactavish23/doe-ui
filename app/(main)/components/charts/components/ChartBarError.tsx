import { QtdByDTO } from '@/app/api/models/qtd_by_dto';
import { occurrenceService } from '@/app/api/services/occurrence/occurrence_service_impl';
import { QueryKey } from '@/app/lib/react-query';
import { ChartDataState, ChartOptionsState } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { barOptions } from '../core/bar_options';
import { Fieldset } from 'primereact/fieldset';
import { Chart } from 'primereact/chart';
import { pieData, pieOptions } from '../core/pie_options';

export default function ChartBarError() {
    const [options, setOptions] = useState<ChartOptionsState>({});
    const [chartData, setChartData] = useState<ChartDataState>({});

    useQuery<QtdByDTO[]>({
        queryKey: [QueryKey.COUNT_BY_ANIMAL_ERROR],
        queryFn: async () => {
            const response = await occurrenceService.countErrorByAnimal();
            mountChart(response);
            return response;
        }
    });

    const mountChart = (response: QtdByDTO[]) => {
        const labels = response.map((item) => item.name);
        const values = response.map((item) => item.total);

        setOptions(pieOptions());

        setChartData(pieData({ labels, values }));
    };

    return (
        <div className="col-12 xl:col-6">
            <Fieldset legend="Total de erro por espécie identificada" className="card flex flex-column align-items-center">
                <Chart type="doughnut" data={chartData.pieData} options={options.pieOptions}></Chart>
            </Fieldset>
        </div>
    );
}
