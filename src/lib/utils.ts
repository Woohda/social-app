import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNowStrict } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatRelativeDate(date: Date) {
	const currentDate = new Date()
	if (currentDate.getTime() - date.getTime() < 24 * 60 * 60 * 1000) {
		return formatDistanceToNowStrict(date, {
			addSuffix: true
		})
	} else {
		if (currentDate.getFullYear() === date.getFullYear()) {
			return format(date, 'd MMM')
		} else {
			return format(date, 'd MMM, yyyy')
		}
	}
}
