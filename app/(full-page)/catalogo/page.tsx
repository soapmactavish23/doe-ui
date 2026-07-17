/* eslint-disable @next/next/no-img-element */
'use client';

import { Category } from '@/app/api/models/category';
import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/app/api/services/category/category_service_impl';
import { QueryKey } from '@/app/lib/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import CardFlip from '@/app/components/card-flip/CardFlip';
import CardLoading from '@/app/components/card-loading/CardLoading';
import CardEmpty from '@/app/components/card-empty/CardEmpty';
import LoadingContent from '@/layout/LoadingContent';

// ✅ Ajuste o import conforme seu projeto

export default function Home() {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);

    const { data: categories, isLoading } = useQuery<Category[]>({
        queryKey: [QueryKey.CATEGORY_FIND_ALL],
        queryFn: () => categoryService.findAll(),
        enabled: true
    });

    useEffect(() => {
        setLoading(false);
    }, [pathname]);

    const goToAnimal = (categoryId: number) => {
        if (loading) return;

        localStorage.setItem('categoryId', String(categoryId));
        setLoading(true);
        router.push('/animal');
    };

    return (
        <>
            {loading && <LoadingContent />}

            <section className="rp-wrap">
                <h3 className="rp-title">Selecione uma categoria</h3>

                <div className="grid justify-content-center gap-3">
                    {isLoading && <CardLoading />}

                    {!isLoading && (!categories || categories.length === 0) && <CardEmpty title="Nenhum animal encontrado." />}

                    {!isLoading && categories?.map((category) => <CardFlip key={category.id} name={category.name} url={category.url!} onClick={() => goToAnimal(category.id!)} />)}
                </div>
            </section>
        </>
    );
}
