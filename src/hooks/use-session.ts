import { SessionContext } from '@/app/(main)/SessionProvider'
import { useContext } from 'react'

function useSession() {
	const context = useContext(SessionContext)
	if (!context) {
		throw new Error('useSession должен использоваться внутри SessionProvider')
	}
	return context
}

export default useSession
