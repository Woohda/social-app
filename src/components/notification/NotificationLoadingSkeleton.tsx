import { Skeleton } from '../ui/skeleton'

const PostLoadingSkeleton = () => {
	return (
		<div className='flex flex-col gap-5'>
			<LoadingSkeleton />
			<LoadingSkeleton />
			<LoadingSkeleton />
			<LoadingSkeleton />
			<LoadingSkeleton />
		</div>
	)
}

function LoadingSkeleton() {
	return (
		<article className='flex items-center gap-3 animate-pulse w-full rounded-2xl bg-card p-3 shadow-sm '>
			<Skeleton className='size-9 rounded-full flex-shrink-0' />
			<div className='w-full flex gap-1 items-center'>
				<Skeleton className='size-9 rounded-full flex-shrink-0' />
				<Skeleton className='h-6 w-full rounded' />
			</div>
		</article>
	)
}

export default PostLoadingSkeleton
