'use client'

import { LikeInfo } from '@/lib/types'
import { useLikeInfo } from '@/hooks/use-likeInfo'
import { HeartIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LikeButtonProps {
	postId: string
	initialState: LikeInfo
	className?: string
}

const LikeButton = ({ postId, initialState, className }: LikeButtonProps) => {
	const { data, mutate } = useLikeInfo(postId, initialState)

	return (
		<button
			onClick={() => mutate()}
			className={cn('inline-flex items-center text-xs font-medium', className)}
		>
			<HeartIcon
				className={cn(
					'size-5 hover:text-destructive/80 transition-colors duration-300',
					data.isLikedByUser && 'fill-destructive text-destructive'
				)}
			/>
			<span className='tabular-nums ml-0.5'>
				{data.likes > 0 && data.likes}
			</span>
		</button>
	)
}

export default LikeButton
