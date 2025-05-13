'use server'

import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import { postDataInclude } from '@/lib/types'
import { createPostSchema } from '@/lib/validation'

export async function submitPost(post: string) {
	const { user } = await validateRequest()
	if (!user) {
		throw new Error('Вы не авторизованы')
	}

	const { content } = createPostSchema.parse({
		content: post
	})

	const newPost = await prisma.post.create({
		data: {
			content,
			userId: user.id
		},
		include: postDataInclude
	})

	return newPost
}
