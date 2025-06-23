import { Prisma } from '@prisma/client'

/**
 * Типы для данных пользователя и поста
 * Используются для типизации данных, получаемых из базы данных.
 * Эти типы помогают избежать ошибок при работе с данными и обеспечивают
 * лучшую поддержку автозаполнения в редакторах кода.
 * Они также помогают поддерживать согласованность типов в приложении.
 * @property {userDataSelect} userDataSelect - Выбор данных пользователя удовлетворяющий типу Prisma.UserSelect
 * @property {postDataInclude} postDataInclude - Включение данных поста удовлетворяющий типу Prisma.PostInclude
 * @type {PostData} PostData - Данные поста с включением данных пользователя удовлетворяющий типу Prisma.PostGetPayload
 * @property {PostPage} PostPage - Страница постов с массивом постов и курсором для пагинации
 */

export const userDataSelect = {
	id: true,
	username: true,
	name: true,
	avatarUrl: true
} satisfies Prisma.UserSelect

export const postDataInclude = {
	user: {
		select: {
			id: true,
			username: true,
			name: true,
			avatarUrl: true
		}
	}
} satisfies Prisma.PostInclude

export type PostData = Prisma.PostGetPayload<{
	include: typeof postDataInclude
}>

export interface PostsPage {
	posts: PostData[]
	nextCursor: string | null
}
