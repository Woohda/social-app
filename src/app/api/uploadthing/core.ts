import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import { createUploadthing, FileRouter } from 'uploadthing/next'

const f = createUploadthing()

export const fileRouter = {
	avatar: f({
		image: { maxFileSize: '1MB', maxFileCount: 1 }
	})
		.middleware(async () => {
			const { user } = await validateRequest()
			if (!user) {
				throw new Response('Пользователь не авторизован', { status: 401 })
			}
			return { user }
		})
		.onUploadComplete(async ({ metadata, file }) => {
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
