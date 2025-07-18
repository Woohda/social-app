'use client'

import { PostData } from '@/lib/types'
import { MessageSquareIcon } from 'lucide-react'

interface CommentButtonProps {
	post: PostData
	onClick: () => void
}

const CommentButton = ({ post, onClick }: CommentButtonProps) => {
	return (
		<button onClick={onClick} className='flex items-center gap-2'>
			<MessageSquareIcon className='size-5' />
			<span className='text-sm font-medium tabular-nums'>
				{post._count.comments}{' '}
				<span className='hidden sm:inline'>Комментарии</span>
			</span>
		</button>
	)
}

export default CommentButton
