'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { submitPost } from './actions'
import useSession from '@/hooks/use-session'
import UserAvatar from '@/components/UserAvatar'
import { Button } from '@/components/ui/button'
import './style.css'

const PostEditor = () => {
	const { user } = useSession()
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

	async function savePost() {
		await submitPost(post)
		editor?.commands.clearContent()
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
				<Button
					onClick={savePost}
					disabled={!post.trim()}
					className='min-w-20 mt-5'
				>
					Опубликовать
				</Button>
			</div>
		</div>
	)
}

export default PostEditor
