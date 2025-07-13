import { StreamChat } from 'stream-chat'
import useSession from './use-session'
import { useEffect, useRef, useState } from 'react'
import kyInstance from '@/lib/ky'

export function useInitializeChatClient() {
	const { user } = useSession()
	const [chatClient, setChatClient] = useState<StreamChat | null>(null)
	const clientRef = useRef<StreamChat | null>(null)

	useEffect(() => {
		if (!user) return
		let isMounted = true

		if (!clientRef.current) {
			clientRef.current = StreamChat.getInstance(
				process.env.NEXT_PUBLIC_STREAM_API_KEY!
			)
		}

		const client = clientRef.current

		const connect = async () => {
			try {
				if (client.userID) {
					if (isMounted) setChatClient(client)
					return
				}
				if (client.userID === user.id) {
					setChatClient(client)
					return
				}
				await client.connectUser(
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
				if (isMounted) setChatClient(client)
			} catch (error) {
				console.error('Ошибка при подключении пользователя:', error)
			}
		}
		connect()
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
	}, [user])

	return chatClient
}
