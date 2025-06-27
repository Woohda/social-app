import { PrismaAdapter } from '@lucia-auth/adapter-prisma'
import prisma from './lib/prisma'
import { Lucia, User, Session } from 'lucia'
import { cache } from 'react'
import { cookies } from 'next/headers'

/**
 * Этот файл содержит функции и настройки для работы с аутентификацией пользователей
 * с использованием библиотеки Lucia и Prisma.
 * Он включает в себя создание адаптера для работы с базой данных,
 * создание экземпляра Lucia, функции для проверки и создания сессий пользователей,
 * а также функции для работы с куками сессий.
 * @property {PrismaAdapter} adapter - Адаптер для работы с базой данных Prisma.
 * @property {DatabaseUserAttributes} DatabaseUserAttributes - Интерфейс для атрибутов пользователя в базе данных.
 * @property {lucia} lucia - Экземпляр Lucia для работы с аутентификацией.
 * @property {createSession} createSession - Функция для проверки и создания сессии пользователя.
 * @property {createNewSessionCookie} createNewSessionCookie - Функция для создания новой куки сессии.
 * @property {createSessionCookie} createSessionCookie - Функция для обновления куки сессии.
 * @property {validateRequest} validateRequest - Функция для проверки существования куки с сессией и ее валидности.
 * @property {checkUserExists} checkUserExists - Функция для проверки существования пользователя в базе данных.
 * @property {hashOptions} hashOptions - Настройки хеширования пароля.
 */

const adapter = new PrismaAdapter(prisma.session, prisma.user)

interface DatabaseUserAttributes {
	id: string
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
			avatarUrl: databaseUserAttributes.avatarUrl,
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

export const createSession = async (userId: string) => {
	const existingSession = await prisma.session.findFirst({
		where: {
			userId: userId
		}
	})
	if (existingSession) {
		// Если сессия уже существует не создаем новую
		return {
			...existingSession,
			userId: existingSession.userId,
			id: existingSession.id,
			fresh: false
		}
	}
	// Если сессия не существует создаем новую
	const newSession = await lucia.createSession(userId, {
		activePeriod: 60 * 60 * 24 * 3 // 3 дня
	})
	return { ...newSession, fresh: true }
}

export const createNewSessionCookie = async () => {
	const sessionCookie = lucia.createBlankSessionCookie()
	;(await cookies()).set({
		name: sessionCookie.name,
		value: sessionCookie.value,
		...sessionCookie.attributes
	})
}

export const createSessionCookie = async (session: Session) => {
	const sessionCookie = lucia.createSessionCookie(session.id)
	;(await cookies()).set({
		name: sessionCookie.name,
		value: sessionCookie.value,
		...sessionCookie.attributes
	})
}

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

export const checkUserExists = (identifier: string) => {
	return prisma.user.findFirst({
		where: {
			OR: [
				{
					email: {
						equals: identifier,
						mode: 'insensitive' // игнорируем регистр
					}
				},
				{
					username: {
						equals: identifier,
						mode: 'insensitive' // игнорируем регистр
					}
				}
			]
		}
	})
}

export const hashOptions = {
	memoryCost: 19456,
	timeCost: 2,
	parallelism: 1,
	outputLen: 32
}
