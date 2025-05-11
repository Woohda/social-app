import { SessionContext } from '@/app/(main)/SessionProvider'
import { useContext } from 'react'

/**
 * Пользовательский хук, который предоставляет доступ к контексту сессии.
 *
 * Этот хук должен использоваться внутри компонента SessionProvider, так как он зависит от контекста SessionContext.
 * Если он используется вне компонента SessionProvider, то будет выброшено исключение.
 *
 * @returns {SessionContext} Текущий контекст сессии, содержащий информацию о сессии и пользователе.
 * @throws {Error} Если хук используется вне компонента SessionProvider.
 */

function useSession() {
	const context = useContext(SessionContext)
	if (!context) {
		throw new Error('useSession должен использоваться внутри SessionProvider')
	}
	return context
}

export default useSession
