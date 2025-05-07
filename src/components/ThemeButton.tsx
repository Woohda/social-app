'use client'

import { useTheme } from 'next-themes'
import { Switch } from './ui/switch'
import { MoonIcon, SunIcon } from 'lucide-react'

const ThemeButton = () => {
	const { theme, setTheme } = useTheme()

	return (
		<div className='flex items-center relative'>
			{theme === 'light' && (
				<SunIcon className='mr-2 size-4 absolute left-[3.5px] z-10 stroke-orange-400' />
			)}
			<Switch
				checked={theme === 'dark'}
				onCheckedChange={checked => setTheme(checked ? 'dark' : 'light')}
				aria-label='Toggle theme'
			/>
			{theme === 'dark' && (
				<MoonIcon className='mr-2 size-4 absolute right-[-4px] z-10' />
			)}
		</div>
	)
}

export default ThemeButton
