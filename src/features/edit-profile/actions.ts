'use server'

import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import { streamServerClient } from '@/lib/stream'
import { getUserDataSelect } from '@/lib/types'
import {
	updateUserProfileSchema,
	UpdateUserProfileValues
} from '@/lib/validation'

/**
 * Функция @function updateUserProfile обновляет профиль пользователя в базе данных
 * Она принимает объект values, который содержит обновленные данные профиля пользователя
 * и возвращает обновленный объект профиля пользователя
 *
 * @param {UpdateUserProfileValues} values - Объект с обновленными данными профиля пользователя
 * @returns {Promise<User>} Обновленный объект профиля пользователя
 */

export async function updateUserProfile(values: UpdateUserProfileValues) {
	const validatedValues = updateUserProfileSchema.parse(values)

	const { user } = await validateRequest()
	if (!user) {
		throw new Error('Вы не авторизованы')
	}

	const updatedUser = await prisma.$transaction(async tx => {
		const updatedUser = await tx.user.update({
			where: { id: user.id },
			data: validatedValues,
			select: getUserDataSelect(user.id)
		})
		await streamServerClient.partialUpdateUser({
			id: user.id,
			set: { name: validatedValues.name }
		})
		return updatedUser
	})

	return updatedUser
}
