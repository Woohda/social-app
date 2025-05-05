import { PrismaAdapter } from '@lucia-auth/adapter-prisma'
import prisma from './lib/prisma'
import { Lucia, User, Session } from 'lucia'
import { cache } from 'react'
import { cookies } from 'next/headers'

const adapter = new PrismaAdapter(prisma.session, prisma.user)

interface DatabaseUserAttributes {
	id: number
	username: string
	avatarUrl: string | null
	googleId: string | null
	githubId: string | null
}

// создаем экземпляр Lucia и передаем ему адаптер
export const lucia = new Lucia(adapter, {
	sessionCookie: {
		expires: false,
		attributes: {
			secure: process.env.NODE_ENV === 'production'
		}
	},
	getUserAttributes(databaseUserAttributes) {
		return {
			id: databaseUserAttributes.id,
			username: databaseUserAttributes.username,
			avatar: databaseUserAttributes.avatarUrl,
			googleId: databaseUserAttributes.googleId,
			githubId: databaseUserAttributes.githubId
		}
	}
})

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia
		DatabaseUserAttributes: DatabaseUserAttributes
	}
}

// Функция для создания сессии пользователя
export const createSession = async (userId: number) => {
	return await lucia.createSession(String(userId), {
		activePeriod: 60 * 60 * 24 * 3 // 3 дня
	})
}

// Функция для создания новой куки
export const createNewSessionCookie = async () => {
	const sessionCookie = lucia.createBlankSessionCookie()
	;(await cookies()).set({
		name: sessionCookie.name,
		value: sessionCookie.value,
		...sessionCookie.attributes
	})
}

// Функция для обновления куки
export const createSessionCookie = async (session: Session) => {
	const sessionCookie = lucia.createSessionCookie(session.id)
	;(await cookies()).set({
		name: sessionCookie.name,
		value: sessionCookie.value,
		...sessionCookie.attributes
	})
}

// Функция проверяет, существует ли куки с сессией и валидирует ее
export const validateRequest = cache(
	async (): Promise<
		{ user: User; session: Session } | { user: null; session: null }
	> => {
		const sessionId =
			(await cookies()).get(lucia.sessionCookieName)?.value ?? null

		if (!sessionId) {
			return { user: null, session: null }
		}

		const result = await lucia.validateSession(sessionId)

		try {
			if (result.session && result.session.fresh) {
				// обновляем куки сессии
				createSessionCookie(result.session)
			}
			if (!result.session) {
				// если сессия не валидна, создаем новую куку
				createNewSessionCookie()
			}
		} catch {}
		return result
	}
)

// Функция для провеки существования пользователя
export const checkUserExists = (username: string) => {
	return prisma.user.findFirst({
		where: {
			username: {
				equals: username,
				mode: 'insensitive' // игнорируем регистр
			}
		}
	})
}

// Настройки хеширования пароля
export const hashOptions = {
	memoryCost: 19456,
	timeCost: 2,
	parallelism: 1,
	outputLen: 32
}
