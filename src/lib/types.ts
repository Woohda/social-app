import { Prisma } from '@prisma/client'

/**
 * Модуль содержит типы и функции для работы с данными пользователя и постов.
 * Он предоставляет функции для получения селекта данных пользователя и включения данных поста,
 * а также типы для данных пользователя и поста.
 *
 * @function getUserDataSelect - Функция для получения селекта данных пользователя
 * @function getPostDataInclude - Функция для получения включения данных поста
 * @type {UserData} - Тип данных пользователя с включением информации о пользователе и его постах
 * и подписчиках соответствует Prisma.UserSelect
 * @type {PostData} - Тип данных поста с включением информации о пользователе,
 * который создал пост, соответствует Prisma.PostInclude
 * @interface {PostsPage} - Интерфейс для страницы постов, содержащий массив постов и курсор для пагинации
 * @interface {FollowerInfo} - Интерфейс для информации о подписчиках, содержащий количество подписчиков
 * и информацию о том, подписан ли текущий пользователь на данного пользователя
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
		},
		attachments: true
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
