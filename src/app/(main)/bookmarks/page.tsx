import { Metadata } from 'next'
import BookmarksFeed from '@/widgets/feeds/BookmarksFeed'
import TrendsSidebar from '@/widgets/TrendsSidebar'

export const metadata: Metadata = {
	title: 'Закладки'
}

export default async function Page() {
	return (
		<main className='w-full min-w-0 flex gap-5'>
			<div className='w-full flex flex-col gap-5'>
				<BookmarksFeed />
			</div>
			<TrendsSidebar />
		</main>
	)
}
