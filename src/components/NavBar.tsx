import UserButton from './UserButton'
import Link from 'next/link'

const NavBar = () => {
	return (
		<header className='sticky top-0 z-10 bg-card shadow-sm'>
			<nav className='max-w-7xl mx-auto flex items-center justify-center flex-wrap gap-5 px-5 py-3'>
				<Link href='/' className='text-2xl font-bold text-primary'>
					Home
				</Link>
				<UserButton />
			</nav>
		</header>
	)
}

export default NavBar
