'use client'

import SearchField from '@/components/input/SearchField'
import Link from 'next/link'
import Image from 'next/image'
import UserButton from '@/components/user/UserButton'
import logo from '@/assets/logo.png'
import ThemeButton from '@/components/button/ThemeButton'

const NavBar = () => {
	return (
		<header className='sticky top-0 z-50 w-full border-b bg-card shadow-sm'>
			<nav className='mx-auto max-w-7xl flex items-center flex-wrap gap-5 py-3 px-5'>
				<Link
					href='/'
					className='text-xl font-bold text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
				>
					<Image
						src={logo}
						alt='Logo'
						width={60}
						priority
						className='aspect-auto h-fit flex-none object-cover '
					/>
				</Link>
				<SearchField />
				<UserButton className='sm:ms-auto' />
				<ThemeButton />
			</nav>
		</header>
	)
}

export default NavBar
