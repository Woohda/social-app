'use server'

import { checkUserExists, createSession, hashOptions } from '@/auth'
import { loginSchema, LoginValues } from '@/lib/validation'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { redirect } from 'next/navigation'
import { verify } from '@node-rs/argon2'

export async function login(
	credentials: LoginValues
): Promise<{ error: string }> {
	try {
		const { email, password } = loginSchema.parse(credentials)

		// проверяем, существует ли пользователь с таким email
		const existingUser = await checkUserExists(email)
		if (!existingUser || !existingUser.passwordHash) {
			return { error: 'Неверный логин или пароль' }
		}

		// проверяем, совпадает ли пароль
		const isPasswordValid = await verify(
			existingUser.passwordHash,
			password,
			hashOptions
		)
		if (!isPasswordValid) {
			return { error: 'Неверный логин или пароль' }
		}

		// создаем сессию
		await createSession(existingUser.id)

		return redirect('/')
	} catch (error) {
		if (isRedirectError(error)) throw error
		console.error('Ошибка регистрации:', error)
		return { error: 'Ошибка регистрации, попробуйте снова.' }
	}
}
