'use client'

import kyInstance from '@/lib/ky'
import { MessageCountInfo } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'

interface MessagesCountProps {
	initialState: MessageCountInfo
	className?: string
}

const MessageCount = ({ initialState, className }: MessagesCountProps) => {
	const { data } = useQuery({
		queryKey: ['unread-messages-count'],
		queryFn: () =>
			kyInstance.get('/api/messages/unread-count').json<MessageCountInfo>(),
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

export default MessageCount
