import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNowStrict } from 'date-fns'

/**
 * Это файл с утилитами, которые используются в приложении.
 * Здесь находятся функции, которые помогают в работе с данными и стилями.
 * @property {cn} cn - Функция для объединения классов CSS с использованием clsx и tailwind-merge.
 * @returns {string} - Объединенные классы CSS.
 * @property {formatRelativeDate} formatRelativeDate - Функция для форматирования даты в относительном формате.
 * @param {Date} date - Дата, которую нужно отформатировать.
 * @returns {string} - Отформатированная дата в относительном формате.
 * @property {formatNumber} formatNumber - Функция для форматирования числа в компактный вид с использованием Intl.NumberFormat.
 * @param {number} num - Число, которое нужно отформатировать.
 * @returns {string} - Отформатированное число в компактном виде.
 */

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

export function formatNumber(num: number) {
	return Intl.NumberFormat('ru-RU', {
		notation: 'compact',
		maximumFractionDigits: 1
	}).format(num)
}
