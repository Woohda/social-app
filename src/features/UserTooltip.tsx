'use client'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/components/ui/tooltip'
import UserAvatar from '@/components/user/UserAvatar'
import useSession from '@/hooks/use-session'
import { FollowerInfo, UserData } from '@/lib/types'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import Link from 'next/link'
import { PropsWithChildren } from 'react'
import FollowButton from './FollowButton'
import FollowerCount from '@/components/FollowerCount'

interface UserTooltipProps extends PropsWithChildren {
	user: UserData
}
const UserTooltip = ({ user, children }: UserTooltipProps) => {
	const { user: loggedInUser } = useSession()

	const followerState: FollowerInfo = {
		followers: user._count.followers,
		isFollowedByUser: user.followers.some(
			({ followerId }) => followerId === loggedInUser?.id
		)
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent className='max-w-100 flex flex-col gap-3 break-words px-1 py-2.5 md:min-w-48 bg-card border border-primary shadow-md'>
					<div className='flex items-center gap-3'>
						<Link href={`/users/${user.username}`}>
							<UserAvatar avatarUrl={user.avatarUrl} size={60} />
						</Link>
						<div className='flex flex-col items-start'>
							<Link href={`/users/${user.username}`}>
								<p className='text-lg font-medium text-primary hover:underline'>
									{user.name}
								</p>
								<p className='text-sm text-muted-foreground'>
									@{user.username}
								</p>
								<p className='text-xs text-muted-foreground'>
									<FollowerCount
										userId={user.id}
										initialState={followerState}
									/>
								</p>
							</Link>
						</div>
					</div>
					{loggedInUser?.id !== user.id && (
						<FollowButton userId={user.id} initialState={followerState} />
					)}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

export default UserTooltip
