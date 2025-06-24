import kyInstance from '@/lib/ky'
import { FollowerInfo } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'

/**
 * Кастомный хук useFollowerInfo используется для получения информации о подписчиках пользователя.
 * Он использует react-query для управления состоянием запроса и кэширования данных.
 * @param {string} userId - Идентификатор пользователя, для которого нужно получить информацию о подписчиках.
 * @param {FollowerInfo} initialState - Начальное состояние для запроса, используется при первом рендере.
 * @returns {QueryObserverResult<FollowerInfo>} - Результат запроса, содержащий данные о подписчиках и состояние запроса.
 */

export function useFollowerInfo(userId: string, initialState: FollowerInfo) {
	const query = useQuery<FollowerInfo>({
		queryKey: ['follower-info', userId],
		queryFn: () =>
			kyInstance.get(`api/users/${userId}/followers`).json<FollowerInfo>(),
		initialData: initialState,
		staleTime: Infinity
	})
	return query
}
