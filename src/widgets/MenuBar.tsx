'use client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { BellIcon, BookmarkIcon, HomeIcon, MailIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface MenuBarProps {
	className?: string
}

const MenuBar = ({ className }: MenuBarProps) => {
	const pathname = usePathname()
	return (
		<div className={className}>
			<Button
				variant='ghost'
				className='flex items-center justify-start gap-3'
				title='Home'
				asChild
			>
				<Link
					href='/'
					className={cn(
						'text-lg font-bold',
						pathname === '/' ? 'text-foreground' : 'text-primary'
					)}
				>
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
				<Link
					href='/notifications'
					className={cn(
						'text-lg font-bold',
						pathname === '/notifications' ? 'text-foreground' : 'text-primary'
					)}
				>
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
				<Link
					href='/massages'
					className={cn(
						'text-lg font-bold',
						pathname === '/massages' ? 'text-foreground' : 'text-primary'
					)}
				>
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
				<Link
					href='/bookmarks'
					className={cn(
						'text-lg font-bold',
						pathname === '/bookmarks' ? 'text-foreground' : 'text-primary'
					)}
				>
					<BookmarkIcon />
					<span className='hidden lg:inline'>Закладки</span>
				</Link>
			</Button>
		</div>
	)
}

export default MenuBar
