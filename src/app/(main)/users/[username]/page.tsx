import { validateRequest } from '@/auth'
import UserProfile from '@/components/UserProfile'
import prisma from '@/lib/prisma'
import { getUserDataSelect } from '@/lib/types'
import TrendsSidebar from '@/widgets/TrendsSidebar'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

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
