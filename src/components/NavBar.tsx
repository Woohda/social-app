'use client'
import SearchField from './SearchField'
import UserButton from './UserButton'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const NavBar = () => {
	const ThemeButtonNoSSR = dynamic(() => import('./ThemeButton'), {
		ssr: false
	})
	return (
		<header className='sticky top-0 z-10 bg-card shadow-sm'>
			<nav className='mx-auto max-w-7xl flex items-center justify-around flex-wrap gap-5 py-3 px-5'>
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
