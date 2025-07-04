import kyInstance from '@/lib/ky'
import { LikeInfo } from '@/lib/types'
import {
	useQuery,
	useMutation,
	QueryKey,
	useQueryClient
} from '@tanstack/react-query'
import { useToast } from './use-toast'

/**
 * Кастомный хук useLikesInfo используется для получения информации о лайках поста
 * и обновления кэша react-query при изменении информации о лайках
 * @property {useQuery} - хук useQuery, который используется для получения информации о лайках поста
 * @property {useMutation} - хук useMutation, который используется для обновления информации о лайках поста
 * и обновления кэша react-query
 * @property {useToast} - пользовательский хук useToast, который используется для отображения уведомления
 * @returns {object} Объект с состоянием информации о лайках поста и функциями для ее обновления и обновления кэша react-query
 * @property {boolean} isLikedByUser - Признак, указывающий, что пользователь лайкнул пост
 * @property {number} likes - Количество лайков
 *
 */

export function useLikeInfo(postId: string, initialState: LikeInfo) {
	const { toast } = useToast()

	const query = useQueryClient()

	const queryKey: QueryKey = ['like-info', postId]

	const queryData = useQuery<LikeInfo>({
		queryKey: ['like-info', postId],
		queryFn: () => kyInstance.get(`api/posts/${postId}/likes`).json<LikeInfo>(),
		initialData: initialState,
		staleTime: Infinity
	})

	const { mutate } = useMutation({
		mutationFn: () =>
			queryData.data.isLikedByUser
				? kyInstance.delete(`/api/posts/${postId}/likes`)
				: kyInstance.post(`/api/posts/${postId}/likes`),
		onMutate: async () => {
			await query.cancelQueries({ queryKey })
			const prevState = query.getQueryData<LikeInfo>(queryKey)
			query.setQueryData<LikeInfo>(queryKey, () => {
				return {
					likes: (prevState?.likes || 0) + (prevState?.isLikedByUser ? -1 : 1),
					isLikedByUser: !prevState?.isLikedByUser
				}
			})
			return { prevState }
		},
		onError: (error, variables, context) => {
			query.setQueryData<LikeInfo>(queryKey, context?.prevState)
			console.log(error)
			toast({
				description: 'Что-то пошло не так. Попробуйте позже.',
				variant: 'destructive'
			})
		}
	})

	return { ...queryData, mutate }
}
