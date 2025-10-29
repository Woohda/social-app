import SearchPostsFeed from '@/widgets/feeds/SearchPostsFeed'
import TrendsSidebar from '@/widgets/TrendsSidebar'
import { Metadata } from 'next'

interface PageProps {
	searchParams: { q: string }
}

// Функция для генерации метаданных страницы поиска по запросу
// Используется для SEO-оптимизации и улучшения отображения в социальных сетях
// Возвращает заголовок, описание и Open Graph метаданные для страницы поста.
export function generateMetadata({ searchParams: { q } }: PageProps): Metadata {
	return {
		title: `Результаты поиска по запросу: "${q}"`
	}
}

export default async function Page({ searchParams: { q } }: PageProps) {
	return (
		<main className='w-full min-w-0 flex gap-5'>
			<div className='w-full flex flex-col gap-5'>
				<div className='rounded-2xl bg-card p-5 shadow-sm'>
					<h1 className='text-center text-2xl font-bold line-clamp-2 break-all'>
						Результаты поиска по запросу: &quot;{q}&quot;
					</h1>
				</div>
				<SearchPostsFeed query={q} />
			</div>
			<TrendsSidebar />
		</main>
	)
}
