import { Card } from "primereact/card";
import imgEmpty from '../../../public/demo/images/not_found.png';

interface CardEmptyProps {
    title: string
}

export default function CardEmpty({title}: CardEmptyProps) {
    return (
        <div className="col-12 sm:col-8 md:col-5 lg:col-3 mt-4">
            <Card className="w-full text-center" title={title} header={<img src={imgEmpty.src} alt="img-empty" height={300} />}></Card>
        </div>
    );
}
