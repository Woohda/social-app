import Link from 'next/link'
import type { Metadata } from 'next/types'
import SignUpForm from './signUpForm'

export const metadata: Metadata = {
	title: 'Регистрация'
}

export default function Page() {
	return (
		<main className='flex h-screen items-center justify-center'>
			<div className='flex gap-4 w-full max-w-[30rem] p-10 flex-col items-center justify-center border-e border-solid rounded-3xl bg-card shadow-2xl'>
				<h1 className='text-3xl font-bold'>Регистрация</h1>
				<p className='text-xs text-center text-muted-foreground'>
					Болтовня - это социальная сеть для твоей болтовни. <br />
					Место где ты можешь болтать с друзьями и знакомиться с новыми людьми!
				</p>
				<SignUpForm />
				<span className='text-xs text-muted-foreground'>
					Уже есть аккаунт?{' '}
					<Link href='/login' className='hover:text-primary hover:underline'>
						Войти
					</Link>
				</span>
			</div>
		</main>
	)
}
