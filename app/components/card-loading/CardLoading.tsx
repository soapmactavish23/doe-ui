import { Card } from 'primereact/card';
import { Skeleton } from 'primereact/skeleton';

export default function CardLoading() {
    return Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="col-12 sm:col-8 md:col-6 lg:col-4">
            <Card header={<Skeleton height="220px" />} className="w-full">
                <Skeleton width="60%" height="1.2rem" />
            </Card>
        </div>
    ));
}
