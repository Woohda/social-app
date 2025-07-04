import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import { CommentsPage, getCommentDataInclude } from '@/lib/types'
import { NextRequest } from 'next/server'

/**
 * Обработчик GET-запроса для получения информации o комментариях к посту.
 * Этот обработчик выполняет следующие действия:
 * 1. Проверяет, является ли пользователь авторизованным.
 * 2. Извлекает идентификатор поста из параметров запроса.
 * 3. Выполняет запрос к базе данных для получения информации o комментариях к посту.
 * 4. Возвращает JSON-ответ с информацией о комментариях.
 *
 * Обработчик POST-запроса для добавления комментария к посту.
 * Этот обработчик выполняет следующие действия:
 * 1. Проверяет, является ли пользователь авторизованным.
 * 2. Извлекает идентификатор поста из параметров запроса.
 * 3. Выполняет запрос к базе данных для добавления комментария к посту.
 * 4. Возвращает JSON-ответ с информацией о комментариях.
 *
 * Обработчик DELETE-запроса для удаления комментария поста.
 * Этот обработчик выполняет следующие действия:
 * 1. Проверяет, является ли пользователь авторизованным.
 * 2. Извлекает идентификатор поста из параметров запроса.
 * 3. Выполняет запрос к базе данных для удаления комментария поста.
 * 4. Возвращает JSON-ответ с информацией о комментариях.
 *
 * @param {NextRequest} req - Объект запроса, содержащий информацию о запросе.
 * @returns {Response} JSON-ответ с комментариями или ошибкой.
 * @throws {Error} Если возникает ошибка при выполнении запроса к базе данных.
 * @throws {Response} Если пользователь не авторизован, возвращается ошибка 401.
 * @throws {Response} Если возникает ошибка при выполнении запроса к базе данных, возвращается ошибка 500.
 */

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ postId: string }> }
) {
	try {
		const cursor = req.nextUrl.searchParams.get('cursor') || undefined

		const pageSize = 5

		const postId = (await params).postId

		const { user: loggedInUser } = await validateRequest()
		if (!loggedInUser) {
			return Response.json(
				{ error: 'Пользователь не авторизован' },
				{ status: 401 }
			)
		}

		const comments = await prisma.comment.findMany({
			where: { postId },
			include: getCommentDataInclude(loggedInUser.id),
			orderBy: { createdAt: 'asc' },
			take: -pageSize - 1,
			cursor: cursor ? { id: cursor } : undefined
		})

		const prevCursor = comments.length > pageSize ? comments[0].id : null

		const data: CommentsPage = {
			comments: comments.length > pageSize ? comments.slice(1) : comments,
			prevCursor
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

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ postId: string }> }
) {
	try {
		const postId = (await params).postId

		const { user: loggedInUser } = await validateRequest()
		if (!loggedInUser) {
			return Response.json(
				{ error: 'Пользователь не авторизован' },
				{ status: 401 }
			)
		}

		await prisma.bookmark.upsert({
			where: {
				userId_postId: {
					userId: loggedInUser.id,
					postId
				}
			},
			create: {
				userId: loggedInUser.id,
				postId
			},
			update: {}
		})
		return new Response()
	} catch (error) {
		console.error(error)
		return Response.json(
			{ error: 'Внутренняя ошибка сервера' },
			{ status: 500 }
		)
	}
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ postId: string }> }
) {
	try {
		const postId = (await params).postId

		const { user: loggedInUser } = await validateRequest()
		if (!loggedInUser) {
			return Response.json(
				{ error: 'Пользователь не авторизован' },
				{ status: 401 }
			)
		}

		await prisma.bookmark.deleteMany({
			where: {
				userId: loggedInUser.id,
				postId
			}
		})
		return new Response()
	} catch (error) {
		console.error(error)
		return Response.json(
			{ error: 'Внутренняя ошибка сервера' },
			{ status: 500 }
		)
	}
}
