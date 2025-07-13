import { NextRequest } from 'next/server'
import { createSession, createSessionCookie, google } from '@/auth'
import { cookies } from 'next/headers'
import kyInstance from '@/lib/ky'
import prisma from '@/lib/prisma'
import { generateIdFromEntropySize } from 'lucia'
import { slugify } from '@/lib/utils'
import { streamServerClient } from '@/lib/stream'
import { OAuth2RequestError } from 'arctic'

export async function GET(req: NextRequest) {
	const code = req.nextUrl.searchParams.get('code')
	const state = req.nextUrl.searchParams.get('state')
	const cookieStore = await cookies()
	const storedState = cookieStore.get('google_oauth_state')?.value ?? null
	const codeVerifier = cookieStore.get('google_code_verifier')?.value ?? null
	if (
		code === null ||
		state === null ||
		storedState === null ||
		codeVerifier === null
	) {
		return new Response(null, {
			status: 400
		})
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400
		})
	}

	try {
		const tokens = await google.validateAuthorizationCode(code, codeVerifier)

		const googleUser = await kyInstance
			.get('https://www.googleapis.com/oauth2/v2/userinfo', {
				headers: {
					Authorization: `Bearer ${tokens.accessToken()}`
				}
			})
			.json<{ id: string; name: string; email: string }>()

		// проверяем, существует ли пользователь
		const existingUser = await prisma.user.findUnique({
			where: {
				googleId: googleUser.id
			}
		})
		if (existingUser) {
			// создаем сессию
			const session = await createSession(existingUser.id)
			// создаем куки сессии
			await createSessionCookie(session)

			return new Response(null, {
				status: 302,
				headers: {
					Location: '/'
				}
			})
		}

		// генерируем id пользователя
		const userId = generateIdFromEntropySize(10)
		// создаем username
		const username = slugify(googleUser.name) + '-' + userId.slice(0, 4)

		// создаем пользователя
		await prisma.$transaction(async tx => {
			await tx.user.create({
				data: {
					id: userId,
					googleId: googleUser.id,
					username,
					name: googleUser.name,
					email: googleUser.email
				}
			})
			await streamServerClient.upsertUser({
				id: userId,
				username,
				name: googleUser.name
			})
		})
		// создаем сессию
		const session = await createSession(userId)
		// создаем куки сессии
		await createSessionCookie(session)

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		})
	} catch (error) {
		console.error(error)
		if (error instanceof OAuth2RequestError) {
			return new Response(null, {
				status: 400
			})
		}

		return new Response(null, {
			status: 500
		})
	}
}
