'use client'

import { PostsPage } from '@/lib/types'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import Post from '@/components/post1/Post'
import kyInstance from '@/lib/ky'
import InfiniteScrollContainer from '@/components/InfiniteScrollContainer'
import PostLoadingSkeleton from '@/components/post1/PostLoadingSkeleton'

const FeedOfPosts = () => {
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
		isLoading,
		isSuccess,
		isError
	} = useInfiniteQuery({
		queryKey: ['post-feed', 'for-you'],
		queryFn: ({ pageParam }) =>
			kyInstance
				.get(
					'/api/posts/for-you',
					pageParam ? { searchParams: { cursor: pageParam } } : {}
				)
				.json<PostsPage>(),
		initialPageParam: null as string | null,
		getNextPageParam: lastPage => lastPage.nextCursor
	})

	const posts = data?.pages.flatMap(page => page.posts) || []

	if (isLoading) return <PostLoadingSkeleton />

	if (isSuccess && !posts.length && !hasNextPage)
		return (
			<p className='p-3 shadow-sm rounded-2xl text-center text-muted-foreground bg-card'>
				Нет постов
			</p>
		)

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

export default FeedOfPosts
