import { Metadata } from 'next'
import NotificationsFeed from '@/widgets/feeds/NotificationsFeed'
import TrendsSidebar from '@/widgets/TrendsSidebar'

export const metadata: Metadata = {
	title: 'Уведомления'
}

export default async function Page() {
	return (
		<main className='w-full min-w-0 flex gap-5'>
			<div className='w-full flex flex-col gap-5'>
				<NotificationsFeed />
			</div>
			<TrendsSidebar />
		</main>
	)
}
