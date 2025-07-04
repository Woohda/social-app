import { useCreateCommentMutation } from '@/hooks/use-createCommentMutation'
import { PostData } from '@/lib/types'
import { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Loader2, SendHorizonalIcon } from 'lucide-react'

interface CommentInputProps {
	post: PostData
}

const CommentInput = ({ post }: CommentInputProps) => {
	const [input, setInput] = useState('')

	const mutation = useCreateCommentMutation(post.id)

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault()
		mutation.mutate(
			{
				post,
				content: input
			},
			{
				onSuccess: () => setInput('')
			}
		)
	}

	return (
		<form className='w-full flex items-center gap-1' onSubmit={onSubmit}>
			<Input
				placeholder='Добавить комментарий'
				value={input}
				onChange={e => setInput(e.target.value)}
				autoFocus
			/>
			<Button
				type='submit'
				variant='ghost'
				size='icon'
				disabled={!input.trim() || mutation.isPending}
			>
				{!mutation.isPending ? (
					<SendHorizonalIcon />
				) : (
					<Loader2 className='animate-spin' />
				)}
			</Button>
		</form>
	)
}

export default CommentInput
