import { Media } from '@prisma/client'
import Image from 'next/image'

interface MediaPreviewProps {
	media: Media
}

const MediaPreview = ({ media }: MediaPreviewProps) => {
	if (media.type === 'IMAGE') {
		return (
			<Image
				src={media.url}
				alt='Attachment preview'
				className='max-h-[300px] size-fit object-cover rounded-2xl'
				width={500}
				height={500}
			/>
		)
	}
	if (media.type === 'VIDEO') {
		return (
			<video
				src={media.url}
				controls
				className='max-h-[300px] size-fit object-cover aspect-video rounded-2xl'
			/>
		)
	}

	return <p className='text-destructive'>Медиафайл не поддерживается</p>
}

export default MediaPreview
