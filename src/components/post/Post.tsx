'use client'

import type { PostData } from '@/lib/types'
import Link from 'next/link'
import UserAvatar from '../user/UserAvatar'
import { formatRelativeDate } from '@/lib/utils'
import useSession from '@/hooks/use-session'
import DeletePostButton from '@/components/button/DeletePostButton'
import Linkify from '@/features/Linkify'
import UserTooltip from '@/features/UserTooltip'
import MediaPreviews from '../previews/MediaPreviews'
import LikeButton from '../button/LikeButton'
import BookmarkButton from '../button/BookmarkButton'
import { useState } from 'react'
import CommentButton from '../button/CommentButton'
import Comments from '@/features/leave-comment/Comments'

interface PostProps {
	post: PostData
}

const Post = ({ post }: PostProps) => {
	const { user } = useSession()

	const [showComments, setShowComments] = useState(false)

	return (
		<article className='group/post flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-sm'>
			<div className='flex justify-between gap-3'>
				<div className='flex flex-wrap gap-3'>
					<UserTooltip user={post.user}>
						<Link
							href={`/users/${post.user.username}`}
							className='focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
						>
							<UserAvatar
								avatarUrl={post.user.avatarUrl}
								className='border border-transparent rounded-full hover:border-primary transition-colors duration-200'
							/>
						</Link>
					</UserTooltip>
					<div>
						<UserTooltip user={post.user}>
							<Link
								href={`/users/${post.user.username}`}
								className='block font-medium hover:underline text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
							>
								{post.user.name}
							</Link>
						</UserTooltip>
						<Link
							href={`/posts/${post.id}`}
							className='block text-sm text-muted-foreground hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
							suppressHydrationWarning
						>
							{formatRelativeDate(post.createdAt)}
						</Link>
					</div>
				</div>
				{post.user.id === user?.id && (
					<DeletePostButton
						post={post}
						className='self-start opacity-0 transition-opacity group-hover/post:opacity-100'
					/>
				)}
			</div>
			<Linkify>
				<p className='whitespace-pre-line break-words'>{post.content}</p>
			</Linkify>
			{post.attachments.length > 0 && (
				<MediaPreviews attachments={post.attachments} />
			)}
			<hr className='text-muted-foreground/20' />
			<div className='flex gap-3 justify-between items-center'>
				<CommentButton
					post={post}
					onClick={() => setShowComments(!showComments)}
				/>
				<div className='flex gap-3 items-center'>
					<LikeButton
						postId={post.id}
						initialState={{
							likes: post._count.likes,
							isLikedByUser: post.likes.some(like => like.userId === user?.id)
						}}
					/>
					<BookmarkButton
						postId={post.id}
						initialState={{
							isBookmarkedByUser: post.bookmarks.some(
								bookmark => bookmark.userId === user?.id
							)
						}}
					/>
				</div>
			</div>
			{showComments && <Comments post={post} />}
		</article>
	)
}

export default Post
