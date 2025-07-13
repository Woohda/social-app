'use client'

import { CheckIcon } from 'lucide-react'
import { UserResponse } from 'stream-chat'
import { DefaultStreamChatGenerics } from 'stream-chat-react'
import UserAvatar from '../user/UserAvatar'

interface SearchUserResultButtonProps {
	user: UserResponse<DefaultStreamChatGenerics>
	selected: boolean
	onClick: () => void
}

const SearchUserResultButton = ({
	user,
	selected,
	onClick
}: SearchUserResultButtonProps) => {
	return (
		<button
			className='flex w-full items-center justify-between px-4 py-2.5 transition-colors hover:bg-muted/50'
			onClick={onClick}
		>
			<div className='flex items-center gap-2'>
				<UserAvatar avatarUrl={user.image} />
				<div className='flex flex-col text-start'>
					<p className='font-bold'>{user.name}</p>
					<p className='text-muted-foreground'>@{user.username}</p>
				</div>
			</div>
			{selected && <CheckIcon className='size-5 text-primary' />}
		</button>
	)
}

export default SearchUserResultButton
