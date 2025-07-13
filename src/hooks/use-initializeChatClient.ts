import { StreamChat } from 'stream-chat'
import useSession from './use-session'
import { useEffect, useState } from 'react'
import kyInstance from '@/lib/ky'

export function useInitializeChatClient() {
	const { user } = useSession()
	if (!user) {
		throw new Error('User is not logged in')
	}
	const [chatClient, setChatClient] = useState<StreamChat | null>(null)

	useEffect(() => {
		let isMounted = true
		const client = StreamChat.getInstance(
			process.env.NEXT_PUBLIC_STREAM_API_KEY!
		)
		const connectUser = async () => {
			try {
				if (!client.userID) {
					const { token } = await kyInstance
						.get('/api/get-token')
						.json<{ token: string }>()

					await client.connectUser(
						{
							id: user.id,
							username: user.username,
							name: user.name,
							image: user.avatarUrl
						},
						token
					)
				}

				if (isMounted) setChatClient(client)
			} catch (error) {
				console.error('Ошибка при подключении пользователя:', error)
			}
		}
		connectUser()

		return () => {
			isMounted = false
			setChatClient(null)
			client
				.disconnectUser()
				.catch(error => {
					console.error('Ошибка при отключении пользователя:', error)
				})
				.then(() => console.log('Пользователь успешно отключен от чата'))
		}
	}, [user.id, user.username, user.name, user.avatarUrl])

	return chatClient
}
