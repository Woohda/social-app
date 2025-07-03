import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import { getPostDataInclude, PostsPage } from '@/lib/types'
import { NextRequest } from 'next/server'

/**
 * Обработчик GET-запроса для получения постов, находящихся в закладках пользователя.
 * Этот обработчик выполняет следующие действия:
 * 1. Проверяет авторизацию пользователя.
 * 2. Извлекает параметр `cursor` из URL для постраничной навигации.
 * 3. Получает список постов, находящихся в закладках пользователя.
 * 4. Возвращает JSON-ответ с постами и следующей позицией курсора для дальнейшей навигации.
 *
 * @param {NextRequest} req - Объект запроса, содержащий информацию о запросе.
 * @returns {Response} JSON-ответ с постами или ошибкой.
 * @throws {Error} Если возникает ошибка при выполнении запроса к базе данных.
 * @throws {Response} Если пользователь не авторизован, возвращается ошибка 401.
 * @throws {Response} Если возникает ошибка при выполнении запроса к базе данных, возвращается ошибка 500.
 */

export async function GET(req: NextRequest) {
	try {
		const cursor = req.nextUrl.searchParams.get('cursor') || undefined

		const pageSize = 10

		const { user } = await validateRequest()
		if (!user) {
			return Response.json(
				{ error: 'Пользователь не авторизован' },
				{ status: 401 }
			)
		}
		const bookmarks = await prisma.bookmark.findMany({
			where: {
				userId: user.id
			},
			include: {
				post: {
					include: getPostDataInclude(user.id)
				}
			},
			orderBy: {
				createdAt: 'desc'
			},
			take: pageSize + 1,
			cursor: cursor ? { id: cursor } : undefined
		})

		const nextCursor =
			bookmarks.length > pageSize ? bookmarks[pageSize].id : null

		const data: PostsPage = {
			posts: bookmarks.slice(0, pageSize).map(bookmark => bookmark.post),
			nextCursor
		}

		return Response.json(data)
	} catch (error) {
		console.error(error)
		return Response.json(
			{ error: 'Внутренняя ошибка сервера' },
			{ status: 500 }
		)
	}
}
