'use client'

import kyInstance from '@/lib/ky'
import { NotificationsCountInfo } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'

interface NotificationCountProps {
	initialState: NotificationsCountInfo
	className?: string
}

const NotificationCount = ({
	initialState,
	className
}: NotificationCountProps) => {
	const { data } = useQuery({
		queryKey: ['unread-notification-count'],
		queryFn: () =>
			kyInstance
				.get('/api/notifications/unread-count')
				.json<NotificationsCountInfo>(),
		initialData: initialState,
		refetchInterval: 60 * 1000 // 1 minute
	})
	return (
		<>
			{!!data.unreadCount && (
				<span
					className={cn(
						'rounded-full bg-primary text-primary-foreground text-xs px-1 font-medium tabular-nums',
						className
					)}
				>
					{data.unreadCount > 99 ? '99+' : data.unreadCount}
				</span>
			)}
		</>
	)
}

export default NotificationCount
