import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ThemeProvider } from 'next-themes'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import React from 'react'
import ReactQueryProvider from './ReactQueryProvider'
import { SessionProvider } from './(main)/SessionProvider'
import { validateRequest } from '@/auth'
import { redirect } from 'next/navigation'

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900'
})
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900'
})

export const metadata: Metadata = {
	title: {
		template: '%s | Болтовня',
		default: 'Болтовня'
	},
	description: 'Это социальная сеть для твоей болтовни'
}

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	const session = await validateRequest()
	if (!session.user) {
		redirect('/login')
	}
	return (
		<html lang='ru' suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}
			>
				<ReactQueryProvider>
					<ThemeProvider
						attribute='class'
						defaultTheme='system'
						enableSystem
						disableTransitionOnChange
					>
						<SessionProvider value={session}> {children}</SessionProvider>
					</ThemeProvider>
				</ReactQueryProvider>
				<Toaster />
			</body>
		</html>
	)
}
