import {
	InfiniteData,
	QueryKey,
	useMutation,
	useQueryClient
} from '@tanstack/react-query'
import { useToast } from './use-toast'
import { CommentsPage } from '@/lib/types'
import { deleteComment } from '@/features/leave-comment/action'

/**
 * Кастомный хук @function useDeletePostMutation используется для удаления комментария поста на сервере
 * и обновления кэша react-query при успешном удалении комментария
 * @property {useMutation} - хук useMutation, который используется для отправки запроса на сервер
 * и обновления кэша react-query
 * @property {useQueryClient} - хук useQueryClient, который используется для обновления кэша react-query
 * @property {useToast} - пользовательский хук useToast, который используется для отображения уведомления
 * @type {CommentsPage} - тип страницы комментариев, который используется для обновления кэша react-query
 * @property {queryKey} - ключ запроса, который используется для обновления кэша react-query
 * @returns {useMutation} - возвращает объект с функцией мутации, которая используется для отправки запроса на сервер
 * и обновления кэша react-query
 */

export function useDeleteCommentMutation() {
	const { toast } = useToast()

	const queryClient = useQueryClient()

	const mutation = useMutation({
		mutationFn: deleteComment,
		onSuccess: async deletedComment => {
			const queryKey: QueryKey = ['comments', deletedComment.postId]

			await queryClient.cancelQueries({ queryKey })

			queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
				queryKey,
				oldData => {
					if (!oldData) return

					return {
						pageParams: oldData.pageParams,
						pages: oldData.pages.map(page => ({
							comments: page.comments.filter(
								post => post.id !== deletedComment.id
							),
							prevCursor: page.prevCursor
						}))
					}
				}
			)

			toast({
				description: 'Комментарий успешно удален'
			})
		},
		onError: error => {
			console.error(error)
			toast({
				description: 'Ошибка: не удалось удалить комментарий',
				variant: 'destructive'
			})
		}
	})

	return mutation
}
