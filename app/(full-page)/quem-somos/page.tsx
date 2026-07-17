'use client';

import './styles.scss';

import imgBanner from '../../../assets/quem-somos/banner.png';
import imgUfpa from '../../../assets/quem-somos/ufpa.png';
import imgProfile from '../../../assets/quem-somos/profile.png';
import imgProfile2 from '../../../assets/quem-somos/profile2.png';

export default function QuemSomos() {
    const impactos = ['Apoio à vigilância em saúde', 'Redução de erros na identificação', 'Agilidade no atendimento', 'Decisões baseadas em dados', 'Proteção da vida e da biodiversidade'];

    const tecnologias = [
        {
            name: 'Flutter',
            description: 'Aplicativo móvel multiplataforma',
            image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg'
        },
        {
            name: 'React',
            description: 'Interface web moderna',
            image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'
        },
        {
            name: 'Spring Boot',
            description: 'Back-end REST API',
            image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg'
        },
        {
            name: 'Python',
            description: 'IA e ciência de dados',
            image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg'
        },
        {
            name: 'Flask',
            description: 'Microsserviço de IA',
            image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg'
        },
        {
            name: 'TensorFlow',
            description: 'Deep Learning',
            image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg'
        },
        {
            name: 'Deep Seek',
            description: 'LLM para avaliação multimodal',
            image: 'https://www.morphcast.com/wp-content/uploads/2025/01/deepseek.jpg.webp'
        },
        {
            name: 'MySQL',
            description: 'Banco de dados relacional',
            image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg'
        },
        {
            name: 'Docker',
            description: 'Containerização',
            image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg'
        },
        {
            name: 'Kubernetes',
            description: 'Orquestração de containers',
            image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg'
        },
        {
            name: 'RabbitMQ',
            description: 'Mensageria assíncrona',
            image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rabbitmq/rabbitmq-original.svg'
        },
        {
            name: 'Firebase',
            description: 'Back-end a Service',
            image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg'
        },
        {
            name: 'Firebase Message Cloud',
            description: 'Push notifications',
            image: 'https://firebase.google.com/static/images/products/icons/run_cloud_messaging.svg?hl=pt-br'
        },
        {
            name: 'AWS S3',
            description: 'Armazenamento de imagens',
            image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg'
        },
        {
            name: 'Secrets Manager',
            description: 'Serviço da AWS para armazenamento de secrets.',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKZfriqR40GHjWsAltQoRD4Kmed6l_SCt-Uw&s'
        },
        {
            name: 'Terraform',
            description: 'Infraestrutura como código',
            image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg'
        },
        {
            name: 'Git',
            description: 'Controle de versão',
            image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg'
        },
        {
            name: 'GitHub',
            description: 'Repositórios e CI/CD',
            image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg'
        },
        {
            name: 'Jenkins',
            description: 'Pipeline CI/CD',
            image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg'
        },
        {
            name: 'SonarQube',
            description: 'Qualidade de código',
            image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sonarqube/sonarqube-original.svg'
        },

        {
            name: 'Grafana',
            description: 'Observabilidade',
            image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg'
        },
        {
            name: 'Mimir',
            description: 'Métricas',
            image: 'https://grafana.com/media/docs/mimir/GrafanaLogo_Mimir_icon.png'
        },
        {
            name: 'Loki',
            description: 'Coleta de logs',
            image: 'https://grafana.com/media/docs/loki/logo-grafana-loki.png'
        },
        {
            name: 'Tempo',
            description: 'Coleta de séries temporais',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWJ7C06m5f4UeBXujHEjAwUu3GGd0oFhufog&s'
        },
        {
            name: 'Jupyter',
            description: 'Notebook de IA',
            image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jupyter/jupyter-original.svg'
        },
        {
            name: 'Nexus',
            description: 'Bibliotecas',
            image: 'https://opsera.ai/wp-content/uploads/2025/07/5f2af61146c55b6e172fa5b3_NexusRepo_Icon.png'
        },
        {
            name: 'Rancher',
            description: 'Gerenciamento visual do kubernets',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbsJqlU363OP5RRMTNRKPOUuqPhCU_fwX2_w&s'
        },
        {
            name: 'Keycloak',
            description: 'Autenticação e segurança',
            image: 'https://ramonduraes.net/wp-content/uploads/2021/04/key.png'
        }
    ];

    return (
        <main className="about-page">
            <section className="about-hero">
                <div className="about-hero__text">
                    <span>QUEM SOMOS</span>

                    <h1>
                        Tecnologia e ciência <br />a serviço da vida
                    </h1>

                    <p>O Radar Peçonhento nasceu da união entre tecnologia, pesquisa científica e saúde pública para apoiar a identificação de animais peçonhentos na Amazônia, contribuindo para decisões mais rápidas, seguras e baseadas em dados.</p>

                    <div className="about-hero__highlights">
                        <div>
                            <i className="pi pi-cog" />
                            <strong>Tecnologia a serviço da vida</strong>
                            <small>IA aplicada à saúde pública e ao meio ambiente</small>
                        </div>

                        <div>
                            <i className="pi pi-heart" />
                            <strong>Impacto real</strong>
                            <small>Apoio à vigilância, prevenção e gestão da saúde pública</small>
                        </div>
                    </div>
                </div>

                <div className="about-hero__profile">
                    <img alt="Henrick de Sousa Nogueira" src={imgProfile.src} />

                    <div className="about-hero__profile-info">
                        <span>Autor e Pesquisador</span>
                        <h2>Henrick de Sousa Nogueira</h2>
                        <p>Mestre em Computação Aplicada pela UFPA. Pesquisador em inteligência artificial aplicada à saúde pública e reconhecimento de padrões visuais.</p>

                        <div className="about-hero__profile-actions">
                            <a href="https://www.linkedin.com/in/henrick-nogueira/" target="_blank">
                                <i className="pi pi-linkedin" />
                                Ver LinkedIn
                            </a>
                            <a
                                href="https://buscatextual.cnpq.br/buscatextual/visualizacv.do?id=K8871328J3&tokenCaptchar=0cAFcWeA48zNeZyTIP5qkAT8b--j7Ey0MxhO6GflshkOAjlz_vwMf4eOpQQGANxlcMoaFbh_LrdeAhiY8dtTmtIZZlJaz6Gveys1T5VvdEXg-xrSbqdqPWjmFgYKDaXigCQNTKW_gUZq_-xiMgR4fvZpmholNhGo6Aj3Mfs9msh4oIPpJNSlvrMWmOiTZfF4rKBpGfiuGj5D6ExMpCHgI5qaSvOPL56qMoq7vZYb8rGIXEca2t_5tyJlheD-p0zM-tVzPdbBhK_KzdGXrvZVsxBFbEkOfTZ14vYjsK0FjWZTj1ZZ7mLf2EfByuCfjS6K4U_jrEpvDn--B0i9uuxBMqeEjmrJVwGhFIcK8Ebf6Hg8daslEHQL8mor-JmM7BOCU3JKjvwB4Ptdv_xc-7bICUa8SMZa4wH1Czj_oxN_94eJSM7e6DLLPNI5OLSJiAKfqjJWg_ffBZ67NSbR69ZGYw76E9MOGAA8MCAGW8E-sMZhBTAGvTjKT345D-YZAYtW67NloXu-fZ_mwihZNih4h3yhjb-cn4c_gDB6LB1RJmG4c6EVw7HMoggIeVN33mHwvFCEn8r0bitNNtE5teM5GWf7HmBZ8wYd7ULBNulTvaK-M8ewD87LcbTHlTRfeL1clBcxaBmbwaUA1mOWEx_0J92nZAwOjMqcpmijMAD9XZzCoO-VW6bcu5fqWMc-Wmzy3AeL7qYeZRW-qhmRqJfzWBlwyyVIZ0FHCXPAwsfvTl-n8wsUnYNPCAaRzrfuDJhnzlrmjNysmhMgaCMAMYNH8lVst29RoO5FydJq6e8MEjjS_M0NjY-OQkTJNz4pu2Lyj6qiUR-YfEIqV_jXIezgNq4NzcJeqqbjaneecym3eauxiWNWQrXz9tiUyLyr0xAV8chcVmdrxfosckIDuo8SV96Du5VomRcrhgP6IrZ84qoIQ_45t8XdSM65dgHJG8Rv9n7R5YwI4cXh6pt4RRcVJxHdMdxOqMmDCKOazdgBYJRwN2hjckw07vDC_7Vax0-oe_WxhEs-xOK1N1icta3cKtZHk-namkF_ybOuUc6uMH2MsuV6G3T-pkvs-Lh-95gBnwwV_buNmkDnAxtPhbZdgwRAIgvXN7l9GbCp0GEH3nR1L18DLwwVcjZUBwYdPyL5ebt3rrjMcT7tlArN90KeKZ_WNXk9WO5uCSdxumFzAFk48ciwnLn5EzsMKsRErx2p0kyt5hJ8IzFQKDij5Za9UpUCt-rYvKlROAEPg_SiG07Qao6ohma0y8RClQ1ND0zO0WagJxYqhoIjZBRb4I0UKv5fhsn3p2-pegIvuT1T4id6XUIYKbWB4R-0LA-nKisDl5H6GKv0AI4txi9Y755v6MOYN71agbpoI9GKMm3tYw1t22ySknETzhgWOsGG4imQEKAAiMytsclDzOBLaamhIIL0gYpcZpC4rxq0amV_VFTGUwBBxDg-TSDAf9TskWKJ1dcMQGZW70JrZzoU0up-twxb0yuV0kj07GKY0lMsFQlIWM3StAQZ_5LcGdD8GJq_dA7gRYtZkqKKM8FU0xEMgLX6Bk5wGN2UzMfCZmv67TNCv-Qj4mUolHMmUiFF8CjxWqDIfijSOkuf1CBpgfAhRx4Qvb5DavfDPB3ec3Fd4Vu5gRSaCY84bftoBLD58M4rLFRc3_zUmiJp3Z6-raPBlz5ElpMej3W_OEPDAfneDup3TC7UAXUcp8I06IoKaBZ0tAmVuRPDnHYHmLX09ysQI1wLMQDzkKIeosW6SVy2qSPgNaSpXovrwlm9toeGbmfossp_ZCGLYiWTTzByaL8gocbCdsdW24620z2l_Py5-8BROtKpmzzU0b6RE9EuluxLlqk4-KCuDwnMjskf86UHl-6oZmMDET2YxOAeN3jXZBzzPqcgxCrGRPYfXIumuTXR3QMnIHjgwHUZ6Hdg3mw4qTba3O9d5d2pxUC9cl-6mt3AgypC50A9_QOtw9i3r09v7Wyw68MMZaqwtxZOGxu_F61RXYPOjbXnmIO8QseAtxLAoYwZcAf7oUjU--RJFunXYsw4LeAdzQhvB7wux9bDoBt4lm8Ms1H6Frtq6p4ErsZCRWJXi3NzzFQ3mDgys-jCs25kPmET-9tOv_Fgk1YmqQrKMv8UAnEKB4i414V5Q9eH_oNwSsS5yIbzZLuiY1hg8QTPRz0RYixZ0ke0ECXUVJVAwt5OT893sNOn_4YMzIlf0e_CBNspJ6kzXxvFbeLGubh0uft4Zr_F4VnFQ7MsYGUi2ylhnMs_brvDuJ_4Hax1wOGPcrrrpsVsc"
                                target="_blank"
                            >
                                <i className="pi pi-external-link" />
                                Currículo Lattes
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-cards">
                <article className="about-card about-card--large">
                    <i className="pi pi-map-marker" />
                    <h3>Nossa Origem</h3>
                    <p>
                        O projeto surgiu durante o mestrado em Computação Aplicada na Universidade Federal do Pará, a partir da necessidade real de melhorar a identificação de animais peçonhentos e apoiar profissionais de saúde na tomada de decisão.
                    </p>
                    <p>Unimos conhecimento científico, inteligência artificial e experiência prática para criar uma solução robusta, acessível e com propósito social.</p>
                </article>

                <article className="about-card">
                    <i className="pi pi-bars" />
                    <h3>Missão</h3>
                    <p>Desenvolver e disponibilizar tecnologias inteligentes que auxiliem na identificação de animais peçonhentos, promovendo agilidade, segurança e eficiência na gestão da saúde pública.</p>
                </article>

                <article className="about-card">
                    <i className="pi pi-eye" />
                    <h3>Visão</h3>
                    <p>Ser referência nacional no uso de inteligência artificial aplicada à saúde e ao meio ambiente, contribuindo para um futuro mais seguro e sustentável.</p>
                </article>

                <article className="about-card">
                    <i className="pi pi-chart-line" />
                    <h3>Impacto</h3>

                    <ul>
                        {impactos.map((item) => (
                            <li key={item}>
                                <i className="pi pi-check-circle" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </article>
            </section>

            <section className="about-main-grid">
                <article className="architecture-card">
                    <div className="section-heading">
                        <i className="pi pi-sitemap" />
                        <h3>Arquitetura e Tecnologias do Projeto</h3>
                    </div>

                    <div className="tech-grid">
                        {tecnologias.map((tech) => (
                            <div className="tech-item" key={tech.name}>
                                <img src={tech.image} alt={tech.name} />

                                <div>
                                    <strong>{tech.name}</strong>
                                    <span>{tech.description}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </article>

                <aside className="about-side">
                    <article className="profile-card">
                        <div className="section-heading">
                            <i className="pi pi-user" />
                            <h3>Autor e Pesquisador</h3>
                        </div>

                        <div className="profile-card__content">
                            <img alt="Foto do pesquisador" src={imgProfile2.src} />

                            <div>
                                <h4>Bruno Merlin</h4>
                                <p>Orientador da pesquisa. Doutor e professor com atuação na área de Interação Humano-Computador.</p>
                            </div>
                        </div>
                    </article>

                    <article className="institution-card">
                        <div className="section-heading">
                            <i className="pi pi-building" />
                            <h3>Instituição</h3>
                        </div>

                        <div className="institution-card__content">
                            <img alt="Logo da Universidade Federal do Pará" src={imgUfpa.src} />

                            <div>
                                <h4>Universidade Federal do Pará</h4>
                                <p>Núcleo de Desenvolvimento Amazônico em Engenharia. Programa de Pós-Graduação em Computação Aplicada.</p>
                            </div>
                        </div>
                    </article>

                    <article className="commitment-card">
                        <i className="pi pi-shield" />
                        <div>
                            <h3>Nosso compromisso é com a vida, com a ciência e com a Amazônia.</h3>
                            <p>Radar Peçonhento: inteligência que protege vidas.</p>
                        </div>
                    </article>
                </aside>
            </section>
        </main>
    );
}
