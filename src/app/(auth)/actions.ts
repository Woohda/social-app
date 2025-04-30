'use server'

import { createNewSessionCookie, lucia, validateRequest } from '@/auth'
import { redirect } from 'next/navigation'

export async function logout() {
	const { session } = await validateRequest()

	if (!session) {
		throw new Error('Пользователь не авторизован')
	}
	await lucia.invalidateSession(session.id)

	createNewSessionCookie()

	return redirect('/login')
}
