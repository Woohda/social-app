import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import { streamServerClient } from '@/lib/stream'
import { createUploadthing, FileRouter } from 'uploadthing/next'
import { UploadThingError, UTApi } from 'uploadthing/server'

const f = createUploadthing()

export const fileRouter = {
	avatar: f({
		image: { maxFileSize: '1MB', maxFileCount: 1 }
	})
		.middleware(async () => {
			const { user } = await validateRequest()
			if (!user) {
				throw new UploadThingError('Пользователь не авторизован')
			}
			return { user }
		})
		.onUploadComplete(async ({ metadata, file }) => {
			const oldAvatarUrl = metadata.user.avatarUrl
			if (oldAvatarUrl) {
				const key = oldAvatarUrl.split('f/').pop()
				await new UTApi().deleteFiles(key as string)
			}
			const newAvatarUrl = file.ufsUrl

			await Promise.all([
				await prisma.user.update({
					where: { id: metadata.user.id },
					data: { avatarUrl: newAvatarUrl }
				}),
				streamServerClient.partialUpdateUser({
					id: metadata.user.id,
					set: {
						image: newAvatarUrl
					}
				})
			])

			return { avatarUrl: newAvatarUrl }
		}),
	attachment: f({
		image: { maxFileSize: '4MB', maxFileCount: 5 },
		video: { maxFileSize: '64MB', maxFileCount: 5 }
	})
		.middleware(async () => {
			const { user } = await validateRequest()
			if (!user) {
				throw new UploadThingError('Пользователь не авторизован')
			}
			return { userId: user.id }
		})
		.onUploadComplete(async ({ file }) => {
			const media = await prisma.media.create({
				data: {
					url: file.ufsUrl,
					type: file.type.startsWith('image') ? 'IMAGE' : 'VIDEO'
				}
			})
			return {
				mediaId: media.id
			}
		})
} satisfies FileRouter

export type AppFileRouter = typeof fileRouter
