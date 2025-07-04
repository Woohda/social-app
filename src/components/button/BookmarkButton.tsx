'use client'

import { BookmarkInfo } from '@/lib/types'
import { useBookmarkInfo } from '@/hooks/use-bookmarkInfo'
import { BookmarkIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BookmarkButtonProps {
	postId: string
	initialState: BookmarkInfo
	className?: string
}

const BookmarkButton = ({
	postId,
	initialState,
	className
}: BookmarkButtonProps) => {
	const { data, mutate } = useBookmarkInfo(postId, initialState)

	return (
		<button
			onClick={() => mutate()}
			className={cn('inline-flex items-center text-xs font-medium', className)}
		>
			<BookmarkIcon
				className={cn(
					'size-5 hover:text-primary/80 transition-colors duration-300',
					data.isBookmarkedByUser && 'fill-primary text-primary'
				)}
			/>
		</button>
	)
}

export default BookmarkButton
