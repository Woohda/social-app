import kyInstance from '@/lib/ky'
import { FollowerInfo } from '@/lib/types'
import {
	useQuery,
	useMutation,
	QueryKey,
	useQueryClient
} from '@tanstack/react-query'
import { useToast } from './use-toast'

/**
 * Кастомный хук useFollowerInfo используется для получения информации о подписке пользователя
 * и обновления кэша react-query при изменении информации о подписке
 * @property {useQuery} - хук useQuery, который используется для получения информации о подписке пользователя
 * @property {useMutation} - хук useMutation, который используется для обновления информации о подписке пользователя
 * и обновления кэша react-query
 * @property {useToast} - пользовательский хук useToast, который используется для отображения уведомления
 * @returns {object} Объект с состоянием информации о подписке пользователя и функциями для ее обновления
 * и обновления кэша react-query
 * @property {boolean} isFollowedByUser - Признак, указывающий, что пользователь подписан на другого пользователя
 * @property {number} followers - Количество подписчиков
 *
 */

export function useFollowerInfo(userId: string, initialState: FollowerInfo) {
	const { toast } = useToast()

	const queryKey: QueryKey = ['follower-info', userId]

	const query = useQueryClient()

	const queryData = useQuery<FollowerInfo>({
		queryKey: ['follower-info', userId],
		queryFn: () =>
			kyInstance.get(`api/users/${userId}/followers`).json<FollowerInfo>(),
		initialData: initialState,
		staleTime: Infinity
	})

	const { mutate } = useMutation({
		mutationFn: () =>
			queryData.data.isFollowedByUser
				? kyInstance.delete(`/api/users/${userId}/followers`)
				: kyInstance.post(`/api/users/${userId}/followers`),
		onMutate: async () => {
			await query.cancelQueries({ queryKey })
			const prevState = query.getQueryData<FollowerInfo>(queryKey)
			query.setQueryData<FollowerInfo>(queryKey, () => {
				return {
					followers:
						(prevState?.followers || 0) +
						(prevState?.isFollowedByUser ? -1 : 1),
					isFollowedByUser: !prevState?.isFollowedByUser
				}
			})
			return { prevState }
		},
		onError: (error, variables, context) => {
			query.setQueryData<FollowerInfo>(queryKey, context?.prevState)
			toast({
				description:
					error instanceof Error
						? error.message
						: 'Что-то пошло не так. Попробуйте позже.',
				variant: 'destructive'
			})
		},
		onSuccess() {
			toast({
				description: queryData.data.isFollowedByUser
					? 'Вы подписались на пользователя'
					: 'Вы отписались от пользователя'
			})
		}
	})

	return { ...queryData, mutate }
}
