'use client'

import SearchField from '@/components/SearchField'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import UserButton from '@/components/UserButton'

const NavBar = () => {
	const ThemeButtonNoSSR = dynamic(() => import('@/components/ThemeButton'), {
		ssr: false
	})
	return (
		<header className='sticky top-0 z-50 w-full border-b bg-card shadow-sm'>
			<nav className='mx-auto max-w-7xl flex items-center flex-wrap gap-5 py-3 px-5'>
				<Link href='/' className='text-2xl font-bold text-primary'>
					Home
				</Link>
				<SearchField />
				<UserButton className='sm:ms-auto' />
				<ThemeButtonNoSSR />
			</nav>
		</header>
	)
}

export default NavBar
