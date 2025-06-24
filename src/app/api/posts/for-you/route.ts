import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import { getPostDataInclude, PostsPage } from '@/lib/types'
import { NextRequest } from 'next/server'

/**
 * Обработчик GET-запроса для получения постов, рекомендованных для текущего пользователя.
 * Этот обработчик выполняет следующие действия:
 * 1. Проверяет авторизацию пользователя.
 * 2. Извлекает параметр `cursor` из URL для постраничной навигации.
 * 3. Получает список постов, рекомендованных для текущего пользователя.
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
		const posts = await prisma.post.findMany({
			include: getPostDataInclude(user.id),
			orderBy: {
				createdAt: 'desc'
			},
			take: pageSize + 1,
			cursor: cursor ? { id: cursor } : undefined
		})

		const nextCursor = posts.length > pageSize ? posts[pageSize].id : null

		const data: PostsPage = {
			posts: posts.slice(0, pageSize),
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
