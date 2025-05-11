'use client'

import type { PostData } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import Post from '@/components/posts/Post'
import kyInstance from '@/lib/ky'

const FeedYouPosts = () => {
	const query = useQuery<PostData[]>({
		queryKey: ['post-feed', 'for-you'],
		queryFn: kyInstance.get('api/posts/for-you').json<PostData[]>
	})

	if (query.isLoading) return <Loader2 className='mx-auto animate-spin' />

	if (query.isError)
		return (
			<p className='text-center text-destructive'>
				При загрузке постов произошла ошибка.
			</p>
		)

	return (
		<div className='flex flex-col gap-5'>
			{query.data?.map(post => <Post key={post.id} post={post} />)}
		</div>
	)
}

export default FeedYouPosts
