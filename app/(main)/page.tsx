/* eslint-disable @next/next/no-img-element */
'use client';
import Dashboard from './pages/dashboard/Dashboard';

export default function Home() {
    return (
        <>
            <div className="card">
                <div className="text-center mb-5">
                    <img src="/demo/images/logo.png" alt="Image" height="100" className="mb-3" />
                    <div className="text-900 text-3xl font-medium mb-3">Radar Peçonhento</div>
                </div>
                <br />
                <Dashboard />
            </div>
        </>
    );
}
