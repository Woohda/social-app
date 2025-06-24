import { FollowerInfo, UserData } from '@/lib/types'
import UserAvatar from './UserAvatar'
import { formatNumber, formatRelativeDate } from '@/lib/utils'
import FollowButton from '@/features/FollowButton'
import FollowerCount from './FollowerCount'

interface UserProfileProps {
	user: UserData
	loggedInUserId: string
}

const UserProfile = ({ user, loggedInUserId }: UserProfileProps) => {
	const followerInfo: FollowerInfo = {
		followers: user._count.followers,
		isFollowedByUser: user.followers.some(
			({ followerId }) => followerId === loggedInUserId
		)
	}
	return (
		<div className='flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm'>
			<div className='flex flex-wrap items-center gap-5'>
				<UserAvatar avatarUrl={user.avatarUrl} size={150} />
				<div>
					<h2 className='text-2xl font-bold'>{user.name}</h2>
					<p className='text-sm text-muted-foreground'>@{user.username}</p>
					<p className='text-sm mt-3'>{user.bio || ''}</p>
					<p className='text-sm text-muted-foreground'>
						Аккаунт создан: {formatRelativeDate(user.createdAt)}
					</p>
				</div>
			</div>
			<div className='w-full flex items-center justify-between'>
				<div className='flex items-center gap-3'>
					<span className='text-sm'>
						Постов:{' '}
						<span className='font-semibold text-base'>
							{formatNumber(user._count.posts)}
						</span>
					</span>
					<FollowerCount userId={user.id} initialState={followerInfo} />
				</div>
				{user.id === loggedInUserId ? (
					<span className='text-sm text-muted-foreground'>Это вы</span>
				) : (
					<FollowButton userId={user.id} initialState={followerInfo} />
				)}
			</div>
		</div>
	)
}

export default UserProfile
