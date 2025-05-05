'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginValues } from '@/lib/validation'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useState, useTransition } from 'react'
import { login } from './actions'
import LoadingButton from '@/components/loadingButton'
import { PasswordInput } from '@/components/passwordInput'

export default function LoginForm() {
	const [isPending, startTransition] = useTransition()
	const [error, setError] = useState<string>()

	const form = useForm<LoginValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	})
	async function onSubmit(values: LoginValues) {
		setError(undefined)
		startTransition(async () => {
			const { error } = await login(values)
			if (error) {
				setError(error)
			}
		})
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex w-full flex-col items-center justify-center gap-3'
			>
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Почта/Логин:</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='Введите адрес почты или логин'
									type='text'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Пароль:</FormLabel>
							<FormControl>
								<PasswordInput {...field} placeholder='Придумаете пароль' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<LoadingButton
					loading={isPending}
					type='submit'
					className='w-full max-w-[15rem] mt-4 rounded-md bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/80'
				>
					Войти
				</LoadingButton>
				{error && (
					<p className='text-center text-sm text-destructive'>{error}</p>
				)}
			</form>
		</Form>
	)
}
