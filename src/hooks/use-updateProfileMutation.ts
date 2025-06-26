import { useRouter } from 'next/navigation'
import { useToast } from './use-toast'
import {
	useQueryClient,
	useMutation,
	InfiniteData,
	QueryFilters
} from '@tanstack/react-query'
import { useUploadThing } from '@/lib/uploadthing'
import { UpdateUserProfileValues } from '@/lib/validation'
import { updateUserProfile } from '@/features/edit-profile/actions'
import { PostsPage } from '@/lib/types'

/**
 * Кастомный хук для обновления профиля пользователя в базе данных и загрузки аватара
 *
 * @property {useMutation} - хук useMutation, который используется для отправки запроса на сервер
 * и обновления кэша react-query
 * @property {useQueryClient} - хук useQueryClient, который используется для обновления кэша react-query
 * @property {useToast} - пользовательский хук useToast, который используется для отображения уведомления
 * @property {useRouter} - хук useRouter из next/navigation, который используется для навигации после обновления профиля
 * @property {useUploadThing} - хук useUploadThing из uploadthing, который используется для загрузки аватара
 * @type {UpdateUserProfileValues} - тип данных для обновления профиля
 * @type {PostsPage} - тип данных страницы постов
 * @returns {useMutation} - возвращает объект с функцией мутации, которая используется для отправки запроса на сервер
 * и обновления кэша react-query
 */
export function useUpdateProfileMutation() {
	const { toast } = useToast()

	const router = useRouter()

	const queryClient = useQueryClient()

	const { startUpload: startAvatarUpload } = useUploadThing('avatar')

	const mutation = useMutation({
		mutationFn: async ({
			values,
			avatar
		}: {
			values: UpdateUserProfileValues
			avatar?: File
		}) => {
			return Promise.all([
				updateUserProfile(values),
				avatar && startAvatarUpload([avatar])
			])
		},
		onSuccess: async ([updatedUser, uploadResult]) => {
			const newAvatarUrl = uploadResult?.[0].serverData.avatarUrl

			const queryFilter: QueryFilters = { queryKey: ['post-feed'] }

			await queryClient.cancelQueries(queryFilter)

			queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
				queryFilter,
				oldData => {
					if (!oldData) return

					return {
						pageParams: oldData.pageParams,
						pages: oldData.pages.map(page => ({
							posts: page.posts.map(post => {
								if (post.user.id === updatedUser.id) {
									return {
										...post,
										user: {
											...updatedUser,
											avatar: newAvatarUrl || updatedUser.avatarUrl
										}
									}
								}
								return post
							}),
							nextCursor: page.nextCursor
						}))
					}
				}
			)
			router.refresh()

			toast({
				description: 'Ваш профиль был успешно обновлен'
			})
		},
		onError: error => {
			console.log(error)
			toast({
				description: 'Что-то пошло не так. Попробуйте позже.',
				variant: 'destructive'
			})
		}
	})

	return mutation
}
