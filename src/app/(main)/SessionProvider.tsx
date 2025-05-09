'use client'

import { Session, User } from 'lucia'
import React, { createContext } from 'react'

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
