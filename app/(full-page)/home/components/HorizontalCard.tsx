import Link from 'next/link';
import { Button } from 'primereact/button';

interface HorizontalCardProps {
    image: string;
    title: string;
    description: string;
    link: string;
}

export default function HorizontalCard(props: HorizontalCardProps) {
    return (
        <>
            <hr />
            <div data-aos="fade-up" className="grid">
                <div className="col-12 md:col-3">
                    <img src={props.image} alt="" className="img-thumbnail" height={250} width={250} />
                </div>
                <div className="col-12 md:col-9">
                    <h3>{props.title}</h3>
                    <hr />
                    <p>{props.description}</p>
                    <hr />
                    <Button label="Acessar" icon="pi pi-arrow-right" onClick={() => window.open(props.link, '_blank')} />
                </div>
            </div>
            <hr />
        </>
    );
}
