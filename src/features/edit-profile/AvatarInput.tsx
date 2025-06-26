import { StaticImageData } from 'next/image'
import { useRef, useState } from 'react'
import Image from 'next/image'
import { CameraIcon } from 'lucide-react'
import CropImageDialog from './CropImageDialog'
import Resizer from 'react-image-file-resizer'

interface AvatarInputProps {
	src: string | StaticImageData
	onImageCropped: (blob: Blob | null) => void
}

const AvatarInput = ({ src, onImageCropped }: AvatarInputProps) => {
	const [imageToCrop, setImageToCrop] = useState<File>()

	const fileInputRef = useRef<HTMLInputElement>(null)

	function onImageSelected(image: File | undefined) {
		if (!image) return
		Resizer.imageFileResizer(
			image,
			1024,
			1024,
			'WEBP',
			100,
			0,
			uri => {
				setImageToCrop(uri as File)
			},
			'file'
		)
	}
	return (
		<>
			<input
				type='file'
				accept='image/*'
				ref={fileInputRef}
				onChange={e => onImageSelected(e.target.files?.[0])}
				className='hidden sr-only'
			/>
			<button
				type='button'
				onClick={() => fileInputRef.current?.click()}
				className='group relative block border border-transparent rounded-full hover:border-primary transition-colors duration-200'
			>
				<Image
					src={src}
					alt='avatar preview'
					width={150}
					height={150}
					className='aspect-auto flex-none rounded-full object-cover '
				/>
				<span className='absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-black/30 text-white transition-colors duration-200 group-hover:bg-opacity-25'>
					<CameraIcon size={24} />
				</span>
			</button>
			{imageToCrop && (
				<CropImageDialog
					src={URL.createObjectURL(imageToCrop)}
					cropAspectRatio={1}
					onCropped={onImageCropped}
					onClose={() => {
						setImageToCrop(undefined)
						if (fileInputRef.current) {
							fileInputRef.current.value = ''
						}
					}}
				/>
			)}
		</>
	)
}

export default AvatarInput
