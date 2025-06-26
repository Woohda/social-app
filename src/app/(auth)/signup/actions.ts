'use server'

import {
	checkUserExists,
	createSession,
	createSessionCookie,
	hashOptions
} from '@/auth'
import prisma from '@/lib/prisma'
import { SignUpValues, signUpSchema } from '@/lib/validation'
import { hash } from '@node-rs/argon2'
import { generateIdFromEntropySize } from 'lucia'
import { redirect } from 'next/navigation'
import { isRedirectError } from 'next/dist/client/components/redirect'

export async function signUp(
	credentials: SignUpValues
): Promise<{ error: string }> {
	try {
		const { email, name, username, password } = signUpSchema.parse(credentials)

		// проверяем, существует ли пользователь с таким email
		const existingUser = await checkUserExists(email)

		if (existingUser) {
			return {
				error: `Пользователь с таким email уже существует`
			}
		}

		// проверяем, существует ли пользователь с таким username
		const existingUsername = await checkUserExists(username)
		if (existingUsername) {
			return {
				error: `Пользователь с таким username уже существует`
			}
		}

		// хешируем пароль
		const passwordHash = await hash(password, hashOptions)

		// генерируем id пользователя
		const userId = generateIdFromEntropySize(10)

		// создаем пользователя
		await prisma.user.create({
			data: {
				id: userId,
				email,
				username,
				passwordHash,
				name
			}
		})

		// создаем сессию
		const session = await createSession(userId)

		// создаем куки сессии
		await createSessionCookie(session)

		return redirect('/')
	} catch (error) {
		if (isRedirectError(error)) throw error
		console.error('Ошибка регистрации:', error)
		return { error: 'Ошибка регистрации, попробуйте снова.' }
	}
}
