import { QtdByDTO } from '@/app/api/models/qtd_by_dto';
import { occurrenceService } from '@/app/api/services/occurrence/occurrence_service_impl';
import { QueryKey } from '@/app/lib/react-query';
import { ChartDataState, ChartOptionsState } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Chart } from 'primereact/chart';
import { Fieldset } from 'primereact/fieldset';
import { useState } from 'react';
import { barData, barOptions } from '../core/bar_options';

export default function ChartBarRight() {
    const [options, setOptions] = useState<ChartOptionsState>({});
    const [chartData, setChartData] = useState<ChartDataState>({});

    useQuery<QtdByDTO[]>({
        queryKey: [QueryKey.COUNT_BY_ANIMAL_RIGHT],
        queryFn: async () => {
            const response = await occurrenceService.countRightByAnimal();
            mountChart(response);
            return response;
        }
    });

    const mountChart = (response: QtdByDTO[]) => {
        const labels = response.map((item) => item.name);
        const values = response.map((item) => item.total);

        setOptions(barOptions());
        setChartData(
            barData({
                labels,
                values,
                legend: 'Animais'
            })
        );
    };

    return (
        <div className="col-12 xl:col-6">
            <Fieldset legend="Total de acerto por espécie identificada" className="card">
                <Chart type="bar" data={chartData.barData} options={options.barOptions} style={{ width: '100%', height: 300 }}></Chart>
            </Fieldset>
        </div>
    );
}
