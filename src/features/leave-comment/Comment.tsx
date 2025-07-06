import { CommentData } from '@/lib/types'
import UserTooltip from '../UserTooltip'
import Link from 'next/link'
import UserAvatar from '@/components/user/UserAvatar'
import { formatRelativeDate } from '@/lib/utils'
import useSession from '@/hooks/use-session'
import DeleteCommentButton from '@/components/button/DeleteCommentButton'

interface CommentProps {
	comment: CommentData
}

const Comment = ({ comment }: CommentProps) => {
	const { user } = useSession()
	return (
		<div className='flex gap-3 py-3 justify-between group/comment'>
			<div className='flex gap-3'>
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
			{comment.user.id === user?.id && (
				<DeleteCommentButton
					comment={comment}
					className='self-start opacity-0 transition-opacity group-hover/comment:opacity-100'
				/>
			)}
		</div>
	)
}

export default Comment
