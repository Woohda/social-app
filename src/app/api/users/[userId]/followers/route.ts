import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import { FollowerInfo } from '@/lib/types'
import { NextRequest } from 'next/server'

/**
 * Этот обработчик GET-запроса для получения информации о подписчиках пользователя.
 * Он использует функцию validateRequest для проверки авторизации пользователя.
 * Если пользователь не авторизован, возвращается ошибка 401.
 * Если пользователь авторизован, выполняется запрос к базе данных для получения информации о подписчиках.
 * @param {Request} req - HTTP-запрос.
 * @param {string} params.userId - Идентификатор пользователя, для которого нужно получить информацию о подписчиках.
 * * @returns {Response} JSON-ответ с информацией о подписчиках или ошибкой.
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

		await prisma.follow.upsert({
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

		await prisma.follow.deleteMany({
			where: {
				followerId: loggedInUser.id,
				followingId: userId
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
