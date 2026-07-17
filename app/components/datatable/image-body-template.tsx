/* eslint-disable jsx-a11y/alt-text */
import userImg from '../../../assets/user.png';

export const imageBodyTemplate = (rowData: any) => {
    if (rowData.url) {
        return <img src={`${rowData.url}`} alt="Imagem" className="shadow-2 border-round" style={{ width: '64px' }} />;
    } else {
        return <></>;
    }
};

export const imageBodyTemplateUser = () => {
    return <img src={userImg.src} style={{ width: '64px' }} />;
};
