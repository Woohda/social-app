import { validateRequest } from '@/auth'
import FollowButton from '@/components/button/FollowButton'
import UserAvatar from '@/components/user/UserAvatar'
import Linkify from '@/features/Linkify'
import { UserData } from '@/lib/types'
import Link from 'next/link'

interface UserInfoSidebarProps {
	user: UserData
}

const UserInfoSidebar = async ({ user }: UserInfoSidebarProps) => {
	const { user: loggedInUser } = await validateRequest()

	if (!loggedInUser) return null

	return (
		<div className='flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm'>
			<h2 className='text-lg font-bold'>Информация о пользователе:</h2>
			<Link
				href={`/users/${user.username}`}
				className='flex items-center gap-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
			>
				<UserAvatar avatarUrl={user.avatarUrl} className='flex-none' />
				<div>
					<p className='line-clamp-1 break-all text-base font-semibold hover:underline text-primary'>
						{user.name}
					</p>
					<p className='text-sm text-muted-foreground'>@{user.username}</p>
				</div>
			</Link>
			<Linkify>
				<p className='line-clamp-6 break-words whitespace-pre-line text-sm text-muted-foreground'>
					{user.bio}
				</p>
			</Linkify>
			{user.id !== loggedInUser.id && (
				<FollowButton
					userId={user.id}
					initialState={{
						followers: user._count.followers,
						isFollowedByUser: user.followers.some(
							({ followerId }) => followerId === loggedInUser.id
						)
					}}
				/>
			)}
		</div>
	)
}

export default UserInfoSidebar
