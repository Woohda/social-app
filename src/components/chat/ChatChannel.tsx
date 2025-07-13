'use client'

import { cn } from '@/lib/utils'
import { Channel, MessageInput, MessageList, Window } from 'stream-chat-react'
import CustomChannelHeader from './CustomChannelHeader'

interface ChatChannelProps {
	open: boolean
	openSidebar: () => void
}

const ChatChannel = ({ open, openSidebar }: ChatChannelProps) => {
	return (
		<div className={cn('w-full md:block', !open && 'hidden')}>
			<Channel>
				<Window>
					<CustomChannelHeader openSidebar={openSidebar} />
					<MessageList />
					<MessageInput />
				</Window>
			</Channel>
		</div>
	)
}

export default ChatChannel
