import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import { postDataInclude } from '@/lib/types'

/**
 * Этот обработчик GET-запроса для получения постов для пользователя.
 * Он использует функцию validateRequest для проверки авторизации пользователя.
 * Если пользователь не авторизован, возвращается ошибка 401.
 * Если пользователь авторизован, выполняется запрос к базе данных для получения постов,
 * @returns {Response} JSON-ответ с постами или ошибкой.
 * @throws {Error} Если возникает ошибка при выполнении запроса к базе данных.
 * @throws {Response} Если пользователь не авторизован, возвращается ошибка 401.
 * @throws {Response} Если возникает ошибка при выполнении запроса к базе данных, возвращается ошибка 500.
 */

export async function GET() {
	try {
		const { user } = await validateRequest()
		if (!user) {
			return Response.json(
				{ error: 'Пользователь не авторизован' },
				{ status: 401 }
			)
		}
		const posts = await prisma.post.findMany({
			include: postDataInclude,
			orderBy: {
				createdAt: 'desc'
			}
		})
		return Response.json(posts)
	} catch (error) {
		console.error(error)
		return Response.json(
			{ error: 'Внутренняя ошибка сервера' },
			{ status: 500 }
		)
	}
}
