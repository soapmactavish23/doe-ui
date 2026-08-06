'use client';

import { useEffect, useRef } from 'react';
import { ArcElement, BarController, BarElement, CategoryScale, Chart, ChartConfiguration, Legend, LinearScale, PieController, Title, Tooltip } from 'chart.js';

import { DashResponse } from '../domain/dash_response';
import { colorsDefault } from '@/app/lib/colors';

Chart.register(BarController, PieController, BarElement, ArcElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

type DashboardChartType = 'bar' | 'pie';

interface DashboardChartProps {
    data: DashResponse[];
    label: string;
    type: DashboardChartType;
}

export function DashboardChart({ data, label, type }: DashboardChartProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (!canvasRef.current || data.length === 0) {
            return;
        }

        chartRef.current?.destroy();

        const backgroundColors = data.map((_, index) => colorsDefault[index % colorsDefault.length]);

        const configuration: ChartConfiguration = {
            type,
            data: {
                labels: data.map((item) => item.description),
                datasets: [
                    {
                        label,
                        data: data.map((item) => item.total),
                        backgroundColor: type === 'pie' ? backgroundColors : backgroundColors[0],
                        borderColor: type === 'pie' ? backgroundColors : backgroundColors[0],
                        borderWidth: 1,
                        borderRadius: type === 'bar' ? 6 : undefined,
                        maxBarThickness: type === 'bar' ? 70 : undefined
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: type === 'pie' ? 'right' : 'top',
                        labels: {
                            usePointStyle: type === 'pie',
                            padding: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label(context) {
                                const value = context.raw ?? 0;

                                if (type === 'pie') {
                                    const values = context.dataset.data as number[];

                                    const total = values.reduce((sum, currentValue) => sum + Number(currentValue), 0);

                                    const percentage = total > 0 ? ((Number(value) / total) * 100).toFixed(1) : '0';

                                    return `${context.label}: ${value} pacientes (${percentage}%)`;
                                }

                                return `${label}: ${value}`;
                            }
                        }
                    }
                },
                scales:
                    type === 'bar'
                        ? {
                              x: {
                                  grid: {
                                      display: false
                                  },
                                  ticks: {
                                      autoSkip: false,
                                      maxRotation: 45,
                                      minRotation: 0
                                  }
                              },
                              y: {
                                  beginAtZero: true,
                                  ticks: {
                                      precision: 0
                                  },
                                  title: {
                                      display: true,
                                      text: 'Total de pacientes'
                                  }
                              }
                          }
                        : undefined
            }
        };

        chartRef.current = new Chart(canvasRef.current, configuration);

        return () => {
            chartRef.current?.destroy();
            chartRef.current = null;
        };
    }, [data, label, type]);

    if (data.length === 0) {
        return (
            <div className="flex justify-content-center align-items-center h-20rem">
                <span className="text-600">Nenhum dado encontrado.</span>
            </div>
        );
    }

    return (
        <div
            style={{
                position: 'relative',
                height: '350px',
                width: '100%'
            }}
        >
            <canvas ref={canvasRef} />
        </div>
    );
}
