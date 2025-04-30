import Link from 'next/link'
import type { Metadata } from 'next/types'
import SignUpForm from './signUpForm'

export const metadata: Metadata = {
	title: 'Регистрация'
}

export default function Page() {
	return (
		<section className='flex h-screen items-center justify-center p-5'>
			<div className='flex h-full max-h-[40rem] w-full max-w-[40rem] flex-col items-center justify-center rounded-lg bg-card shadow-lg'>
				<h1 className='text-3xl font-bold'>Sign Up</h1>
				<p className='text-sm text-muted-foreground'>
					Болтовня - это социальная сеть для твоей болтовни. <br />
					Место где ты можешь болтать с друзьями и знакомиться с новыми людьми!
				</p>
				<SignUpForm />
				<Link href='/login' className='text-sm text-muted-foreground'>
					Уже есть аккаунт? Войти
				</Link>
			</div>
		</section>
	)
}
