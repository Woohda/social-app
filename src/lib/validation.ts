import { z } from 'zod'

/**
 * Модуль валидации данных с использованием библиотеки Zod.
 * Этот модуль содержит схемы валидации для различных форм, таких как регистрация, вход и создание постов.
 * Он позволяет проверять данные на соответствие заданным критериям и обеспечивает безопасность
 * и корректность данных, поступающих в приложение.
 *
 * @property {requiredString} - валидация для обязательной строки.
 * @property {signUpSchema} - Схема валидации для формы регистрации.
 * @type {SignUpValues} - Тип для значений формы регистрации.
 * @property {loginSchema} - Схема валидации для формы входа.
 * @type {LoginValues} - Тип для значений формы входа.
 * @property {createPostSchema} - Схема валидации для создания поста.
 */

const requiredString = z
	.string()
	.trim()
	.min(1, 'Поле обязательно для заполнения')

export const signUpSchema = z.object({
	email: requiredString.email('Введите корректный email'),
	name: requiredString.max(30, 'Имя не должно превышать 30 символов'),
	username: requiredString
		.min(3, 'Имя пользователя должно содержать минимум 3 символа')
		.regex(
			/^[a-zA-Z0-9_]+$/,
			'Имя пользователя может содержать только латинские буквы, цифры и символ _'
		)
		.transform(val => val.toLowerCase()),
	password: requiredString
		.min(8, 'Пароль должен содержать минимум 8 символов')
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
			'Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву, одну цифру и один специальный символ'
		)
})

export type SignUpValues = z.infer<typeof signUpSchema>

export const loginSchema = z.object({
	user: requiredString,
	password: requiredString
})

export type LoginValues = z.infer<typeof loginSchema>

export const createPostSchema = z.object({
	content: requiredString,
	mediaIds: z.array(z.string()).max(5, 'Максимум 5 медиафайлов').optional()
})

export const updateUserProfileSchema = z.object({
	name: requiredString.max(30, 'Имя не должно превышать 30 символов'),
	bio: z.string().trim().max(150, 'Биография не должна превышать 150 символов')
})

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>
