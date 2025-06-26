import { Button } from '@/components/ui/button'
import {
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Dialog } from '@radix-ui/react-dialog'
import { useRef } from 'react'
import { ReactCropperElement, Cropper } from 'react-cropper'
import 'cropperjs/dist/cropper.css'

interface CropImageDialogProps {
	src: string
	cropAspectRatio: number
	onCropped: (blob: Blob | null) => void
	onClose: () => void
}

const CropImageDialog = ({
	src,
	cropAspectRatio,
	onCropped,
	onClose
}: CropImageDialogProps) => {
	const croppedRef = useRef<ReactCropperElement>(null)

	function handleCrop() {
		const crop = croppedRef.current?.cropper
		if (!crop) return
		crop.getCroppedCanvas().toBlob(blob => (onCropped(blob), 'image/webp'))
		onClose()
	}
	return (
		<Dialog open onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Обрезать аватар</DialogTitle>
				</DialogHeader>
				<Cropper
					src={src}
					aspectRatio={cropAspectRatio}
					guides={false}
					ref={croppedRef}
					zoomable={false}
					className='mx-auto size-fit'
				/>
				<DialogFooter>
					<Button type='button' variant='secondary' onClick={onClose}>
						Отменить
					</Button>
					<Button type='submit' onClick={handleCrop}>
						Обрезать
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default CropImageDialog
