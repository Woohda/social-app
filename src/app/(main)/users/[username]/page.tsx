import { validateRequest } from '@/auth'
import UserProfile from '@/components/user/UserProfile'
import prisma from '@/lib/prisma'
import { getUserDataSelect } from '@/lib/types'
import UserPostsFeed from '@/widgets/posts/UserPostsFeed'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'

interface PageProps {
	params: Promise<{
		username: string
	}>
}

// Функция для получения данных пользователя по имени пользователя
// Используется кэширование для оптимизации производительности
// и предотвращения повторных запросов к базе данных
// при повторном обращении к одному и тому же пользователю.
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

// Функция для генерации метаданных страницы профиля пользователя
// Используется для SEO-оптимизации и улучшения отображения в социальных сетях
// Возвращает заголовок, описание и Open Graph метаданные
// для страницы профиля пользователя.
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
			<p className='text-destructive bg-card p-5 rounded-lg'>
				Пожалуйста, войдите в систему, чтобы просмотреть профиль пользователя.
			</p>
		)
	}

	const user = await getUser(usernameValue, loggedInUser.id)

	return (
		<main className='w-full min-w-0 flex gap-5'>
			<div className='w-full flex flex-col gap-5'>
				<UserProfile user={user} loggedInUserId={loggedInUser.id} />
				<UserPostsFeed userId={user.id} />
			</div>
		</main>
	)
}
