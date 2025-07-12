import useSession from '@/hooks/use-session'
import {
	ChannelList,
	ChannelPreviewMessenger,
	ChannelPreviewUIComponentProps,
	DefaultStreamChatGenerics,
	useChatContext
} from 'stream-chat-react'
import { cn } from '@/lib/utils'
import { useCallback, useEffect } from 'react'
import { Channel } from 'stream-chat'
import HeaderSidebar from './HeaderChatSidebar'
import { useQueryClient } from '@tanstack/react-query'

interface ChatSidebarProps {
	open: boolean
	onClose: () => void
}

const ChatSidebar = ({ open, onClose }: ChatSidebarProps) => {
	const { user } = useSession()
	if (!user) {
		throw new Error('User is not logged in')
	}

	const queryClient = useQueryClient()

	const { channel } = useChatContext()

	useEffect(() => {
		if (channel?.id) {
			queryClient.invalidateQueries({
				queryKey: ['unread-messages-count']
			})
		}
	}, [channel?.id, queryClient])

	const ChannelPreviewCustom = useCallback(
		(props: ChannelPreviewUIComponentProps<DefaultStreamChatGenerics>) => (
			<ChannelPreviewMessenger
				{...props}
				onSelect={() => {
					props.setActiveChannel?.(props.channel, props.watchers)
					onClose()
				}}
			/>
		),
		[onClose]
	)

	const filterDuplicateChannels = useCallback((channels: Channel[]) => {
		const seen = new Set()
		return channels.filter(channel => {
			if (seen.has(channel.id)) return false
			seen.add(channel.id)
			return true
		})
	}, [])

	return (
		<div
			className={cn(
				'size-full md:flex flex-col border-e md:w-72',
				open ? 'flex' : 'hidden'
			)}
		>
			<HeaderSidebar onClose={onClose} />
			<ChannelList<DefaultStreamChatGenerics>
				filters={{
					type: 'messaging',
					members: { $in: [user.id] }
				}}
				showChannelSearch
				options={{ state: true, presence: true, limit: 8 }}
				sort={{ last_message_at: -1 }}
				additionalChannelSearchProps={{
					searchForChannels: true,
					searchQueryParams: {
						channelFilters: {
							filters: { members: { $in: [user.id] } }
						}
					}
				}}
				channelRenderFilterFn={filterDuplicateChannels}
				Preview={ChannelPreviewCustom}
			/>
		</div>
	)
}

export default ChatSidebar
