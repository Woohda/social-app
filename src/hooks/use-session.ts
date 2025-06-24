import { SessionContext } from '@/app/(main)/SessionProvider'
import { useContext } from 'react'

/**
 * Кастомный хук useSession используется для получения контекста сессии
 * из SessionProvider. Он позволяет получить информацию о текущем пользователе,
 * аутентификации и других данных сессии.
 *
 * @returns {SessionContext} - возвращает контекст сессии, содержащий информацию о пользователе и аутентификации.
 * @throws {Error} - выбрасывает ошибку, если хук используется вне SessionProvider.
 */

function useSession() {
	const context = useContext(SessionContext)
	if (!context) {
		throw new Error('useSession должен использоваться внутри SessionProvider')
	}
	return context
}

export default useSession
