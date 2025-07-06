'use client'

import { useRouter } from 'next/navigation'
import { Input } from '../ui/input'
import { SearchIcon } from 'lucide-react'

const SearchField = () => {
	const router = useRouter()
	const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const formData = event.currentTarget
		const searchQuery = (formData.search as HTMLInputElement).value.trim()
		if (!searchQuery) return
		router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
	}
	return (
		<form
			onSubmit={handleSearch}
			aria-label='Поиск'
			action='/search'
			method='get'
			className='flex w-full max-w-52 items-center space-x-2'
		>
			<div className='relative'>
				<Input name='search' placeholder='Поиск' className='pe-10' />
				<SearchIcon className='absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground' />
			</div>
		</form>
	)
}

export default SearchField
