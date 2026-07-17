import './styles.css';
import packageJson from '../../../package.json';
export default function Footer() {
    const version = packageJson.version;

    return (
        <footer className="footer">
            <div className="footer__content">
                <div className="footer__left">
                    <span>
                        Todos os direitos reservados a <strong>Henrick Nogueira</strong> – Mestrando PPCA UFPA – <strong>v{version}</strong>
                    </span>
                </div>

                <div className="footer__right">
                    <a href="https://linkedin.com/in/henricknogueira" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <i className="pi pi-linkedin"></i>
                    </a>
                    <a href="https://github.com/henricknogueira" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <i className="pi pi-github"></i>
                    </a>
                </div>
            </div>
        </footer>
    );
}
