'use client'

import { PostsPage } from '@/lib/types'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import Post from '@/components/Post'
import kyInstance from '@/lib/ky'
import InfiniteScrollContainer from '@/components/InfiniteScrollContainer'

const FeedYouPosts = () => {
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
		isLoading,
		isError
	} = useInfiniteQuery({
		queryKey: ['post-feed', 'for-you'],
		queryFn: ({ pageParam }) =>
			kyInstance
				.get(
					'api/posts/for-you',
					pageParam ? { searchParams: { cursor: pageParam } } : {}
				)
				.json<PostsPage>(),
		initialPageParam: null as string | null,
		getNextPageParam: lastPage => lastPage.nextCursor
	})

	const posts = data?.pages.flatMap(page => page.posts) || []

	if (isLoading) return <Loader2 className='mx-auto animate-spin' />

	if (isError)
		return (
			<p className='text-center text-destructive'>
				При загрузке постов произошла ошибка.
			</p>
		)

	return (
		<InfiniteScrollContainer
			className='flex flex-col gap-5'
			onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
		>
			{posts.map(post => (
				<Post key={post.id} post={post} />
			))}
			{isFetchingNextPage && <Loader2 className='my-3 mx-auto animate-spin' />}
		</InfiniteScrollContainer>
	)
}

export default FeedYouPosts
