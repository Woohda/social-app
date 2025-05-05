'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpSchema, SignUpValues } from '@/lib/validation'
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
import { signUp } from './actions'
import PasswordInput from '@/components/passwordInput'
import LoadingButton from '@/components/loadingButton'

export default function SignUpForm() {
	const [isPending, startTransition] = useTransition()
	const [error, setError] = useState<string>()

	const form = useForm<SignUpValues>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: '',
			name: '',
			username: '',
			password: ''
		}
	})
	async function onSubmit(values: SignUpValues) {
		setError(undefined)
		startTransition(async () => {
			const { error } = await signUp(values)
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
							<FormLabel>Почта:</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='Напишите адрес вашей почты'
									type='email'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ваше имя:</FormLabel>
							<FormControl>
								<Input {...field} placeholder='Напишите ваше имя' type='text' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='username'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Имя пользователя:</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='Придумаете имя пользователя'
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
					Создать аккаунт
				</LoadingButton>
				{error && (
					<p className='text-center text-sm text-destructive'>{error}</p>
				)}
			</form>
		</Form>
	)
}
