'use client'

import { Session, User } from 'lucia'
import React, { createContext } from 'react'

/**
 * эта функция создает контекст для хранения информации о сессии
 * и пользователе, чтобы избежать передачи их через пропсы
 * SessionContext - это контекст, который будет хранить информацию о сессии
 * SessionProvider - это компонент, который будет оборачивать все приложение и передавать информацию о сессии
 * @param {Session} session - объект сессии
 * @param {User} user - объект пользователя
 * @returns {SessionContext} - объект контекста сессии
 */

interface SessionContext {
	session: Session | null
	user: User | null
}

export const SessionContext = createContext<SessionContext | null>(null)

export default function SessionProvider({
	children,
	value
}: React.PropsWithChildren<{ value: SessionContext }>) {
	return (
		<SessionContext.Provider value={value}>{children}</SessionContext.Provider>
	)
}
