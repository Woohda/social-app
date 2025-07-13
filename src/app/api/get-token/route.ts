import { validateRequest } from '@/auth'
import { streamServerClient } from '@/lib/stream'

/**
 * Обработчик GET-запроса для получения токена пользователя.
 * Этот обработчик выполняет следующие действия:
 * 1. Проверяет авторизацию пользователя.
 * 2. Создает токен для пользователя с истечением через 60 минут.
 * 3. Возвращает токен в формате JSON.
 * 4. Обрабатывает ошибки и возвращает соответствующий статус и сообщение.
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

		const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60 // Текущее время в секундах плюс 60 минут
		const issuedAt = Math.floor(Date.now() / 1000) - 60 // Текущее время в секундах минус 60 секунд

		const token = streamServerClient.createToken(
			user.id,
			expirationTime,
			issuedAt
		)

		return Response.json({ token })
	} catch (error) {
		console.error(error)
		return Response.json(
			{ error: 'Внутренняя ошибка сервера' },
			{ status: 500 }
		)
	}
}
