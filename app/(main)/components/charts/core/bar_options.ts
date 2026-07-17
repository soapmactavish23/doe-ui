import { colorsDefault } from '@/app/lib/colors';
import { colorsChart } from '@/app/lib/colors_chart';
import { ChartOptionsState } from '@/types';
import { SetStateAction } from 'react';

export function barOptions(): SetStateAction<ChartOptionsState> {
    return {
        barOptions: {
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: { top: 8, right: 12, bottom: 8, left: 12 } },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        color: '#334155'
                    }
                },
                title: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#475569', font: { weight: '600' } }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(148,163,184,0.25)' },
                    ticks: { color: '#475569' }
                }
            },

            datasets: {
                bar: {
                    barPercentage: 0.9,
                    categoryPercentage: 0.7,
                    maxBarThickness: 48,
                    borderRadius: 6
                }
            },
            animation: {
                duration: 600,
                easing: 'easeOutQuart'
            }
        }
    };
}

interface BarDataInterface {
    labels: any;
    values: any;
    legend: string
}

export function barData({ labels, values, legend }: BarDataInterface) {
    return {
        barData: {
            labels,
            datasets: [
                {
                    label: legend,
                    data: values,
                    backgroundColor: colorsChart,
                    hoverBackgroundColor: colorsDefault,
                    borderColor: colorsDefault,
                    borderWidth: 3
                }
            ]
        }
    };
}
