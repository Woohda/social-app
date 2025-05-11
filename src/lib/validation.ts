import { z } from 'zod'

// Задаем схему валидации для формы регистрации
const requiredString = z
	.string()
	.trim()
	.min(1, 'Поле обязательно для заполнения')

// Задаем схему валидации для формы регистрации
export const signUpSchema = z.object({
	email: requiredString.email('Введите корректный email'),
	name: requiredString,
	username: requiredString
		.min(3, 'Имя пользователя должно содержать минимум 3 символа')
		.regex(
			/^[a-zA-Z0-9_]+$/,
			'Имя пользователя может содержать только латинские буквы, цифры и символ _'
		),
	password: requiredString
		.min(8, 'Пароль должен содержать минимум 8 символов')
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
			'Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву, одну цифру и один специальный символ'
		)
})

export type SignUpValues = z.infer<typeof signUpSchema>

// Задаем схему валидации для формы входа
export const loginSchema = z.object({
	user: requiredString,
	password: requiredString
})

export type LoginValues = z.infer<typeof loginSchema>

// Задаем схему валидации для поста
export const createPostSchema = z.object({
	content: requiredString
})
