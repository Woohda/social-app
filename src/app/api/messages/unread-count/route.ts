import { validateRequest } from '@/auth'
import { streamServerClient } from '@/lib/stream'
import { MessageCountInfo } from '@/lib/types'

/**
 * Обработчик GET-запроса для получения количества непрочитанных сообщений.
 * Этот обработчик выполняет следующие действия:
 * 1. Проверяет авторизацию пользователя.
 * 2. Получает количество непрочитанных сообщений для текущего пользователя.
 * 3. Возвращает JSON-ответ с количеством непрочитанных сообщений.
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

		const { total_unread_count } = await streamServerClient.getUnreadCount(
			user.id
		)

		const data: MessageCountInfo = {
			unreadCount: total_unread_count
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
