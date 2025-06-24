import { validateRequest } from '@/auth'
// import UserProfile from '@/components/UserProfile'
import prisma from '@/lib/prisma'
import { getUserDataSelect } from '@/lib/types'
import TrendsSidebar from '@/widgets/TrendsSidebar'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

import { FollowerInfo, UserData } from '@/lib/types'
import UserAvatar from '@/components/UserAvatar'
import { formatNumber, formatRelativeDate } from '@/lib/utils'
import FollowButton from '@/features/FollowButton'

interface PageProps {
	params: Promise<{
		username: string
	}>
}

const getUser = cache(async (username: string, loggedInUserId: string) => {
	const user = await prisma.user.findFirst({
		where: {
			username: {
				equals: username,
				mode: 'insensitive'
			}
		},
		select: getUserDataSelect(loggedInUserId)
	})
	if (!user) notFound()
	return user
})

export async function generateMetadata({
	params: promise
}: PageProps): Promise<Metadata> {
	const usernameValue = (await promise).username
	const { user: loggedInUser } = await validateRequest()

	if (!loggedInUser) return {}

	const user = await getUser(usernameValue, loggedInUser.id)
	return {
		title: `${user.name} (@${user.username})`,
		description: `Профиль пользователя ${user.name} с никнеймом @${user.username}. Здесь вы можете найти информацию о пользователе, его твиты и подписчиков.`,
		openGraph: {
			title: `${user.name} (@${user.username})`,
			description: `Профиль пользователя ${user.name} с никнеймом @${user.username}. Здесь вы можете найти информацию о пользователе, его твиты и подписчиков.`,
			url: `/users/${user.username}`,
			images: user.avatarUrl ? [user.avatarUrl] : []
		}
	}
}

export default async function Page({ params: promise }: PageProps) {
	const usernameValue = (await promise).username
	const { user: loggedInUser } = await validateRequest()
	if (!loggedInUser) {
		return (
			<p className='text-destructive'>
				Пожалуйста, войдите в систему, чтобы просмотреть профиль пользователя.
			</p>
		)
	}

	const user = await getUser(usernameValue, loggedInUser.id)

	return (
		<main className='w-full min-w-0 flex gap-5'>
			<div className='w-full flex flex-col gap-5'>
				<UserProfile user={user} loggedInUserId={loggedInUser.id} />
			</div>
			<TrendsSidebar />
		</main>
	)
}
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
					<span className='text-sm'>
						Подписчиков: <span className='font-semibold text-base'></span>
					</span>
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
