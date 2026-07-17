import { colorsDefault } from '@/app/lib/colors';
import { colorsChart } from '@/app/lib/colors_chart';

interface PieDataInterface {
    labels: any;
    values: any;
}

export function pieData({ labels, values }: PieDataInterface) {
    return {
        pieData: {
            labels: labels,
            datasets: [
                {
                    data: values,
                    backgroundColor: colorsChart,
                    borderColor: colorsDefault,
                    hoverBackgroundColor: colorsDefault,
                    borderWidth: 2
                }
            ]
        }
    };
}

export function pieOptions() {
    return {
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
    };
}
