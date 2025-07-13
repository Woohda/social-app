'use client'

import { CommentData } from '@/lib/types'
import { cn } from '@/lib/utils'
import { XIcon } from 'lucide-react'
import { useState } from 'react'
import DeleteCommentDialog from '../dialog/DeleteCommentDialog'

interface DeleteYouCommentProps {
	comment: CommentData
	className?: string
}

const DeleteCommentButton = ({ comment, className }: DeleteYouCommentProps) => {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false)
	return (
		<>
			<button
				onClick={() => setShowDeleteDialog(true)}
				className={cn('text-sm font-medium text-destructive', className)}
			>
				<XIcon className='size-4' />
			</button>
			<DeleteCommentDialog
				comment={comment}
				open={showDeleteDialog}
				onClose={() => setShowDeleteDialog(false)}
			/>
		</>
	)
}

export default DeleteCommentButton
