import Link from 'next/link'
import type { Metadata } from 'next/types'
import LoginForm from './loginForm'

export const metadata: Metadata = {
	title: 'Вход'
}

export default function Page() {
	return (
		<main className='flex h-screen items-center justify-center'>
			<div className='flex gap-4 w-full max-w-[25rem] p-10 flex-col items-center justify-center border-e border-solid rounded-3xl bg-card shadow-2xl'>
				<h1 className='text-3xl font-bold'>Войти в аккаунт</h1>
				<LoginForm />
				<span className='text-xs text-muted-foreground'>
					У тебя нет аккаунта?{' '}
					<Link
						href='/signup'
						className='hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
					>
						Зарегистрироваться
					</Link>
				</span>
			</div>
		</main>
	)
}
