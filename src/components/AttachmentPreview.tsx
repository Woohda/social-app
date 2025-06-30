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
		<div
			className={cn('relative mx-auto size-fit', isUploading && 'opacity-50')}
		>
			{file.type.startsWith('image') ? (
				<Image
					src={src}
					alt='Attachment preview'
					width={500}
					height={500}
					className='size-fit max-h-[10rem] rounded-2xl'
				/>
			) : (
				<video controls className='size-fit max-h-[10rem] rounded-2xl'>
					<source src={src} type={file.type} />
				</video>
			)}
			{!isUploading && (
				<button
					onClick={onRemoveClick}
					className='absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background transition-colors hover:bg-foreground/60'
				>
					<XIcon size={20} />
				</button>
			)}
		</div>
	)
}

export default AttachmentsPreview
