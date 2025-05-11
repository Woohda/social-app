import ky from 'ky'

/**
 * Эта функция позволяет парсить JSON-ответы от сервера, преобразуя строки с датами в объекты Date.
 * Это полезно для работы с данными, которые содержат даты в формате ISO 8601.
 */

const kyInstance = ky.create({
	parseJson: text =>
		JSON.parse(text, (key, value) => {
			if (key.endsWith('At') && typeof value === 'string') {
				return new Date(value)
			}
			return value
		})
})

export default kyInstance
