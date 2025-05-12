import { Skeleton } from '../ui/skeleton'

const PostLoadingSkeleton = () => {
	return (
		<div className='flex flex-col gap-5'>
			<LoadingSkeleton />
			<LoadingSkeleton />
			<LoadingSkeleton />
		</div>
	)
}

function LoadingSkeleton() {
	return (
		<div className='flex flex-col gap-3 animate-pulse w-full rounded-2xl bg-card p-5 shadow-sm'>
			<div className='flex flex-wrap gap-3 '>
				<Skeleton className='size-12 rounded-full' />
				<div className='flex flex-col gap-2'>
					<Skeleton className='h-4 w-24 rounded' />
					<Skeleton className='h-4 w-20 rounded' />
				</div>
			</div>
			<Skeleton className='h-16 rounded' />
		</div>
	)
}

export default PostLoadingSkeleton
