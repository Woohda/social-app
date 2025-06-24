import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import { getPostDataInclude, PostsPage } from '@/lib/types'
import { NextRequest } from 'next/server'

/**
 * Этот обработчик GET-запроса для получения постов пользователя.
 * Он использует функцию validateRequest для проверки авторизации пользователя.
 * Если пользователь не авторизован, возвращается ошибка 401.
 * Если пользователь авторизован, выполняется запрос к базе данных для получения постов.
 * @param {NextRequest} req - HTTP-запрос.
 * @param {Promise<{ userId: string }>} params.params - Промис, который разрешается в объект с идентификатором пользователя.
 * @returns {Response} JSON-ответ с постами пользователя или ошибкой.
 * @throws {Response} Если пользователь не авторизован, возвращается ошибка 401.
 * @throws {Response} Если возникает ошибка при выполнении запроса к базе данных, возвращается ошибка 500.
 */

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ userId: string }> }
) {
	try {
		const cursor = req.nextUrl.searchParams.get('cursor') || undefined

		const pageSize = 10

		const userId = (await params).userId

		const { user } = await validateRequest()
		if (!user) {
			return Response.json(
				{ error: 'Пользователь не авторизован' },
				{ status: 401 }
			)
		}
		const posts = await prisma.post.findMany({
			where: {
				userId
			},
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
