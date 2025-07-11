import { UserResponse } from 'stream-chat'
import { DefaultStreamChatGenerics } from 'stream-chat-react'
import UserAvatar from '../user/UserAvatar'
import { XIcon } from 'lucide-react'

interface SelectedUserTagButtonProps {
	user: UserResponse<DefaultStreamChatGenerics>
	onRemove: () => void
}

const SelectedUserTagButton = ({
	user,
	onRemove
}: SelectedUserTagButtonProps) => {
	return (
		<button
			className='flex items-center gap-2 rounded-full border p-1 hover:bg-muted/50'
			onClick={onRemove}
		>
			<UserAvatar avatarUrl={user.image} size={24} />
			<p className='text-bold'>{user.username}</p>
			<XIcon className='mx-2 size-5 text-muted-foreground' />
		</button>
	)
}

export default SelectedUserTagButton
