import Aos from 'aos';
import { useEffect } from 'react';

interface CardFlipProps {
    onClick?: React.MouseEventHandler<HTMLDivElement> | (() => void);
    url: string;
    name: string;
}

export default function CardFlip({ url, name, onClick }: CardFlipProps) {
    useEffect(() => {
        Aos.init({ duration: 1000 });
    }, []);

    return (
        <div data-aos="flip-left" className="col-6 md:col-4 lg:col-3" onClick={onClick}>
            {/* Card de imagem com overlay */}
            <figure className="rp-card" role="button" tabIndex={0} aria-label={`Abrir categoria ${name}`}>
                <img src={url} alt={`Categoria ${name}`} className="rp-img" loading="lazy" />
                <figcaption className="rp-overlay">
                    <span className="rp-badge">{name}</span>
                </figcaption>
            </figure>
        </div>
    );
}
