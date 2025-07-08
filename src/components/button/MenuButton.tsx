import Link from 'next/link'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

interface MenuButtonProps {
	className?: string
	title: string
	href: string
	pathname?: string
	children: React.ReactNode
}

const MenuButton = ({
	className,
	title,
	href,
	pathname,
	children
}: MenuButtonProps) => {
	return (
		<Button
			variant='ghost'
			className={cn(
				'flex items-center justify-start gap-3 text-[15px]',
				className
			)}
			asChild
		>
			<Link
				href={href}
				className={cn(
					'font-bold justify-items-start ',
					pathname === href ? 'text-foreground' : 'text-primary'
				)}
			>
				{children}
				<span className='hidden lg:inline'>{title}</span>
			</Link>
		</Button>
	)
}

export default MenuButton
