'use client'
import { useState } from 'react'
import { Button } from '../ui/button'
import { MailPlusIcon, XIcon } from 'lucide-react'
import NewChatDialog from '../dialog/NewChatDialog'

interface HeaderSidebarProps {
	onClose: () => void
}

function HeaderSidebar({ onClose }: HeaderSidebarProps) {
	const [showNewChatDialog, setShowNewChatDialog] = useState(false)
	return (
		<>
			<div className='flex items-center gap-3 p-2'>
				<div className='h-full md:hidden'>
					<Button size='icon' variant='ghost' onClick={onClose}>
						<XIcon className='size-5' />
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

export default HeaderSidebar
