'use client'

import { useInitializeChatClient } from '@/hooks/use-initializeChatClient'
import { Loader2 } from 'lucide-react'
import { Chat as StreamChat } from 'stream-chat-react'
// import ChatSidebar from './ChatSidebar'
import ChatChannel from './ChatChannel'
import { useTheme } from 'next-themes'
import { useState } from 'react'

const Chat = () => {
	const chatClient = useInitializeChatClient()
	const { resolvedTheme } = useTheme()

	const [isOpen, setIsOpen] = useState(false)

	if (!chatClient) {
		return <Loader2 className='mx-auto my-3 animate-spin' />
	}

	return (
		<main className='relative w-full overflow-hidden rounded-2xl bg-card shadow-sm'>
			<div className='absolute bottom-0 top-0 flex w-full'>
				<StreamChat
					client={chatClient}
					theme={
						resolvedTheme === 'dark'
							? 'str-chat__theme-dark'
							: 'str-chat__theme-light'
					}
				>
					{/* <ChatSidebar open={isOpen} onClose={() => setIsOpen(false)} /> */}
					<ChatChannel open={!isOpen} openSidebar={() => setIsOpen(true)} />
				</StreamChat>
			</div>
		</main>
	)
}

export default Chat
