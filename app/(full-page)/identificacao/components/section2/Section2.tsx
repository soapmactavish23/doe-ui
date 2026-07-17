'use client';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';

import { OccurrenceResponse } from '@/app/api/models/occurrence';

import './styles.scss';

interface Section2Props {
    identification: OccurrenceResponse;
}

const getStatusSeverity = (status: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' | null | undefined => {
    if (status === 'Finalizado') return 'success';
    if (status === 'Em análise') return 'info';
    return 'danger';
};

const getStatusIcon = (status: string) => {
    if (status === 'Finalizado') return 'pi pi-check-circle';
    if (status === 'Em análise') return 'pi pi-search';
    return 'pi pi-times-circle';
};

export default function Section2({ identification }: Section2Props) {
    const animalName = identification.animal?.name ?? identification.animalName;
    const scientificName = identification.identificationResponse?.scientificName ?? identification.animal?.scientificName;

    const confidence = identification.identificationResponse?.confidence ?? 0;
    const description = identification.description ?? identification.identificationResponse?.iaDescription ?? 'Sem descrição informada.';

    const image = identification.imageUrl ?? identification.image;
    const audioUrl = identification.audioUrl;
    const status = identification.status;
    const inferences = identification.identificationResponse?.inferences ?? [];

    return (
        <Card className="identification-section2 border-round-2xl mt-3">
            <div className="flex justify-content-between align-items-center gap-3 mb-3">
                <div className="flex align-items-center gap-2">
                    <span className="identification-section2__step">2</span>

                    <div>
                        <h3 className="m-0 text-xl font-bold text-900">Detalhes da identificação</h3>

                        <p className="m-0 mt-1 text-sm text-500">Resultado consolidado pela inteligência artificial</p>
                    </div>
                </div>

                <Tag value={status} icon={getStatusIcon(status)} severity={getStatusSeverity(status)} rounded />
            </div>

            <div className="grid">
                <div className="col-12 lg:col-4">
                    <img src={image} alt={animalName} className="w-full border-round-xl identification-section2__image" />
                </div>

                <div className="col-12 lg:col-8">
                    <div className="grid h-full">
                        <div className="col-12 md:col-6">
                            <span className="text-sm text-500">Identificação principal</span>

                            <h2 className="m-0 mt-1 text-green-600">{animalName}</h2>

                            <p className="m-0 mt-1 text-600 font-italic">{scientificName}</p>

                            <div className="mt-4">
                                <span className="text-sm text-500">Confiança da IA</span>

                                <strong className="block text-green-600 text-2xl mt-1 mb-2">{confidence.toString().replace('.', ',')}%</strong>

                                <ProgressBar value={Math.round(confidence)} showValue={false} className="identification-section2__progress" />
                            </div>
                        </div>

                        <div className="col-12 md:col-6">
                            <span className="text-sm text-500">Descrição do ocorrido</span>

                            <p className="text-700 line-height-3 mt-2 mb-3">{description}</p>

                            {audioUrl && <Button label="Ouvir relato em áudio" icon="pi pi-play" severity="success" outlined onClick={() => new Audio(audioUrl).play()} />}
                        </div>

                        <div className="col-12">
                            <div className="grid">
                                <div className="col-6 md:col-3">
                                    <div className="surface-50 border-1 surface-border border-round-xl p-3 h-full">
                                        <i className="pi pi-tags text-green-600" />
                                        <small className="block text-500 mt-2">Animal informado</small>
                                        <strong className="text-900">{identification.supposedAnimal?.name ?? '-'}</strong>
                                    </div>
                                </div>

                                <div className="col-6 md:col-3">
                                    <div className="surface-50 border-1 surface-border border-round-xl p-3 h-full">
                                        <i className="pi pi-sitemap text-green-600" />
                                        <small className="block text-500 mt-2">Identificado como</small>
                                        <strong className="text-900">{animalName}</strong>
                                    </div>
                                </div>

                                <div className="col-6 md:col-3">
                                    <div className="surface-50 border-1 surface-border border-round-xl p-3 h-full">
                                        <i className="pi pi-globe text-green-600" />
                                        <small className="block text-500 mt-2">Data</small>
                                        <strong className="text-900">{new Date(identification.date).toLocaleDateString('pt-BR')}</strong>
                                    </div>
                                </div>

                                <div className="col-6 md:col-3">
                                    <div className="surface-50 border-1 surface-border border-round-xl p-3 h-full">
                                        <i className="pi pi-map-marker text-red-500" />
                                        <small className="block text-500 mt-2">Localização</small>
                                        <strong className="text-red-500">{identification.latitude && identification.longitude ? 'Registrada' : 'Não informada'}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <div className="flex justify-content-between align-items-center mb-3">
                    <div>
                        <h4 className="m-0 text-lg text-900">Análise dos modelos de IA</h4>

                        <p className="m-0 mt-1 text-sm text-500">Comparativo das inferências executadas</p>
                    </div>

                    <Tag value={`${inferences.length} modelos`} severity="success" rounded />
                </div>

                <div className="flex flex-column gap-3">
                    {inferences.map((inference) => (
                        <div key={inference.id} className="flex flex-column md:flex-row md:align-items-center justify-content-between gap-3 border-1 surface-border border-round-xl p-3">
                            <div className="flex align-items-center gap-3">
                                <img src={inference.animal?.url} alt={inference.animal?.name} className="identification-section2__model-image" />

                                <div>
                                    <strong className="text-900">{inference.modelName}</strong>

                                    <small className="block text-500">
                                        Predição: {inference.animal?.name} • {inference.animal?.scientificName}
                                    </small>
                                </div>
                            </div>

                            <div className="flex align-items-center gap-5">
                                <div>
                                    <small className="block text-500">Confiança</small>
                                    <strong className="text-green-600">{inference.confidence.toString().replace('.', ',')}%</strong>
                                </div>

                                <div>
                                    <small className="block text-500">Inferência</small>
                                    <strong className="text-900">{inference.inferenceTimeMs} ms</strong>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="surface-50 border-1 surface-border border-round-xl p-3 mt-4 flex align-items-center gap-2">
                <i className="pi pi-info-circle text-green-600" />

                <small className="text-600">{identification.identificationResponse?.iaDescription ?? 'A análise considerou o consenso dos modelos, descrição, áudio e informações adicionais.'}</small>
            </div>
        </Card>
    );
}
