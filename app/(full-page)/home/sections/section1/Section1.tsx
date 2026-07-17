'use client';

import './styles.scss';

import { useRouter } from 'next/navigation';

import Image from 'next/image';
import sectionImg01 from '../../../../../assets/sections/section_img01.png';

export default function Section1() {
    const router = useRouter();

    return (
        <section className="section1">
            <div className="section1__content">
                <span className="section1__badge">INTELIGÊNCIA ARTIFICIAL A SERVIÇO DA VIDA</span>

                <h1>
                    Identificação inteligente <br />
                    de animais peçonhentos <br />
                    <strong>na Amazônia</strong>
                </h1>

                <p>Tecnologia de visão computacional, áudio e IA para reconhecer espécies peçonhentas, apoiar a saúde pública e salvar vidas.</p>

                <div className="section1__features">
                    <div className="feature">
                        <div className="feature__icon">
                            <i className="pi pi-camera" />
                        </div>
                        <div>
                            <strong>Imagem</strong>
                            <span>Reconhecimento por foto</span>
                        </div>
                    </div>

                    <div className="feature">
                        <div className="feature__icon">
                            <i className="pi pi-microphone" />
                        </div>
                        <div>
                            <strong>Áudio</strong>
                            <span>Análise sonora inteligente</span>
                        </div>
                    </div>

                    <div className="feature">
                        <div className="feature__icon">
                            <i className="pi pi-comments" />
                        </div>
                        <div>
                            <strong>Texto</strong>
                            <span>Descrição e contexto do animal</span>
                        </div>
                    </div>

                    <div className="feature">
                        <div className="feature__icon">
                            <i className="pi pi-search" />
                        </div>
                        <div>
                            <strong>IA Avançada</strong>
                            <span>Modelos treinados com alta precisão</span>
                        </div>
                    </div>
                </div>

                <div className="section1__actions">
                    <button className="btn-primary" onClick={() => router.push('/identificacao')}>
                        <i className="pi pi-camera" />
                        Identificar Animal
                    </button>

                    <button className="btn-outline" onClick={() => router.push('/dashboard')}>
                        <i className="pi pi-chart-bar" />
                        Explorar Dashboard
                    </button>
                </div>

                <div className="section1__notice">
                    <i className="pi pi-shield" />
                    Informação segura, confiável e sem substituição de avaliação médica.
                </div>
            </div>

            <div className="section1__mockups">
                <Image src={sectionImg01} alt="Aplicativo Radar Peçonhento exibido em três celulares" className="section1__mockups-image" priority />
            </div>
        </section>
    );
}
