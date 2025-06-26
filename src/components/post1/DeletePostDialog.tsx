import { useDeletePostMutation } from '@/hooks/use-deletePostMutation'
import { PostData } from '@/lib/types'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '../ui/dialog'
import LoadingButton from '../LoadingButton'
import { Button } from '../ui/button'

interface DeletePostDialogProps {
	post: PostData
	open: boolean
	onClose: () => void
}

const DeletePostDialog = ({ post, open, onClose }: DeletePostDialogProps) => {
	const mutation = useDeletePostMutation()

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
						Вы действительно хотите удалить пост?
					</DialogTitle>
				</DialogHeader>
				<DialogFooter className='flex-row'>
					<LoadingButton
						onClick={() => mutation.mutate(post.id, { onSuccess: onClose })}
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

export default DeletePostDialog
