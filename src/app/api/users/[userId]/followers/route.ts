import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import { FollowerInfo } from '@/lib/types'
import { NextRequest } from 'next/server'

/**
 * Обработчик GET-запроса для получения информации о подписчиках пользователя.
 * Этот обработчик выполняет следующие действия:
 * 1. Проверяет авторизацию пользователя.
 * 2. Извлекает идентификатор пользователя из параметров запроса.
 * 3. Получает информацию о подписчиках указанного пользователя и проверяет, подписан ли текущий пользователь на него.
 * 4. Возвращает JSON-ответ с количеством подписчиков и информацией о том, подписан ли текущий пользователь на указанного пользователя.
 *
 * Обработчик POST-запроса предоставляет действие для подписки на пользователя.
 * Этот обработчик выполняет следующие действия:
 * 1. Принимает идентификатор пользователя из параметров запроса и идентификатор текущего пользователя из авторизации.
 * 2. Если подписка уже существует, она не создается повторно.
 * 3. Возвращает пустой ответ при успешном выполнении запроса.		

 * Обработчик DELETE-запроса предоставляет действие для отписки от пользователя.
 * Этот обработчик выполняет следующие действия:
 * 1. Принимает идентификатор пользователя из параметров запроса и идентификатор текущего пользователя из авторизации.
 * 2. Удаляет подписку, если она существует.
 * 3. Возвращает пустой ответ при успешном выполнении запроса.
 * 
 * @param {Request} req - HTTP-запрос.
 * @param {Promise<{ userId: string }>} params.params - Промис, который разрешается в объект с идентификатором пользователя.
 * @returns {Response} JSON-ответ с информацией о подписчиках или ошибкой.
 * @throws {Response} Если пользователь не авторизован, возвращается ошибка 401.
 * @throws {Response} Если пользователь не найден, возвращается ошибка 404.
 * @throws {Response} Если возникает ошибка при выполнении запроса к базе данных, возвращается ошибка 500.
 */

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ userId: string }> }
) {
	try {
		const userId = (await params).userId
		const { user: loggedInUser } = await validateRequest()

		if (!loggedInUser) {
			return Response.json(
				{ error: 'Пользователь не авторизован' },
				{ status: 401 }
			)
		}

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				followers: {
					where: {
						followerId: loggedInUser.id
					},
					select: {
						followerId: true
					}
				},
				_count: {
					select: {
						followers: true
					}
				}
			}
		})

		if (!user) {
			return Response.json({ error: 'Пользователь не найден' }, { status: 404 })
		}

		const data: FollowerInfo = {
			followers: user._count.followers,
			isFollowedByUser: user.followers.length > 0
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
	{ params }: { params: Promise<{ userId: string }> }
) {
	try {
		const userId = (await params).userId
		const { user: loggedInUser } = await validateRequest()

		if (!loggedInUser) {
			return Response.json(
				{ error: 'Пользователь не авторизован' },
				{ status: 401 }
			)
		}

		await prisma.$transaction([
			prisma.follow.upsert({
				where: {
					followerId_followingId: {
						followerId: loggedInUser.id,
						followingId: userId
					}
				},
				create: {
					followerId: loggedInUser.id,
					followingId: userId
				},
				update: {}
			}),
			prisma.notification.create({
				data: {
					issuerId: loggedInUser.id,
					recipientId: userId,
					type: 'FOLLOW'
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

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ userId: string }> }
) {
	try {
		const userId = (await params).userId
		const { user: loggedInUser } = await validateRequest()

		if (!loggedInUser) {
			return Response.json(
				{ error: 'Пользователь не авторизован' },
				{ status: 401 }
			)
		}

		await prisma.$transaction([
			prisma.follow.deleteMany({
				where: {
					followerId: loggedInUser.id,
					followingId: userId
				}
			}),
			prisma.notification.deleteMany({
				where: {
					issuerId: loggedInUser.id,
					recipientId: userId,
					type: 'FOLLOW'
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
