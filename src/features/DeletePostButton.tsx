import DeleteButton from '@/components/DeleteButton'
import DeletePostDialog from '@/components/post/DeletePostDialog'
import { PostData } from '@/lib/types'
import { useState } from 'react'

interface DeleteYouPostProps {
	post: PostData
	className?: string
}

const DeletePostButton = ({ post, className }: DeleteYouPostProps) => {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false)
	return (
		<>
			<DeleteButton
				className={className}
				onClick={() => setShowDeleteDialog(true)}
			/>
			<DeletePostDialog
				post={post}
				open={showDeleteDialog}
				onClose={() => setShowDeleteDialog(false)}
			/>
		</>
	)
}

export default DeletePostButton
