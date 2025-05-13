'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import useSession from '@/hooks/use-session'
import UserAvatar from '@/components/UserAvatar'
import './style.css'
import { useCreatePostMutation } from '@/hooks/use-createPostMutation'
import LoadingButton from '@/components/LoadingButton'

const PostEditor = () => {
	const { user } = useSession()

	const mutation = useCreatePostMutation()

	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				bold: false,
				italic: false
			}),
			Placeholder.configure({
				placeholder: 'Напишите что-нибудь...'
			})
		]
	})

	const post =
		editor?.getText({
			blockSeparator: '\n'
		}) || ''

	function onSubmit() {
		mutation.mutate(post, {
			onSuccess: () => {
				editor?.commands.clearContent()
			}
		})
	}

	return (
		<div className='flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm'>
			<div className='flex gap-5'>
				<UserAvatar
					avatarUrl={user?.avatar}
					size={40}
					className='hidden sm:inline'
				/>
				<EditorContent
					editor={editor}
					className='w-full max-h-[20rem] overflow-y-auto bg-background rounded-2xl px-5 py-3 focus:outline-none'
				/>
			</div>
			<div className='flex justify-end'>
				<LoadingButton
					onClick={onSubmit}
					disabled={!post.trim()}
					className='min-w-20 mt-5'
					loading={mutation.isPending}
				>
					Опубликовать
				</LoadingButton>
			</div>
		</div>
	)
}

export default PostEditor
