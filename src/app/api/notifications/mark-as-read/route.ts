import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'

/**
 * Обработчик PATCH-запроса для отметки всех уведомлений как прочитанных.
 * Этот обработчик выполняет следующие действия:
 * 1. Проверяет авторизацию пользователя.
 * 2. Обновляет все непрочитанные уведомления текущего пользователя, устанавливая их статус как прочитанные.
 * 3. Возвращает пустой ответ при успешном выполнении запроса.
 */

export async function PATCH() {
	try {
		const { user } = await validateRequest()
		if (!user) {
			return Response.json(
				{ error: 'Пользователь не авторизован' },
				{ status: 401 }
			)
		}

		await prisma.notification.updateMany({
			where: {
				recipientId: user.id,
				read: false
			},
			data: {
				read: true
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
