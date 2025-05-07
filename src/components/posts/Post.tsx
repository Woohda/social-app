import type { PostData } from '@/lib/types'
import Link from 'next/link'
import UserAvatar from '../UserAvatar'
import { formatRelativeDate } from '@/lib/utils'

interface PostProps {
	post: PostData
}

const Post = ({ post }: PostProps) => {
	return (
		<article className='space-y-3 rounded-2xl bg-card p-5 shadow-sm'>
			<div className='flex flex-wrap gap-3'>
				<Link href={`/user/${post.user.username}`}>
					<UserAvatar avatarUrl={post.user.avatarUrl} />
				</Link>
				<div>
					<Link
						href={`/user/${post.user.username}`}
						className='block font-medium hover:underline text-primary'
					>
						{post.user.name}
					</Link>
					<Link
						href={`/posts/${post.id}`}
						className='block text-sm text-muted-foreground hover:underline'
					>
						{formatRelativeDate(post.createdAt)}
					</Link>
				</div>
			</div>
			<p className='whitespace-pre-line break-words'>{post.content}</p>
		</article>
	)
}

export default Post
