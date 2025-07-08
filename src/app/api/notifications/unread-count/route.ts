import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import { NotificationCountType } from '@/lib/types'

/**
 * Обработчик GET-запроса для получения количества непрочитанных уведомлений.
 * Этот обработчик выполняет следующие действия:
 * 1. Проверяет авторизацию пользователя.
 * 2. Получает количество непрочитанных уведомлений для текущего пользователя.
 * 3. Возвращает JSON-ответ с количеством непрочитанных уведомлений.
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

		const unreadCount = await prisma.notification.count({
			where: {
				recipientId: user.id,
				read: false
			}
		})

		const data: NotificationCountType = {
			unreadCount
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
