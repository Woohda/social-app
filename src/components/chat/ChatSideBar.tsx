import useSession from '@/hooks/use-session'
import { MailPlusIcon, X } from 'lucide-react'
import {
	ChannelList,
	ChannelPreviewMessenger,
	ChannelPreviewUIComponentProps
} from 'stream-chat-react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { useCallback, useState } from 'react'
import NewChatDialog from '../dialog/NewChatDialog'

interface ChatSideBarProps {
	open: boolean
	onClose: () => void
}

const ChatSidebar = ({ open, onClose }: ChatSideBarProps) => {
	const { user } = useSession()
	if (!user) {
		throw new Error('User is not logged in')
	}

	const ChannelPreviewCustom = useCallback(
		(props: ChannelPreviewUIComponentProps) => (
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

	return (
		<div
			className={cn(
				'size-full md:flex flex-col border-e md:w-72',
				open ? 'flex' : 'hidden'
			)}
		>
			<MenuHeader onClose={onClose} />
			<ChannelList
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
				Preview={ChannelPreviewCustom}
			/>
		</div>
	)
}

interface MenuHeaderProps {
	onClose: () => void
}

function MenuHeader({ onClose }: MenuHeaderProps) {
	const [showNewChatDialog, setShowNewChatDialog] = useState(false)
	return (
		<>
			<div className='flex items-center gap-3 p-2'>
				<div className='h-full md:hidden'>
					<Button size='icon' variant='ghost' onClick={onClose}>
						<X className='size-5' />
					</Button>
				</div>
				<h1 className='me-auto text-xl font-bold md:ms-2'>Сообщения</h1>
				<Button
					size='icon'
					variant='ghost'
					title='Написать сообщение'
					onClick={() => setShowNewChatDialog(true)}
				>
					<MailPlusIcon className='size-5' />
				</Button>
			</div>
			{showNewChatDialog && (
				<NewChatDialog
					onOpenChange={setShowNewChatDialog}
					onChatCreated={() => {
						setShowNewChatDialog(false)
						onClose()
					}}
				/>
			)}
		</>
	)
}

export default ChatSidebar
