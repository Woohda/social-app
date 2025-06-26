import {
	InfiniteData,
	QueryFilters,
	useMutation,
	useQueryClient
} from '@tanstack/react-query'
import { useToast } from './use-toast'
import { createPost } from '@/features/post-editor/actions'
import { PostsPage } from '@/lib/types'
import useSession from './use-session'

/**
 * Кастомный хук useSubmitPostMutation используется для отправки поста на сервер
 * и обновления кэша react-query при успешном создании поста
 * @property {useMutation} - хук useMutation, который используется для отправки запроса на сервер
 * и обновления кэша react-query
 * @property {useSession} - пользовательский хук useSession, который используется для получения информации о текущем пользователе
 * @property {useQueryClient} - хук useQueryClient, который используется для обновления кэша react-query
 * @property {useToast} - пользовательский хук useToast, который используется для отображения уведомления
 * @type {PostsPage} - тип страницы постов, который используется для обновления кэша react-query
 * @type {QueryFilters} - тип фильтров запросов, который используется для обновления кэша react-query
 * @returns {useMutation} - возвращает объект с функцией мутации, которая используется для отправки запроса на сервер
 * и обновления кэша react-query
 */

export function useCreatePostMutation() {
	const { toast } = useToast()

	const queryClient = useQueryClient()

	const { user } = useSession()

	const mutation = useMutation({
		mutationFn: createPost,
		onSuccess: async newPost => {
			const queryFilter = {
				queryKey: ['post-feed'],
				predicate: query => {
					return (
						query.queryKey.includes('for-you') ||
						(query.queryKey.includes('user-posts') &&
							query.queryKey.includes(user?.id))
					)
				}
			} satisfies QueryFilters
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
				predicate: query => queryFilter.predicate(query) && !query.state.data
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
