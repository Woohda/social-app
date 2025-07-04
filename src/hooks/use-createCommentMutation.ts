import {
	InfiniteData,
	QueryKey,
	useMutation,
	useQueryClient
} from '@tanstack/react-query'
import { useToast } from './use-toast'
import { CommentsPage } from '@/lib/types'
import { createComment } from '@/features/leave-comment/action'

/**
 * Кастомный хук @function useCreateCommentMutation используется для отправки комментария к поста на сервер
 * и обновления кэша react-query при успешном создании комментария
 * @property {useMutation} - хук useMutation, который используется для отправки запроса на сервер
 * и обновления кэша react-query
 * @property {useQueryClient} - хук useQueryClient, который используется для обновления кэша react-query
 * @property {useToast} - пользовательский хук useToast, который используется для отображения уведомления
 * @property {queryKey} - ключ запроса, который используется для обновления кэша react-query
 * @type {СommentsPage} - тип страницы комментариев, который используется для обновления кэша react-query
 * @returns {useMutation} - возвращает объект с функцией мутации, которая используется для отправки запроса на сервер
 * и обновления кэша react-query
 */

export function useCreateCommentMutation(postId: string) {
	const { toast } = useToast()

	const queryClient = useQueryClient()

	const mutation = useMutation({
		mutationFn: createComment,
		onSuccess: async newComment => {
			const queryKey: QueryKey = ['comments', postId]

			await queryClient.cancelQueries({ queryKey })

			queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
				queryKey,
				oldData => {
					const firstPage = oldData?.pages[0]
					if (firstPage) {
						return {
							pageParams: oldData.pageParams,
							pages: [
								{
									comments: [...firstPage.comments, newComment],
									prevCursor: firstPage.prevCursor
								},
								...oldData.pages.slice(1)
							]
						}
					}
				}
			)
			queryClient.invalidateQueries({
				queryKey,
				predicate: query => !query.state.data
			})
			toast({
				description: 'Комментарий успешно опубликован'
			})
		},
		onError: error => {
			console.error(error)
			toast({
				description: 'Ошибка: не удалось опубликовать комментарий',
				variant: 'destructive'
			})
		}
	})

	return mutation
}
