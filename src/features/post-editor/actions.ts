'use server'

import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import { getPostDataInclude } from '@/lib/types'
import { createPostSchema } from '@/lib/validation'

/**
 * Функция @function createPost создает новый пост в базе данных.
 * Он выполняет следующие действия:
 * 1. Проверяет авторизацию пользователя.
 * 2. Валидирует содержимое поста с помощью схемы валидации.
 * 3. Создает новый пост в базе данных с указанием пользователя, который его создал.
 * 4. Возвращает созданный пост с включением данных о пользователе и других связанных сущностях.
 *
 * Функция @function deletePost удаляет пост из базы данных.
 * Он выполняет следующие действия:
 * 1. Проверяет авторизацию пользователя.
 * 2. Находит пост по идентификатору.
 * 3. Проверяет, что пользователь является владельцем поста.
 * 4. Удаляет пост из базы данных и возвращает удаленный пост с включением данных о пользователе и других связанных сущностях.
 *
 */
export async function createPost(post: {
	content: string
	mediaIds?: string[]
}) {
	const { user } = await validateRequest()
	if (!user) {
		throw new Error('Вы не авторизованы')
	}

	const { content: contentValidated, mediaIds } = createPostSchema.parse(post)

	const newPost = await prisma.post.create({
		data: {
			content: contentValidated,
			userId: user.id,
			attachments: {
				connect: mediaIds?.map(id => ({ id }))
			}
		},
		include: getPostDataInclude(user.id)
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
		include: getPostDataInclude(user.id)
	})

	return deletedPost
}
