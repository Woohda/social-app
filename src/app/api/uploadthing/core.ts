import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
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
			await prisma.user.update({
				where: { id: metadata.user.id },
				data: { avatarUrl: newAvatarUrl }
			})
			return {
				avatarUrl: newAvatarUrl
			}
		})
} satisfies FileRouter

export type AppFileRouter = typeof fileRouter
