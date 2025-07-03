import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import { BookmarkInfo } from '@/lib/types'
import { NextRequest } from 'next/server'

/**
 * Обработчик GET-запроса для получения информации o добавлен ли пост в закладки.
 * Этот обработчик выполняет следующие действия:
 * 1. Проверяет, является ли пользователь авторизованным.
 * 2. Извлекает идентификатор поста из параметров запроса.
 * 3. Выполняет запрос к базе данных для получения информации o добавлен ли пост в закладки.
 * 4. Возвращает JSON-ответ с информацией о лайках поста.
 *
 * Обработчик POST-запроса для добавления поста в закладки.
 * Этот обработчик выполняет следующие действия:
 * 1. Проверяет, является ли пользователь авторизованным.
 * 2. Извлекает идентификатор поста из параметров запроса.
 * 3. Выполняет запрос к базе данных для добавления поста в закладки.
 * 4. Возвращает JSON-ответ с информацией о лайках поста.
 *
 * Обработчик DELETE-запроса для удаления поста из закладок.
 * Этот обработчик выполняет следующие действия:
 * 1. Проверяет, является ли пользователь авторизованным.
 * 2. Извлекает идентификатор поста из параметров запроса.
 * 3. Выполняет запрос к базе данных для удаления поста из закладок.
 * 4. Возвращает JSON-ответ с информацией о лайках поста.
 *
 * @param {NextRequest} req - Объект запроса, содержащий информацию о запросе.
 * @returns {Response} JSON-ответ с постами или ошибкой.
 * @throws {Error} Если возникает ошибка при выполнении запроса к базе данных.
 * @throws {Response} Если пользователь не авторизован, возвращается ошибка 401.
 * @throws {Response} Если возникает ошибка при выполнении запроса к базе данных, возвращается ошибка 500.
 */

export async function GET(
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

		const bookmark = await prisma.bookmark.findUnique({
			where: {
				userId_postId: {
					userId: loggedInUser.id,
					postId
				}
			}
		})

		const data: BookmarkInfo = {
			isBookmarkedByUser: !!bookmark
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
