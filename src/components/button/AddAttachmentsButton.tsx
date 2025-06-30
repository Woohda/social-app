import { useRef } from 'react'
import { Button } from '../ui/button'
import { ImageIcon } from 'lucide-react'

interface AddAttachmentsButtonProps {
	onFilesSelected: (files: File[]) => void
	disabled: boolean
}

const AddAttachmentsButton = ({
	onFilesSelected,
	disabled
}: AddAttachmentsButtonProps) => {
	const fileInputRef = useRef<HTMLInputElement>(null)

	return (
		<>
			<Button
				variant='ghost'
				size='icon'
				className='text-primary hover:bg-accent hover:text-accent-foreground'
				disabled={disabled}
				onClick={() => {
					fileInputRef.current?.click()
				}}
			>
				<ImageIcon size={20} />
			</Button>

			<input
				ref={fileInputRef}
				type='file'
				multiple
				accept='image/*,video/*'
				className='hidden sr-only'
				onChange={e => {
					const files = Array.from(e.target.files || [])
					if (files.length) {
						onFilesSelected(files)
						e.target.value = ''
					}
				}}
			/>
		</>
	)
}

export default AddAttachmentsButton
