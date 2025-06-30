import { cn } from '@/lib/utils'
import { Media } from '@prisma/client'
import MediaPreview from './MediaPreview'

interface MediaPreviewsProps {
	attachments: Media[]
}

const MediaPreviews = ({ attachments }: MediaPreviewsProps) => {
	return (
		<div
			className={cn(
				'flex flex-wrap gap-3',
				!attachments.length && 'hidden'
				// attachments.length > 1 && 'grid grid-cols-2'
			)}
		>
			{attachments.map(attachment => (
				<MediaPreview key={attachment.id} media={attachment} />
			))}
		</div>
	)
}

export default MediaPreviews
