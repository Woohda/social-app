'use client'

import useSession from '@/hooks/use-session'
import { DropdownMenu, DropdownMenuTrigger } from './ui/dropdown-menu'
import UserAvatar from './UserAvatar'

interface UserButtonProps {
	className?: string
}

const UserButton = ({ className }: UserButtonProps) => {
	const { user } = useSession()
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className={className}>
					<UserAvatar avatarUrl={user?.avatar} size={40} />
				</button>
			</DropdownMenuTrigger>
		</DropdownMenu>
	)
}

export default UserButton
