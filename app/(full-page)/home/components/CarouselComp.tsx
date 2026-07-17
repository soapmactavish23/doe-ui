import { Carousel } from 'primereact/carousel';

import { useState } from 'react';

import ca1 from '../../../../public/demo/images/carrousel1.png';
import ca2 from '../../../../public/demo/images/carrousel2.png';
import ca3 from '../../../../public/demo/images/carrousel3.png';
import ca4 from '../../../../public/demo/images/carrousel4.png';
import ca5 from '../../../../public/demo/images/carrousel5.png';

export default function CarouselComp() {
    const [images, setImages] = useState<string[]>([ca1.src, ca2.src, ca3.src, ca4.src, ca5.src]);

    const imageTemplate = (image: string) => {
        return (
            <div className="text-center">
                <img src={image} alt="img-carrousel" className="shadow-2 img-fluid" />
            </div>
        );
    };

    return <Carousel value={images} numVisible={1} numScroll={1} itemTemplate={imageTemplate} />;
}
