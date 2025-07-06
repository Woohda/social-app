import { CommentData } from '@/lib/types'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '../ui/dialog'
import LoadingButton from '../button/LoadingButton'
import { Button } from '../ui/button'
import { useDeleteCommentMutation } from '@/hooks/use-deleteCommentMutation'

interface DeleteCommentDialogProps {
	comment: CommentData
	open: boolean
	onClose: () => void
}

const DeleteCommentDialog = ({
	comment,
	open,
	onClose
}: DeleteCommentDialogProps) => {
	const mutation = useDeleteCommentMutation()

	function handleOpenChange(open: boolean) {
		if (!open || !mutation.isPending) {
			onClose()
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className='max-w-xs flex flex-col gap-5 items-center'>
				<DialogHeader>
					<DialogTitle className='text-center'>
						Вы действительно хотите удалить комментарий?
					</DialogTitle>
				</DialogHeader>
				<DialogFooter className='flex-row'>
					<LoadingButton
						onClick={() => mutation.mutate(comment.id, { onSuccess: onClose })}
						loading={mutation.isPending}
						variant='destructive'
					>
						Удалить
					</LoadingButton>
					<Button
						onClick={onClose}
						disabled={mutation.isPending}
						variant='outline'
					>
						Отмена
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default DeleteCommentDialog
