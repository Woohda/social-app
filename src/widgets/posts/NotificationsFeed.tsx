'use client'

import { NotificationsPage } from '@/lib/types'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import kyInstance from '@/lib/ky'
import InfiniteScrollContainer from '@/components/InfiniteScrollContainer'
import Notification from '@/components/notification/Notification'
import NotificationLoadingSkeleton from '@/components/notification/NotificationLoadingSkeleton'

const NotificationsFeed = () => {
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
		isLoading,
		isSuccess,
		isError
	} = useInfiniteQuery({
		queryKey: ['notifications'],
		queryFn: ({ pageParam }) =>
			kyInstance
				.get(
					'/api/notifications',
					pageParam ? { searchParams: { cursor: pageParam } } : {}
				)
				.json<NotificationsPage>(),
		initialPageParam: null as string | null,
		getNextPageParam: lastPage => lastPage.nextCursor
	})

	const notifications = data?.pages.flatMap(page => page.notifications) || []

	if (isLoading) return <NotificationLoadingSkeleton />

	if (isSuccess && !notifications.length && !hasNextPage)
		return (
			<p className='p-3 shadow-sm rounded-2xl text-center text-muted-foreground bg-card'>
				Нет уведомлений
			</p>
		)

	if (isError)
		return (
			<p className='text-center text-destructive'>
				При загрузке уведомлений произошла ошибка.
			</p>
		)

	return (
		<InfiniteScrollContainer
			className='flex flex-col gap-5'
			onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
		>
			{notifications.map(notification => (
				<Notification key={notification.id} notification={notification} />
			))}
			{isFetchingNextPage && <Loader2 className='my-3 mx-auto animate-spin' />}
		</InfiniteScrollContainer>
	)
}

export default NotificationsFeed
