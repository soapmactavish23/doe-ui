import { Fieldset } from 'primereact/fieldset';
import { Chart } from 'primereact/chart';
import { QueryKey } from '@/app/lib/react-query';
import { QtdByDTO } from '@/app/api/models/qtd_by_dto';
import { occurrenceService } from '@/app/api/services/occurrence/occurrence_service_impl';
import { ChartDataState, ChartOptionsState } from '@/types';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { pieData, pieOptions } from '../core/pie_options';

export default function ChartTotal() {
    const [options, setOptions] = useState<ChartOptionsState>({});
    const [chartData, setChartData] = useState<ChartDataState>({});

    useQuery<QtdByDTO[]>({
        queryKey: [QueryKey.COUNT_BY_ANIMAL],
        queryFn: async () => {
            const response = await occurrenceService.countByAnimal();
            mountChart(response);
            return response;
        }
    });

    const mountChart = (response: QtdByDTO[]) => {
        const labels = response.map((item) => item.name);
        const values = response.map((item) => item.total);
        setOptions(pieOptions());
        setChartData(pieData({ labels: labels, values: values }));
    };

    return (
        <div className="col-12 xl:col-6">
            <Fieldset legend="Total de ocorrências por animais" className="card flex flex-column align-items-center">
                <Chart type="pie" data={chartData.pieData} options={options.pieOptions}></Chart>
            </Fieldset>
        </div>
    );
}
