'use client'

import { useTheme } from 'next-themes'
import { MoonIcon, SunIcon } from 'lucide-react'

const ThemeButton = () => {
	const { theme, setTheme } = useTheme()

	return (
		<div className='flex items-center relative'>
			<button
				className='flex items-center justify-center border border-transparent rounded-full hover:border-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
				aria-label='Toggle theme'
				onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
			>
				{theme === 'light' ? (
					<SunIcon className='size-5 stroke-orange-400' />
				) : (
					<MoonIcon className='size-5 stroke-white' />
				)}
			</button>
		</div>
	)
}

export default ThemeButton
