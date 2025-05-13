import {
	InfiniteData,
	useMutation,
	useQueryClient
} from '@tanstack/react-query'
import { useToast } from './use-toast'
import { submitPost } from '@/features/PostEditor/actions'
import { PostsPage } from '@/lib/types'

/**
 * Кастомный хук useSubmitPostMutation используется для отправки поста на сервер и обновления кэша react-query
 * при успешном создании поста
 * @property {useMutation} - хук useMutation, который используется для отправки запроса на сервер
 * и обновления кэша react-query
 * @property {useQueryClient} - хук useQueryClient, который используется для обновления кэша react-query
 * @property {useToast} - пользовательский хук useToast, который используется для отображения уведомления
 */

export function useSubmitPostMutation() {
	const { toast } = useToast()

	const queryClient = useQueryClient()

	const mutation = useMutation({
		mutationFn: submitPost,
		onSuccess: async newPost => {
			const queryFilter = { queryKey: ['post-feed', 'for-you'] }
			await queryClient.cancelQueries(queryFilter)
			queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
				queryFilter,
				oldData => {
					const firstPage = oldData?.pages[0]
					if (firstPage) {
						return {
							pageParams: oldData.pageParams,
							pages: [
								{
									posts: [newPost, ...firstPage.posts],
									nextCursor: firstPage.nextCursor
								},
								...oldData.pages.slice(1)
							]
						}
					}
				}
			)
			queryClient.invalidateQueries({
				queryKey: queryFilter.queryKey,
				predicate: query => !query.state.data
			})
			toast({
				description: 'Пост успешно опубликован'
			})
		},
		onError: error => {
			console.error(error)
			toast({
				description: 'Ошибка: не удалось опубликовать пост',
				variant: 'destructive'
			})
		}
	})

	return mutation
}
