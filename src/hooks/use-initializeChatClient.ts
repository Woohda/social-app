import { StreamChat } from 'stream-chat'
import useSession from './use-session'
import { useEffect, useState } from 'react'
import kyInstance from '@/lib/ky'

export function useInitializeChatClient() {
	const { user } = useSession()
	const [chatClient, setChatClient] = useState<StreamChat | null>(null)

	useEffect(() => {
		if (!user) return
		const client = StreamChat.getInstance(
			process.env.NEXT_PUBLIC_STREAM_API_KEY!
		)
		client
			.connectUser(
				{
					id: user.id,
					username: user.username,
					name: user.name,
					image: user.avatarUrl
				},
				async () => {
					const data = await kyInstance
						.get('/api/get-token')
						.json<{ token: string }>()
					return data.token
				}
			)
			.catch(error => {
				console.error('Ошибка при подключении пользователя:', error)
			})
			.then(() => setChatClient(client))
		return () => {
			setChatClient(null)
			client
				.disconnectUser()
				.catch(error => {
					console.error('Ошибка при отключении пользователя:', error)
				})
				.then(() => console.log('Пользователь успешно отключен от чата'))
		}
	}, [user])

	return chatClient
}
