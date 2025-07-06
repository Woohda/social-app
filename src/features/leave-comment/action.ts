'use server'

import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import { getCommentDataInclude, PostData } from '@/lib/types'
import { createCommentSchema } from '@/lib/validation'

/**
 * Функция @function createComment создает новый комментарий к посту.
 * Он выполняет следующие действия:
 * 1. Проверяет авторизацию пользователя.
 * 2. Валидирует содержимое комментария с помощью схемы валидации.
 * 3. Создает новый комментарий к посту в базе данных с указанием пользователя, который его создал.
 * 4. Возвращает созданный комментарий с включением данных о пользователе и других связанных сущностях.
 *
 * Функция @function deleteComment удаляет комментарий к посту из базы данных.
 * Он выполняет следующие действия:
 * 1. Проверяет авторизацию пользователя.
 * 2. Находит комментарий по идентификатору.
 * 3. Проверяет, что пользователь является владельцем комментария.
 * 4. Удаляет комментарий к посту из базы данных и возвращает удаленный комментарий с включением данных о пользователе и других связанных сущностях.
 *
 */
export async function createComment(comment: {
	content: string
	post: PostData
}) {
	const { user } = await validateRequest()
	if (!user) {
		throw new Error('Вы не авторизованы')
	}

	const { content: contentValidated } = createCommentSchema.parse({
		content: comment.content
	})

	const newComment = await prisma.comment.create({
		data: {
			content: contentValidated,
			userId: user.id,
			postId: comment.post.id
		},
		include: getCommentDataInclude(user.id)
	})

	return newComment
}

export async function deleteComment(id: string) {
	const { user } = await validateRequest()
	if (!user) {
		throw new Error('Вы не авторизованы')
	}

	const сomment = await prisma.comment.findUnique({
		where: { id }
	})

	if (!сomment) throw new Error('Комментарий не найден')

	if (сomment.userId !== user.id)
		throw new Error('Вы не можете удалить этот комментарий')

	const deletedСomment = await prisma.comment.delete({
		where: { id },
		include: getCommentDataInclude(user.id)
	})

	return deletedСomment
}
