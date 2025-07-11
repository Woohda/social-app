import { useMutation, useQuery } from '@tanstack/react-query'
import { useToast } from './use-toast'
import useSession from './use-session'
import { useDebounce } from './use-debounce'
import { DefaultStreamChatGenerics, useChatContext } from 'stream-chat-react'
import { UserResponse } from 'stream-chat'

interface CreateNewMessageProps {
	searchInput: string
	selectedUsers: UserResponse<DefaultStreamChatGenerics>[]
	onChatCreated: () => void
}

export function useCreateNewMessage({
	searchInput,
	selectedUsers,
	onChatCreated
}: CreateNewMessageProps) {
	const { toast } = useToast()
	const { user: loggedInUser } = useSession()
	if (!loggedInUser) {
		throw new Error('User is not logged in')
	}

	const { client, setActiveChannel } = useChatContext()

	const searchInputDebounced = useDebounce(searchInput)

	const { data, isFetching, isError, isSuccess } = useQuery({
		queryKey: ['stream-users', searchInputDebounced],
		queryFn: async () =>
			client.queryUsers(
				{
					id: { $ne: loggedInUser.id },
					role: { $ne: 'admin' },
					...(searchInputDebounced
						? {
								$or: [
									{ name: { $autocomplete: searchInputDebounced } },
									{ username: { $autocomplete: searchInputDebounced } }
								]
							}
						: {})
				},
				{ name: 1, username: 1 },
				{ limit: 15 }
			)
	})

	const mutation = useMutation({
		mutationFn: async () => {
			const channel = client.channel('messaging', {
				members: [loggedInUser.id, ...selectedUsers.map(u => u.id)],
				name:
					selectedUsers.length > 1
						? loggedInUser.name +
							', ' +
							selectedUsers.map(u => u.name).join(', ')
						: undefined
			})
			await channel.create()
			return channel
		},
		onSuccess: channel => {
			setActiveChannel(channel)
			onChatCreated()
		},
		onError(error) {
			console.error('Ошибка при создании нового чата:', error)
			toast({
				variant: 'destructive',
				description:
					'Ошибка при создании нового чата. Пожалуйста попробуйте снова.'
			})
		}
	})

	return { data, isFetching, isError, isSuccess, mutation }
}
