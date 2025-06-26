import {
	InfiniteData,
	QueryFilters,
	useMutation,
	useQueryClient
} from '@tanstack/react-query'
import { useToast } from './use-toast'
import { deletePost } from '@/features/post-editor/actions'
import { PostsPage } from '@/lib/types'
import { useRouter, usePathname } from 'next/navigation'

/**
 * Кастомный хук useDeletePostMutation используется для удаления поста на сервере
 * и обновления кэша react-query при успешном удалении поста
 * @property {useMutation} - хук useMutation, который используется для отправки запроса на сервер
 * и обновления кэша react-query
 * @property {useQueryClient} - хук useQueryClient, который используется для обновления кэша react-query
 * @property {useToast} - пользовательский хук useToast, который используется для отображения уведомления
 * @property {useRouter} - хук useRouter из next/navigation, который используется для навигации после удаления поста
 * @property {usePathname} - хук usePathname из next/navigation, который используется для получения текущего пути
 * @type {PostsPage} - тип страницы постов, который используется для обновления кэша react-query
 * @type {QueryFilters} - тип фильтров запросов, который используется для обновления кэша react-query
 * @returns {useMutation} - возвращает объект с функцией мутации, которая используется для отправки запроса на сервер
 * и обновления кэша react-query
 */

export function useDeletePostMutation() {
	const { toast } = useToast()

	const queryClient = useQueryClient()

	const router = useRouter()
	const pathname = usePathname()

	const mutation = useMutation({
		mutationFn: deletePost,
		onSuccess: async deletedPost => {
			const queryFilter: QueryFilters = { queryKey: ['post-feed'] }

			await queryClient.cancelQueries(queryFilter)

			queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
				queryFilter,
				oldData => {
					if (!oldData) return

					return {
						pageParams: oldData.pageParams,
						pages: oldData.pages.map(page => ({
							posts: page.posts.filter(post => post.id !== deletedPost.id),
							nextCursor: page.nextCursor
						}))
					}
				}
			)

			toast({
				description: 'Пост успешно удален'
			})

			if (pathname === `/posts/${deletedPost.id}`) {
				router.push(`/users/${deletedPost.user.username}`)
			}
		},
		onError: error => {
			console.error(error)
			toast({
				description: 'Ошибка: не удалось удалить пост',
				variant: 'destructive'
			})
		}
	})

	return mutation
}
