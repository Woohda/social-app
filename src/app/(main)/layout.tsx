import { validateRequest } from '@/auth'
import { redirect } from 'next/navigation'
import SessionProvider from './SessionProvider'
import NavBar from '@/components/NavBar'
import MenuBar from '@/components/MenuBar'

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
				<div className='mx-auto flex w-full grow gap-5 px-5'>
					<MenuBar className='sticky top-[5.25rem] hidden h-fit sm:block flex-none space-y-3 rounded-2xl bg-card py-5 px-3 shadow-sm ' />
					{children}
				</div>
			</div>
		</SessionProvider>
	)
}
