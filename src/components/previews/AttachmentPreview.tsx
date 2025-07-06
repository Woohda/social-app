import { Attachment } from '@/hooks/use-mediaUpload'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { XIcon } from 'lucide-react'

interface AttachmentsPreviewProps {
	attachment: Attachment
	onRemoveClick: () => void
}

const AttachmentsPreview = ({
	attachment: { file, isUploading },
	onRemoveClick
}: AttachmentsPreviewProps) => {
	const src = URL.createObjectURL(file)
	return (
		<div className={cn('relative size-fit', isUploading && 'opacity-50')}>
			{file.type.startsWith('image') ? (
				<Image
					src={src}
					alt='Attachment preview'
					width={500}
					height={500}
					className='size-fit h-20 aspect-square object-cover rounded-2xl'
				/>
			) : (
				<video
					controls
					className='size-fit h-20 aspect-video object-cover rounded-2xl'
				>
					<source src={src} type={file.type} />
				</video>
			)}
			{!isUploading && (
				<button
					onClick={onRemoveClick}
					className='absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background transition-colors hover:bg-foreground/60'
				>
					<XIcon size={15} />
				</button>
			)}
		</div>
	)
}

export default AttachmentsPreview
