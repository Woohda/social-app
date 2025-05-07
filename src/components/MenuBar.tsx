import { BellIcon, BookmarkIcon, HomeIcon, MailIcon } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'

interface MenuBarProps {
	className?: string
}

const MenuBar = ({ className }: MenuBarProps) => {
	return (
		<div className={className}>
			<Button
				variant='ghost'
				className='flex items-center justify-start gap-3'
				title='Home'
				asChild
			>
				<Link href='/' className='text-2xl font-bold text-primary'>
					<HomeIcon />
					<span className='hidden lg:inline'>Главная</span>
				</Link>
			</Button>
			<Button
				variant='ghost'
				className='flex items-center justify-start gap-3'
				title='Notifications'
				asChild
			>
				<Link href='/notifications' className='text-2xl font-bold text-primary'>
					<BellIcon />
					<span className='hidden lg:inline'>Уведомления</span>
				</Link>
			</Button>
			<Button
				variant='ghost'
				className='flex items-center justify-start gap-3'
				title='Massages'
				asChild
			>
				<Link href='/massages' className='text-2xl font-bold text-primary'>
					<MailIcon />
					<span className='hidden lg:inline'>Сообщения</span>
				</Link>
			</Button>
			<Button
				variant='ghost'
				className='flex items-center justify-start gap-3'
				title='Bookmarks'
				asChild
			>
				<Link href='/bookmarks' className='text-2xl font-bold text-primary'>
					<BookmarkIcon />
					<span className='hidden lg:inline'>Закладки</span>
				</Link>
			</Button>
		</div>
	)
}

export default MenuBar
