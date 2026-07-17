import { QtdByDTO } from '@/app/api/models/qtd_by_dto';
import { occurrenceService } from '@/app/api/services/occurrence/occurrence_service_impl';
import { QueryKey } from '@/app/lib/react-query';
import { ChartDataState, ChartOptionsState } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Fieldset } from 'primereact/fieldset';
import { useState } from 'react';
import { barData, barOptions } from '../core/bar_options';
import { Chart } from 'primereact/chart';
import moment from 'moment';
import 'moment/locale/pt-br';

moment.locale('pt-br');

export default function ChartLine() {
    const [options, setOptions] = useState<ChartOptionsState>({});
    const [chartData, setChartData] = useState<ChartDataState>({});

    useQuery<QtdByDTO[]>({
        queryKey: [QueryKey.COUNT_BY_MONTH],
        queryFn: async () => {
            const response = await occurrenceService.countByMonth();
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
            <Fieldset legend="Distribuição mensal de acidentes no mês" className="card">
                <Chart type="line" data={chartData.barData} options={options.barOptions} style={{ width: '100%', height: 300 }}></Chart>
            </Fieldset>
        </div>
    );
}
