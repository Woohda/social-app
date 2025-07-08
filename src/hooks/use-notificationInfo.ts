import kyInstance from '@/lib/ky'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * Кастомный хук useNotificationInfo используется для получения информации о отметке уведомлений как прочитанных
 * и обновления кэша react-query при изменении информации о уведомлениях
 * @property {useQueryClient} - хук useQueryClient, который используется для получения и обновления кэша react-query
 * @property {useMutation} - хук useMutation, который используется для обновления информации о отметке уведомлений как прочитанных
 * и обновления кэша react-query
 * @returns {object} Объект с состоянием информации о отметке уведомлений как прочитанных и функциями для ее обновления и обновления кэша react-query
 *
 */

export function useNotificationInfo() {
	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationFn: () => kyInstance.patch('/api/notifications/mark-as-read'),
		onSuccess: () => {
			queryClient.setQueryData(['unread-notification-count'], {
				unreadCount: 0
			})
		},
		onError: error => {
			console.error('Ошибка при отметке уведомления как прочитанное', error)
		}
	})

	return mutate
}
