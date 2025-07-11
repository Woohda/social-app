import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay: number = 250) {
	const [debouncedValue, setDebouncedValue] = useState<T>()

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)

		return () => clearTimeout(handler)
	}, [value, delay])

	return debouncedValue
}
