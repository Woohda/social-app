import { StreamChat } from 'stream-chat'

// для server-side
export const streamServerClient = StreamChat.getInstance(
	process.env.STREAM_API_KEY!,
	process.env.STREAM_API_SECRET
)
