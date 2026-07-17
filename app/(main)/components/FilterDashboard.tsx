'use client';
import { months } from '@/app/components/month';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';

interface FilterDashboard {
    setDate: (date: { month: number; year: number }) => void;
}

export default function FilterDashboard({ setDate }: FilterDashboard) {
    const currentDate = new Date();
    const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);
    const [year, setYear] = useState<number>(currentDate.getFullYear());

    const handleSetCurrentDate = () => {
        setMonth(new Date().getMonth());
        setYear(new Date().getFullYear());
    };

    return (
        <div className="grid p-fluid text-center">
            <div className="col-12 md:col-6">
                <Dropdown options={months} optionLabel="name" onChange={(e) => setMonth(e.value)} value={month} optionValue="id" placeholder="Selecione o mês" />
            </div>
            <div className="col-12 md:col-2">
                <InputText placeholder="Digite o ano" value={year.toString()} onChange={(e) => setYear(Number(e.target.value))} />
            </div>
            <div className="col-12 md:col-2">
                <Button label="Buscar" icon="pi pi-search" onClick={() => setDate({ month, year })} />
            </div>
            <div className="col-12 md:col-2">
                <Button label="Data Atual" icon="pi pi-calendar" onClick={handleSetCurrentDate} type="button" />
            </div>
        </div>
    );
}
