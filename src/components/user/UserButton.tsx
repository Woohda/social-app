'use client'

import useSession from '@/hooks/use-session'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import UserAvatar from '@/components/user/UserAvatar'
import Link from 'next/link'
import { LogOutIcon, UserIcon } from 'lucide-react'
import { logout } from '@/app/(auth)/actions'
import { cn } from '@/lib/utils'
import { useQueryClient } from '@tanstack/react-query'

interface UserButtonProps {
	className?: string
}

const UserButton = ({ className }: UserButtonProps) => {
	const { user } = useSession()
	const queryClient = useQueryClient()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					className={cn(
						'flex-none border border-transparent rounded-full hover:border-primary transition-colors duration-200  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
						className
					)}
				>
					<UserAvatar avatarUrl={user?.avatarUrl} size={40} />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-48'>
				<DropdownMenuLabel className='flex items-center gap-2'>
					<UserAvatar avatarUrl={user?.avatarUrl} size={40} /> {user?.username}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<Link href={`/users/${user?.username}`}>
					<DropdownMenuItem>
						<UserIcon className='mr-2 size-4' />
						Мой профиль
					</DropdownMenuItem>
				</Link>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => {
						logout()
						queryClient.clear()
					}}
				>
					<LogOutIcon className='mr-2 size-4' />
					Выйти
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default UserButton
