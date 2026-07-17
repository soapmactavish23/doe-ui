'use client';

import './styles.scss';

const steps = [
    {
        icon: 'pi pi-camera',
        title: '1. Capture',
        text: 'Tire uma foto do animal ou grave um áudio.'
    },
    {
        icon: 'pi pi-search',
        title: '2. IA Analisa',
        text: 'Nossa IA analisa imagem, áudio e contexto.'
    },
    {
        icon: 'pi pi-comments',
        title: '3. Resultado',
        text: 'Receba a identificação provável e nível de confiança.'
    },
    {
        icon: 'pi pi-shield',
        title: '4. Orientações',
        text: 'Veja recomendações seguras e o que fazer em cada caso.'
    },
    {
        icon: 'pi pi-map-marker',
        title: '5. Mapeamento',
        text: 'Os dados são anonimizados e ajudam a saúde pública.'
    }
];

const species = [
    {
        name: 'Jararaca',
        scientific: 'Bothrops jararaca',
        tag: 'Mais comum',
        className: 'jararaca',
        image: 'https://radar-peconhento.s3.amazonaws.com/fotos/animal/1'
    },
    {
        name: 'Coral',
        scientific: 'Micrurus corallinus',
        tag: 'Alta letalidade',
        className: 'coral',
        image: 'https://checkplay.s3.amazonaws.com/fotos/animal/4'
    },
    {
        name: 'Cascavel',
        scientific: 'Crotalus durissus',
        tag: 'Frequente',
        className: 'cascavel',
        image: 'https://checkplay.s3.amazonaws.com/fotos/animal/2'
    },
    {
        name: 'Surucucu',
        scientific: 'Lachesis muta',
        tag: 'Atenção',
        className: 'surucucu',
        image: 'https://checkplay.s3.amazonaws.com/fotos/animal/3'
    }
];

export default function Section2() {
    return (
        <section className="section2">
            <div className="section2__how">
                <h2>Como funciona</h2>
                <p>Um processo simples que usa IA para proteger vidas.</p>

                <div className="section2__steps">
                    {steps.map((step, index) => (
                        <div className="step-card" key={step.title}>
                            <div className="step-card__icon">
                                <i className={step.icon} />
                            </div>

                            <h3>{step.title}</h3>
                            <p>{step.text}</p>

                            {index < steps.length - 1 && <span className="step-card__arrow">→</span>}
                        </div>
                    ))}
                </div>
            </div>

            <div className="section2__divider" />

            <div className="section2__species">
                <div className="section2__title">
                    <div>
                        <h2>Espécies monitoradas</h2>
                        <p>Conheça algumas das espécies peçonhentas identificadas pelo sistema.</p>
                    </div>
                </div>

                <div className="species-carousel">
                    <div className="species-grid">
                        {species.map((animal) => (
                            <article className="species-card" key={animal.name}>
                                <div className={`species-card__image ${animal.className}`} style={{ backgroundImage: `url(${animal.image})` }} />

                                <div className="species-card__content">
                                    <h3>{animal.name}</h3>
                                    <p>{animal.scientific}</p>
                                    <span className={`species-card__tag ${animal.className}`}>{animal.tag}</span>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
