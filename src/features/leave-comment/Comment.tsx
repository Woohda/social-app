import { CommentData } from '@/lib/types'
import UserTooltip from '../UserTooltip'
import Link from 'next/link'
import UserAvatar from '@/components/user/UserAvatar'
import { formatRelativeDate } from '@/lib/utils'

interface CommentProps {
	comment: CommentData
}

const Comment = ({ comment }: CommentProps) => {
	return (
		<div className='flex gap-3 py-3'>
			<span className='hidden sm:inline'>
				<UserTooltip user={comment.user}>
					<Link
						href={`/users/${comment.user.username}`}
						className='focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
					>
						<UserAvatar
							avatarUrl={comment.user.avatarUrl}
							size={40}
							className='border border-transparent rounded-full hover:border-primary transition-colors duration-200'
						/>
					</Link>
				</UserTooltip>
			</span>
			<div>
				<div className='flex items-center gap-1 text-sm'>
					<UserTooltip user={comment.user}>
						<Link
							href={`/users/${comment.user.username}`}
							className='block font-medium hover:underline text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
						>
							{comment.user.name}
						</Link>
					</UserTooltip>
					<span className='text-muted-foreground'>
						{formatRelativeDate(comment.createdAt)}
					</span>
				</div>
				<div>{comment.content}</div>
			</div>
		</div>
	)
}

export default Comment
