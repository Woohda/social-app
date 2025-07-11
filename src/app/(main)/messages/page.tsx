import { Metadata } from 'next'
import Chat from '@/components/chat/Chat'

export const metadata: Metadata = {
	title: 'Сообщения'
}

export default async function Page() {
	return <Chat />
}
