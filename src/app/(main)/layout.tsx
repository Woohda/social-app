import { validateRequest } from '@/auth'
import { redirect } from 'next/navigation'
import SessionProvider from './SessionProvider'
import NavBar from '@/components/NavBar'

export default async function Layout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	const session = await validateRequest()
	if (!session.user) {
		redirect('/login')
	}
	return (
		<SessionProvider value={session}>
			<div className='flex flex-col min-h-screen'>
				<NavBar />
				<div className='mx-auto max-w-7xl p-5'>{children}</div>
			</div>
		</SessionProvider>
	)
}
