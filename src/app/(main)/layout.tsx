import { validateRequest } from '@/auth'
import { redirect } from 'next/navigation'
import NavBar from '@/widgets/NavBar'
import ServerMenuBar from '@/widgets/menu-bar/ServerMenuBar'
import SessionProvider from './SessionProvider'

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
				<div className='mx-auto max-w-7xl flex w-full grow gap-5 p-5'>
					<ServerMenuBar className='sticky top-[5.25rem] hidden h-fit sm:block flex-none space-y-3 rounded-2xl bg-card py-4 px-4 shadow-sm' />
					{children}
				</div>
				<ServerMenuBar className='sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden text-lg' />
			</div>
		</SessionProvider>
	)
}
