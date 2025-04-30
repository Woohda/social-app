import { PrismaAdapter } from '@lucia-auth/adapter-prisma'
import prisma from './lib/prisma'
import { Lucia, User, Session } from 'lucia'
import { cache } from 'react'
import { cookies } from 'next/headers'

const adapter = new PrismaAdapter(prisma.session, prisma.user)

interface DatabaseUserAttributes {
	id: string
	username: string
	avatarUrl: string | null
	googleId: string | null
	githubId: string | null
}

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
				const sessionCookie = lucia.createSessionCookie(result.session.id)
				;(await cookies()).set({
					name: sessionCookie.name,
					value: sessionCookie.value,
					...sessionCookie.attributes
				})
			}
			if (!result.session) {
				const sessionCookie = lucia.createBlankSessionCookie()
				;(await cookies()).set({
					name: sessionCookie.name,
					value: sessionCookie.value,
					...sessionCookie.attributes
				})
			}
		} catch {}
		return result
	}
)
