import NavBar from '@/widgets/NavBar'
import MenuBar from '@/widgets/MenuBar'
import TrendsSidebar from '@/widgets/TrendsSidebar'

export default function Layout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className='flex flex-col min-h-screen'>
			<NavBar />
			<div className='mx-auto max-w-7xl flex w-full grow gap-5 p-5'>
				<MenuBar className='sticky top-[5.25rem] hidden h-fit sm:block flex-none space-y-3 rounded-2xl bg-card py-5 px-3 shadow-sm' />
				{children}
				<TrendsSidebar />
			</div>
			<MenuBar className='sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden' />
		</div>
	)
}
