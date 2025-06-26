'use server'

import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import { getUserDataSelect } from '@/lib/types'
import {
	updateUserProfileSchema,
	UpdateUserProfileValues
} from '@/lib/validation'

export async function updateUserProfile(values: UpdateUserProfileValues) {
	const validatedValues = updateUserProfileSchema.parse(values)

	// проверяем, что пользователь авторизован
	const { user } = await validateRequest()
	if (!user) {
		throw new Error('Вы не авторизованы')
	}

	// обновляем профиль пользователя в базе данных
	const updatedUser = await prisma.user.update({
		where: { id: user.id },
		data: validatedValues,
		select: getUserDataSelect(user.id)
	})

	return updatedUser
}
