'use server'

import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import { createPostSchema } from '@/lib/validation'
import { revalidatePath } from 'next/cache'

export async function submitPost(post: string) {
	const { user } = await validateRequest()
	if (!user) {
		throw new Error('Вы не авторизованы')
	}

	const { content } = createPostSchema.parse({
		content: post
	})

	await prisma.post.create({
		data: {
			content,
			userId: user.id
		}
	})

	revalidatePath('')
}
