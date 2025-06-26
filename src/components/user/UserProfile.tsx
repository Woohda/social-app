import { FollowerInfo, UserData } from '@/lib/types'
import UserAvatar from './UserAvatar'
import { formatNumber, formatRelativeDate } from '@/lib/utils'
import FollowButton from '@/components/button/FollowButton'
import FollowerCount from '../FollowerCount'
import EditProfileButton from '../button/EditProfileButton'

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
				<div className='flex flex-col items-start gap-1'>
					<h2 className='text-2xl font-bold'>{user.name}</h2>
					<p className='text-sm text-muted-foreground'>@{user.username}</p>
					<p className='text-sm'>
						<FollowerCount userId={user.id} initialState={followerInfo} />
					</p>
					{user.bio && <p className='text-sm mt-3'>user.bio</p>}
				</div>
			</div>
			<div className='w-full flex items-center justify-between'>
				<div className='flex flex-col items-start'>
					<p className='text-sm '>
						Аккаунт создан: {formatRelativeDate(user.createdAt)}
					</p>
					<span className='text-sm'>
						Постов:{' '}
						<span className='font-semibold'>
							{formatNumber(user._count.posts)}
						</span>
					</span>
				</div>
				{user.id === loggedInUserId ? (
					<EditProfileButton user={user} />
				) : (
					<FollowButton userId={user.id} initialState={followerInfo} />
				)}
			</div>
		</div>
	)
}

export default UserProfile
