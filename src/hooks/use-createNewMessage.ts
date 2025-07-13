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
		enabled: !!client.userID && !!searchInputDebounced,
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
			if (!client.userID) {
				throw new Error('Chat client is not connected')
			}
			const sortedIds = [
				loggedInUser.id,
				...selectedUsers.map(u => u.id)
			].sort()
			const channelId = `chat-${sortedIds.join('-')}`

			// Сначала пытаемся найти существующий канал
			const existingChannels = await client.queryChannels({
				type: 'messaging',
				members: { $eq: sortedIds },
				id: { $eq: channelId }
			})

			if (existingChannels.length > 0) {
				return existingChannels[0]
			}

			// Если не найден — создаем новый
			const channel = client.channel('messaging', channelId, {
				members: sortedIds,
				name:
					selectedUsers.length > 1
						? loggedInUser.name +
							', ' +
							selectedUsers.map(u => u.name).join(', ')
						: undefined
			})

			await channel.watch()
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
