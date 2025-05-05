'use server'

import {
	checkUserExists,
	createSession,
	createSessionCookie,
	hashOptions
} from '@/auth'
import { loginSchema, LoginValues } from '@/lib/validation'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { redirect } from 'next/navigation'
import { verify } from '@node-rs/argon2'

export async function login(
	credentials: LoginValues
): Promise<{ error: string }> {
	try {
		const { user, password } = loginSchema.parse(credentials)

		// проверяем, существует ли пользователь с таким email
		const existingUser = await checkUserExists(user)
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
		const session = await createSession(existingUser.id)

		// создаем куки сессии
		await createSessionCookie(session)

		return redirect('/')
	} catch (error) {
		if (isRedirectError(error)) throw error
		console.error('Ошибка входа:', error)
		return { error: 'Ошибка входа, попробуйте снова.' }
	}
}
