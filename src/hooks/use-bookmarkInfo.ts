import kyInstance from '@/lib/ky'
import { BookmarkInfo } from '@/lib/types'
import {
	useQuery,
	useMutation,
	QueryKey,
	useQueryClient
} from '@tanstack/react-query'
import { useToast } from './use-toast'

/**
 * Кастомный хук useBookmarkInfo используется для получения информации о том что пост в закладках
 * и обновления кэша react-query при изменении информации о закладках
 * @property {useQuery} - хук useQuery, который используется для получения информации о том что пост в закладках
 * @property {useMutation} - хук useMutation, который используется для обновления информации о том что пост в закладках
 * и обновления кэша react-query
 * @property {useToast} - пользовательский хук useToast, который используется для отображения уведомления
 * @returns {object} Объект с состоянием информации о лайках поста и функциями для ее обновления и обновления кэша react-query
 * @property {boolean} isBookmarkedByUser - Признак, указывающий, что пользователь добавил пост в закладки
 *
 */

export function useBookmarkInfo(postId: string, initialState: BookmarkInfo) {
	const { toast } = useToast()

	const query = useQueryClient()

	const queryKey: QueryKey = ['bookmark-info', postId]

	const queryData = useQuery<BookmarkInfo>({
		queryKey: ['bookmark-info', postId],
		queryFn: () =>
			kyInstance.get(`api/posts/${postId}/bookmarks`).json<BookmarkInfo>(),
		initialData: initialState,
		staleTime: Infinity
	})

	const { mutate } = useMutation({
		mutationFn: () =>
			queryData.data.isBookmarkedByUser
				? kyInstance.delete(`/api/posts/${postId}/bookmarks`)
				: kyInstance.post(`/api/posts/${postId}/bookmarks`),
		onMutate: async () => {
			await query.cancelQueries({ queryKey })
			const prevState = query.getQueryData<BookmarkInfo>(queryKey)
			query.setQueryData<BookmarkInfo>(queryKey, () => {
				return {
					isBookmarkedByUser: !prevState?.isBookmarkedByUser
				}
			})
			return { prevState }
		},
		onError: (error, variables, context) => {
			query.setQueryData<BookmarkInfo>(queryKey, context?.prevState)
			console.log(error)
			toast({
				description: 'Что-то пошло не так. Попробуйте позже.',
				variant: 'destructive'
			})
		},
		onSuccess: () => {
			toast({
				description: queryData.data.isBookmarkedByUser
					? 'Вы добавили пост в закладки'
					: 'Вы удалили пост из закладок'
			})
		}
	})

	return { ...queryData, mutate }
}
