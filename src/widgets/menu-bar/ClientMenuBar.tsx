'use client'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BellIcon, BookmarkIcon, HomeIcon, MailIcon } from 'lucide-react'
import NotificationCount from '@/components/NotificationCount'
import MenuButton from '@/components/button/MenuButton'

interface ClientMenuBarProps {
	className: string
	unreadCount: number
}

const ClientMenuBar = ({ className, unreadCount }: ClientMenuBarProps) => {
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
						initialState={{ unreadCount: unreadCount }}
						className='absolute -top-1.5 -right-1'
					/>
				</div>
			</MenuButton>
			<MenuButton title='Сообщения' href='/messages' pathname={pathname}>
				<MailIcon />
			</MenuButton>
			<MenuButton title='Закладки' href='/bookmarks' pathname={pathname}>
				<BookmarkIcon />
			</MenuButton>
		</div>
	)
}

export default ClientMenuBar
