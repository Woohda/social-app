'use server'

import { checkUserExists, createSession, hashOptions } from '@/auth'
import prisma from '@/lib/prisma'
import { SingUpValues, singUpSchema } from '@/lib/validation'
import { hash } from '@node-rs/argon2'
import { generateIdFromEntropySize } from 'lucia'
import { redirect } from 'next/navigation'
import { isRedirectError } from 'next/dist/client/components/redirect'

export async function signUp(
	credentials: SingUpValues
): Promise<{ error: string }> {
	try {
		const { email, username, password } = singUpSchema.parse(credentials)
		// генерируем id пользователя
		const userId = generateIdFromEntropySize(10)

		// проверяем, существует ли пользователь с таким именем
		const existingUser = await checkUserExists(username)
		if (existingUser) {
			return { error: 'Пользователь с таким username уже существует' }
		}

		// проверяем, существует ли пользователь с таким email
		const existingEmail = await checkUserExists(email)
		if (existingEmail) {
			return { error: 'Пользователь с таким email уже существует' }
		}

		// хешируем пароль
		const passwordHash = await hash(password, hashOptions)

		// создаем пользователя
		await prisma.user.create({
			data: {
				id: userId,
				email,
				username,
				passwordHash,
				createdAt: new Date(),
				updatedAt: new Date()
			}
		})

		// создаем сессию
		await createSession(userId)

		return redirect('/')
	} catch (error) {
		if (isRedirectError(error)) throw error
		console.error('Ошибка регистрации:', error)
		return { error: 'Ошибка регистрации, попробуйте снова.' }
	}
}
