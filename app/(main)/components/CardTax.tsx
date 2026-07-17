interface CardTaxProps {
    title: string;
    value: number;
    subtitle: string;
    icon: 'pi pi-times' | 'pi pi-check' | 'pi pi-bars' | 'pi pi-list';
    color: 'red' | 'green' | 'yellow' | 'blue';
}

export default function CardTax({ title, subtitle, value, icon, color }: CardTaxProps) {
    return (
        <div className="col-12 lg:col-6 xl:col-3">
            <div className="card mb-0">
                <div className="flex justify-content-between mb-3">
                    <div>
                        <span className="block text-700 font-medium mb-3">{title}</span>
                        <div className="text-900 font-medium text-xl">{value}</div>
                    </div>
                    <div className={`flex align-items-center justify-content-center bg-${color}-100 border-round`} style={{ width: '2.5rem', height: '2.5rem' }}>
                        <i className={`${icon} text-${color}-500 text-xl`} />
                    </div>
                </div>

                <span className="text-500">{subtitle}</span>
            </div>
        </div>
    );
}
