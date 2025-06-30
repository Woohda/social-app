import { Attachment } from '@/hooks/use-mediaUpload'
import AttachmentsPreview from './AttachmentPreview'
import { cn } from '@/lib/utils'

interface AttachmentsPreviewsProps {
	attachment: Attachment[]
	onRemoveClick: (fileName: string) => void
}

const AttachmentsPreviews = ({
	attachment,
	onRemoveClick
}: AttachmentsPreviewsProps) => {
	return (
		<div className={cn('flex gap-2', !attachment.length && 'hidden')}>
			{attachment.map(attachment => (
				<AttachmentsPreview
					key={attachment.file.name}
					attachment={attachment}
					onRemoveClick={() => onRemoveClick(attachment.file.name)}
				/>
			))}
		</div>
	)
}

export default AttachmentsPreviews
