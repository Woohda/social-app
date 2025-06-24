import { Prisma } from '@prisma/client'

/**
 * Типы для данных пользователя и поста
 * Используются для типизации данных, получаемых из базы данных.
 * Эти типы помогают избежать ошибок при работе с данными и обеспечивают
 * лучшую поддержку автозаполнения в редакторах кода.
 * Они также помогают поддерживать согласованность типов в приложении.
 * @function getUserDataSelect - Функция для получения селекта данных пользователя
 * @function getPostDataInclude - Функция для получения включения данных поста
 * @type {PostData} PostData - Данные поста с включением данных пользователя удовлетворяющий типу Prisma.PostGetPayload
 * @property {PostPage} PostPage - Страница постов с массивом постов и курсором для пагинации
 */

export function getUserDataSelect(loggedInUserId: string) {
	return {
		id: true,
		username: true,
		name: true,
		avatarUrl: true,
		bio: true,
		createdAt: true,
		followers: {
			where: {
				followerId: loggedInUserId
			},
			select: {
				followerId: true
			}
		},
		_count: {
			select: {
				posts: true,
				followers: true
			}
		}
	} satisfies Prisma.UserSelect
}

export type UserData = Prisma.UserGetPayload<{
	select: ReturnType<typeof getUserDataSelect>
}>

export function getPostDataInclude(loggedInUserId: string) {
	return {
		user: {
			select: getUserDataSelect(loggedInUserId)
		}
	} satisfies Prisma.PostInclude
}

export type PostData = Prisma.PostGetPayload<{
	include: ReturnType<typeof getPostDataInclude>
}>

export interface PostsPage {
	posts: PostData[]
	nextCursor: string | null
}

export interface FollowerInfo {
	followers: number
	isFollowedByUser: boolean
}
