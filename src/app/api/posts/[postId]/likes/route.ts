import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import { LikeInfo } from '@/lib/types'
import { NextRequest } from 'next/server'

/**
 * Обработчик GET-запроса для получения информации о лайках поста.
 * Этот обработчик выполняет следующие действия:
 * 1. Проверяет, является ли пользователь авторизованным.
 * 2. Извлекает идентификатор поста из параметров запроса.
 * 3. Выполняет запрос к базе данных для получения информации о лайках поста.
 * 4. Возвращает JSON-ответ с информацией о лайках поста.
 *
 * Обработчик POST-запроса для добавления лайка к посту.
 * Этот обработчик выполняет следующие действия:
 * 1. Проверяет, является ли пользователь авторизованным.
 * 2. Извлекает идентификатор поста из параметров запроса.
 * 3. Выполняет запрос к базе данных для добавления лайка к посту.
 * 4. Возвращает JSON-ответ с информацией о лайках поста.
 *
 * Обработчик DELETE-запроса для удаления лайка с поста.
 * Этот обработчик выполняет следующие действия:
 * 1. Проверяет, является ли пользователь авторизованным.
 * 2. Извлекает идентификатор поста из параметров запроса.
 * 3. Выполняет запрос к базе данных для удаления лайка с поста.
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

		const post = await prisma.post.findUnique({
			where: {
				id: postId
			},
			select: {
				likes: {
					where: {
						userId: loggedInUser.id
					},
					select: {
						userId: true
					}
				},
				_count: {
					select: {
						likes: true
					}
				}
			}
		})

		if (!post) {
			return Response.json({ error: 'Пост не найден' }, { status: 404 })
		}

		const data: LikeInfo = {
			likes: post._count.likes,
			isLikedByUser: post.likes.length > 0
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

		const post = await prisma.post.findUnique({
			where: { id: postId },
			select: {
				userId: true
			}
		})

		if (!post) {
			return Response.json({ error: 'Пост не найден' }, { status: 404 })
		}

		await prisma.$transaction([
			prisma.like.upsert({
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
			}),
			...(loggedInUser.id !== post.userId
				? [
						prisma.notification.create({
							data: {
								issuerId: loggedInUser.id,
								recipientId: post.userId,
								postId,
								type: 'LIKE'
							}
						})
					]
				: [])
		])

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

		const post = await prisma.post.findUnique({
			where: { id: postId },
			select: {
				userId: true
			}
		})

		if (!post) {
			return Response.json({ error: 'Пост не найден' }, { status: 404 })
		}

		await prisma.$transaction([
			prisma.like.deleteMany({
				where: {
					userId: loggedInUser.id,
					postId
				}
			}),
			prisma.notification.deleteMany({
				where: {
					issuerId: loggedInUser.id,
					recipientId: post.userId,
					postId,
					type: 'LIKE'
				}
			})
		])

		return new Response()
	} catch (error) {
		console.error(error)
		return Response.json(
			{ error: 'Внутренняя ошибка сервера' },
			{ status: 500 }
		)
	}
}
