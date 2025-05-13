'use server'

import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import { postDataInclude } from '@/lib/types'
import { createPostSchema } from '@/lib/validation'

export async function createPost(post: string) {
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

export async function deletePost(id: string) {
	const { user } = await validateRequest()
	if (!user) {
		throw new Error('Вы не авторизованы')
	}

	const post = await prisma.post.findUnique({
		where: { id }
	})

	if (!post) throw new Error('Пост не найден')

	if (post.userId !== user.id) throw new Error('Вы не можете удалить этот пост')

	const deletedPost = await prisma.post.delete({
		where: { id },
		include: postDataInclude
	})

	return deletedPost
}
