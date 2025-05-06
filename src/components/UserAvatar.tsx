'use client'

import Image from 'next/image'
import avatarPlaseholder from '@/assets/avatar-placeholder.png'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
	avatarUrl: string | null | undefined
	className?: string
	size?: number
}

const UserAvatar = ({ avatarUrl, size, className }: UserAvatarProps) => {
	return (
		<Image
			src={avatarUrl || avatarPlaseholder}
			alt='User avatar'
			width={size ?? 48}
			height={size ?? 48}
			className={cn(
				'aspect-auto h-fit flex-none rounded-full bg-secondary object-cover',
				className
			)}
		/>
	)
}

export default UserAvatar
