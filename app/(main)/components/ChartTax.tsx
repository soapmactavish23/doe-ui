import { TaxResponse } from '@/app/api/models/tax_dto';
import { occurrenceService } from '@/app/api/services/occurrence/occurrence_service_impl';
import { QueryKey } from '@/app/lib/react-query';
import { ChartDataState, ChartOptionsState } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Chart } from 'primereact/chart';
import { Fieldset } from 'primereact/fieldset';
import { useState } from 'react';

export default function ChartTax() {
    const [options, setOptions] = useState<ChartOptionsState>({});
    const [chartData, setChartData] = useState<ChartDataState>({});

    useQuery<TaxResponse>({
        queryKey: [QueryKey.COUNT_BY_ANIMAL],
        queryFn: async () => {
            const response = await occurrenceService.loadTax();
            mountChart(response);
            return response;
        }
    });

    const mountChart = (response: TaxResponse) => {
        setOptions({
            pieOptions: {
                plugins: {
                    legend: {
                        labels: {
                            usePointStyle: true,
                            color: 'FFF'
                        }
                    }
                }
            }
        });
        setChartData({
            pieData: {
                labels: ['Erro', 'Acerto', 'Não Analisado'],
                datasets: [
                    {
                        data: [response.erro, response.acerto, response.naoSabe],
                        backgroundColor: ['#d9534f', '#5cb85c', '#f0ad4e'],
                        hoverBackgroundColor: ['#d9534f', '#5cb85c', '#f0ad4e']
                    }
                ]
            }
        });
    };

    return (
        <div className="col-12 xl:col-6">
            <Fieldset legend="Taxa de Acerto" className="card flex flex-column align-items-center">
                <Chart type="pie" data={chartData.pieData} options={options.pieOptions}></Chart>
            </Fieldset>
        </div>
    );
}
