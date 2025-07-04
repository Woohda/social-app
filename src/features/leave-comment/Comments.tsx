import CommentInput from '@/components/input/CommentInput'
import kyInstance from '@/lib/ky'
import { CommentsPage, PostData } from '@/lib/types'
import { useInfiniteQuery } from '@tanstack/react-query'
import Comment from './Comment'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface CommentsProps {
	post: PostData
}

const Comments = ({ post }: CommentsProps) => {
	const { data, fetchNextPage, hasNextPage, isFetching, status } =
		useInfiniteQuery({
			queryKey: ['comments', post.id],
			queryFn: ({ pageParam }) =>
				kyInstance
					.get(
						`/api/posts/${post.id}/comments`,
						pageParam ? { searchParams: { cursor: pageParam } } : {}
					)
					.json<CommentsPage>(),
			initialPageParam: null as string | null,
			getNextPageParam: firstPage => firstPage.prevCursor,
			select: data => ({
				pages: [...data.pages].reverse(),
				pageParams: [...data.pageParams].reverse()
			})
		})

	const comments = data?.pages.flatMap(page => page.comments) || []
	return (
		<div className='flex flex-col gap-3'>
			<CommentInput post={post} />
			{hasNextPage && (
				<Button
					variant='link'
					className='mx-auto block'
					disabled={isFetching}
					onClick={() => fetchNextPage()}
				>
					Предыдущие комментарии
				</Button>
			)}
			{status === 'pending' && <Loader2 className='mx-auto animate-spin' />}
			{status === 'success' && !comments.length && (
				<p className='text-center text-muted-foreground'>Нет комментариев</p>
			)}
			{status === 'error' && (
				<p className='text-center text-destructive'>
					Произошла ошибка при загрузке комментариев
				</p>
			)}
			<div className='divide-y'>
				{comments.map(comment => (
					<Comment key={comment.id} comment={comment} />
				))}
			</div>
		</div>
	)
}

export default Comments
