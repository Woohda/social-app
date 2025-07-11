'use client'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BellIcon, BookmarkIcon, HomeIcon, MailIcon } from 'lucide-react'
import NotificationCount from '@/components/counts/NotificationCount'
import MenuButton from '@/components/button/MenuButton'
import MessageCount from '@/components/counts/MessageCount'

interface ClientMenuBarProps {
	className: string
	unreadNotificationCount: number
	unreadMessageCount: number
}

const ClientMenuBar = ({
	className,
	unreadNotificationCount,
	unreadMessageCount
}: ClientMenuBarProps) => {
	const pathname = usePathname()
	return (
		<div className={cn(className)}>
			<MenuButton title='Главная' href='/' pathname={pathname}>
				<HomeIcon className='size-7' />
			</MenuButton>

			<MenuButton title='Уведомления' href='/notifications' pathname={pathname}>
				<div className='relative'>
					<BellIcon />
					<NotificationCount
						initialState={{ unreadCount: unreadNotificationCount }}
						className='absolute -top-1.5 -right-1'
					/>
				</div>
			</MenuButton>
			<MenuButton title='Сообщения' href='/messages' pathname={pathname}>
				<div className='relative'>
					<MailIcon />
					<MessageCount
						initialState={{ unreadCount: unreadMessageCount }}
						className='absolute -top-1.5 -right-1'
					/>
				</div>
			</MenuButton>
			<MenuButton title='Закладки' href='/bookmarks' pathname={pathname}>
				<BookmarkIcon />
			</MenuButton>
		</div>
	)
}

export default ClientMenuBar
