'use client';

import './styles.scss';

export default function Pesquisa() {
    const pdfUrl = '/dissertacao/dissertacao.pdf';

    const summaryItems = [
        { title: '1. Introdução', page: 14 },
        { title: '2. Motivação e Cenário Real', page: 15 },
        { title: '3. Estado da Arte', page: 17 },
        { title: '3.1 Metodologia da RSL', page: 17 },
        { title: '3.2 CNNs e Transfer Learning', page: 18 },
        { title: '3.3 Desempenho dos Modelos', page: 19 },
        { title: '3.4 Limitações da Literatura', page: 20 },
        { title: '3.5 Lacunas Científicas', page: 21 },
        { title: '4. Sistema Radar Peçonhento', page: 22 },
        { title: '4.1 Visão Geral da Arquitetura', page: 22 },
        { title: '4.2 Aplicativo Móvel', page: 24 },
        { title: '4.3 Backend e API REST', page: 24 },
        { title: '4.4 Serviço de Inteligência Artificial', page: 25 },
        { title: '4.5 Infraestrutura', page: 26 },
        { title: '4.6 Operação Híbrida', page: 27 },
        { title: '5. Metodologia', page: 28 },
        { title: '6. Treinamento dos Modelos', page: 32 },
        { title: '7. Resultados Experimentais', page: 33 },
        { title: '8. Análise de Erros', page: 37 },
        { title: '9. Validação em Campo', page: 39 },
        { title: '10. Aplicação Prática', page: 41 },
        { title: '11. Resultados em Campo e Validação', page: 44 },
        { title: '12. Conclusão', page: 47 },
        { title: '13. Referências', page: 49 },
        { title: '14. Anexos', page: 52 }
    ];

    return (
        <main className="pesquisa-page">
            <section className="pesquisa-hero">
                <div>
                    <span>Pesquisa Científica</span>
                    <h1>Sistema de Informação para a Identificação de Animais Peçonhentos</h1>
                    <p>Dissertação apresentada ao Programa de Pós-Graduação em Computação Aplicada da Universidade Federal do Pará, com foco no uso de redes neurais para apoiar a gestão da saúde pública.</p>
                </div>

                <div className="pesquisa-actions">
                    <a href={pdfUrl} download className="btn-download">
                        <i className="pi pi-download" />
                        Baixar PDF
                    </a>

                    <a href={pdfUrl} target="_blank" className="btn-outline-pdf">
                        <i className="pi pi-external-link" />
                        Abrir PDF
                    </a>
                </div>
            </section>

            <section className="pesquisa-layout">
                <aside className="pesquisa-sidebar">
                    <h3>Sumário</h3>

                    <ul>
                        <li>1. Introdução</li>
                        <li>2. Motivação e Cenário Real</li>
                        <li>3. Estado da Arte</li>
                        <li>4. Sistema Radar Peçonhento</li>
                        <li>5. Metodologia</li>
                        <li>6. Treinamento dos Modelos</li>
                        <li>7. Resultados Experimentais</li>
                        <li>8. Análise de Erros</li>
                        <li>9. Validação em Campo</li>
                        <li>10. Aplicação Prática</li>
                        <li>12. Conclusão</li>
                    </ul>
                </aside>

                <section className="pdf-viewer-card">
                    <div className="pdf-toolbar">
                        <strong>Dissertação completa</strong>
                        <span>PDF • 53 páginas</span>
                    </div>

                    <iframe src={pdfUrl} className="pdf-viewer" title="Dissertação Radar Peçonhento" />
                </section>

                <aside className="pesquisa-info">
                    <h3>Sobre esta pesquisa</h3>

                    <p>O trabalho propõe um sistema de identificação automática de serpentes brasileiras por meio de redes neurais convolucionais, utilizando 5.488 imagens distribuídas entre coral, jararaca, cascavel e surucucu.</p>

                    <div className="info-list">
                        <div>
                            <strong>Autor</strong>
                            <span>Henrick de Sousa Nogueira</span>
                        </div>

                        <div>
                            <strong>Instituição</strong>
                            <span>Universidade Federal do Pará</span>
                        </div>

                        <div>
                            <strong>Programa</strong>
                            <span>Pós-Graduação em Computação Aplicada</span>
                        </div>

                        <div>
                            <strong>Orientador</strong>
                            <span>Prof. Dr. Bruno Merlin</span>
                        </div>

                        <div>
                            <strong>Ano</strong>
                            <span>2026</span>
                        </div>
                    </div>

                    <div className="research-metrics">
                        <div className="metric-card">
                            <strong>5.488</strong>
                            <span>Imagens no dataset</span>
                        </div>

                        <div className="metric-card">
                            <strong>4</strong>
                            <span>Classes avaliadas</span>
                        </div>

                        <div className="metric-card">
                            <strong>87,44%</strong>
                            <span>Melhor acurácia</span>
                        </div>

                        <div className="metric-card">
                            <strong>0,9791</strong>
                            <span>AUC EfficientNet-B0</span>
                        </div>
                    </div>

                    <div className="research-alert">
                        <i className="pi pi-shield" />
                        Conteúdo científico e informativo. Não substitui avaliação profissional.
                    </div>
                </aside>
            </section>
        </main>
    );
}
