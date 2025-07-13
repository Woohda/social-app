import { NextRequest } from 'next/server'
import { createSession, createSessionCookie, github } from '@/auth'
import { cookies } from 'next/headers'
import kyInstance from '@/lib/ky'
import prisma from '@/lib/prisma'
import { generateIdFromEntropySize } from 'lucia'
import { streamServerClient } from '@/lib/stream'
import { OAuth2RequestError } from 'arctic'

export async function GET(req: NextRequest) {
	const code = req.nextUrl.searchParams.get('code')
	const state = req.nextUrl.searchParams.get('state')
	const cookieStore = await cookies()
	const storedState = cookieStore.get('github_oauth_state')?.value ?? null

	if (code === null || state === null || storedState === null) {
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
		const tokens = await github.validateAuthorizationCode(code)

		const githubUser = await kyInstance
			.get('https://api.github.com/user', {
				headers: {
					Authorization: `Bearer ${tokens.accessToken()}`
				}
			})
			.json<{ id: string; name: string; email: string; login: string }>()

		// проверяем, существует ли пользователь
		const existingUser = await prisma.user.findUnique({
			where: {
				githubId: githubUser.id.toString()
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

		// создаем пользователя
		await prisma.$transaction(async tx => {
			await tx.user.create({
				data: {
					id: userId,
					githubId: githubUser.id.toString(),
					username: githubUser.login.toLowerCase(),
					name: githubUser.name,
					email: githubUser.email ?? 'none'
				}
			})
			await streamServerClient.upsertUser({
				id: userId,
				username: githubUser.login.toLowerCase(),
				name: githubUser.name
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
