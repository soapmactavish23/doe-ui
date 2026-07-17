'use client';

import './styles.scss';
import imgLogo from '../../../public/demo/images/logo.png';
import Section1 from './sections/section1/Section1';
import Section2 from './sections/section2/Section2';

export default function Home() {
    return (
        <>
            <Section1 />
            <Section2 />
        </>
    );
}
