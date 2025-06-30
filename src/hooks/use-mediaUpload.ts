import { useState } from 'react'
import { useToast } from './use-toast'
import { useUploadThing } from '@/lib/uploadthing'

/**
 * Кастомный хук для загрузки медиафайлов в базу данных
 * @property {attachments} - список загруженных медиафайлов
 * @property {isUploading}- флаг загрузки медиафайлов
 * @property {uploadProgress}- прогресс загрузки медиафайла
 *
 * @function useUploadThing - хук для загрузки медиафайлов в базу данных с помощью uploadthing
 * @function startUpload - функция для начала загрузки медиафайла, которая устанавливает флаг загрузки и добавляет медиафайл в список загруженных
 *
 * @method onBeforeUploadBegin - функция, которая вызывается перед началом загрузки медиафайла и переименовывает медиафайл
 * @method onUploadProgress - функция, которая вызывается при изменении прогресса загрузки медиафайла
 * @method onClientUploadComplete - функция, которая вызывается при завершении загрузки медиафайла
 *
 * @function handleStartUpload - функция для начала загрузки медиафайла с помощью хука useUploadThing
 * @function removeAttachment - функция для удаления медиафайла из списка загруженных
 * @function reset - функция для сброса списка загруженных медиафайлов
 *
 * @returns {useMediaUpload} - возвращает объект с функциями для загрузки медиафайлов и управления списком загруженных медиафайлов
 */

export interface Attachment {
	file: File
	mediaId?: string
	isUploading: boolean
}

export function useMediaUpload() {
	const { toast } = useToast()

	const [attachments, setAttachments] = useState<Attachment[]>([])

	const [uploadProgress, setUploadProgress] = useState<number>()

	const { startUpload, isUploading } = useUploadThing('attachment', {
		onBeforeUploadBegin: files => {
			const renamedFiles = files.map(file => {
				const extension = file.name.split('.').pop()
				return new File(
					[file],
					`attachment_${crypto.randomUUID}.${extension}`,
					{ type: file.type }
				)
			})
			setAttachments(prev => [
				...prev,
				...renamedFiles.map(file => ({ file, isUploading: true }))
			])
			return renamedFiles
		},
		onUploadProgress: setUploadProgress,
		onClientUploadComplete: res => {
			setAttachments(prev => {
				return prev.map(attachment => {
					const resultUpload = res.find(r => r.name === attachment.file.name)
					if (!resultUpload) {
						return attachment
					}
					return {
						...attachment,
						mediaId: resultUpload.serverData.mediaId,
						isUploading: false
					}
				})
			})
			toast({
				description: 'Файл успешно загружен'
			})
		},
		onUploadError: error => {
			setAttachments(prev => prev.filter(attachment => !attachment.isUploading))
			toast({
				description: error.message,
				variant: 'destructive'
			})
		}
	})

	function handleStartUpload(file: File[]) {
		if (isUploading) {
			toast({
				description: 'Пожалуйста, подождите, идет загрузка файла',
				variant: 'destructive'
			})
		}

		if (attachments.length + file.length > 5) {
			toast({
				description: 'Вы можете загрузить не более 5 файлов',
				variant: 'destructive'
			})
		}

		startUpload(file)
	}

	function removeAttachment(fileName: string) {
		setAttachments(prev =>
			prev.filter(attachment => attachment.file.name !== fileName)
		)
	}

	function resetMediaUploads() {
		setAttachments([])
		setUploadProgress(undefined)
	}

	return {
		startUpload: handleStartUpload,
		attachments,
		isUploading,
		uploadProgress,
		removeAttachment,
		resetMediaUploads
	}
}
