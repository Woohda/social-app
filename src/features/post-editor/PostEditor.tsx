'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import useSession from '@/hooks/use-session'
import UserAvatar from '@/components/user/UserAvatar'
import './style.css'
import { useCreatePostMutation } from '@/hooks/use-createPostMutation'
import LoadingButton from '@/components/button/LoadingButton'
import { useMediaUpload } from '@/hooks/use-mediaUpload'
import AddAttachmentsButton from '@/components/button/AddAttachmentsButton'
import AttachmentsPreviews from '@/components/previews/AttachmentPreviews'
import { Loader2 } from 'lucide-react'
import { useDropzone } from '@uploadthing/react'
import { cn } from '@/lib/utils'

const PostEditor = () => {
	const { user } = useSession()

	const mutation = useCreatePostMutation()

	const {
		attachments,
		isUploading,
		uploadProgress,
		startUpload,
		removeAttachment,
		resetMediaUploads
	} = useMediaUpload()

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop: startUpload
	})

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { onClick, ...dropzoneProps } = getRootProps()

	const editor = useEditor({
		immediatelyRender: false,
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
		mutation.mutate(
			{
				content: post,
				mediaIds: attachments
					.map(attachment => attachment.mediaId)
					.filter(Boolean) as string[]
			},
			{
				onSuccess: () => {
					editor?.commands.clearContent()
					resetMediaUploads()
				}
			}
		)
	}

	return (
		<div className='flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm'>
			<div className='flex gap-5'>
				<UserAvatar
					avatarUrl={user?.avatarUrl}
					size={40}
					className='hidden sm:inline'
				/>
				<div {...dropzoneProps} className='w-full'>
					<EditorContent
						editor={editor}
						className={cn(
							'w-full max-h-[20rem] overflow-y-auto bg-background rounded-2xl px-5 py-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:border-primary',
							isDragActive && 'border-2 border-dashed border-primary'
						)}
					/>
					<input {...getInputProps()} />
				</div>
			</div>
			{!!attachments.length && (
				<AttachmentsPreviews
					attachment={attachments}
					onRemoveClick={removeAttachment}
				/>
			)}
			<div className='flex justify-end items-center gap-2 mt-2'>
				{isUploading && (
					<>
						<span className='text-sm'>{uploadProgress ?? 0}%</span>
						<Loader2 className='size-5 animate-spin text-primary' />
					</>
				)}
				<AddAttachmentsButton
					onFilesSelected={startUpload}
					disabled={isUploading || attachments.length >= 5}
				/>
				<LoadingButton
					onClick={onSubmit}
					disabled={!post.trim() || attachments.length > 5 || isUploading}
					className='min-w-20'
					loading={mutation.isPending}
				>
					Опубликовать
				</LoadingButton>
			</div>
		</div>
	)
}

export default PostEditor
