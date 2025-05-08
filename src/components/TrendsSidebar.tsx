import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import { userDataSelect } from '@/lib/types'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import UserAvatar from './UserAvatar'
import { Button } from './ui/button'

const TrendsSidebar = () => {
	return (
		<div className='sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80'>
			<Suspense fallback={<Loader2 className='mx-auto animate-spin' />}>
				<WhoToFollow />
			</Suspense>
		</div>
	)
}

const WhoToFollow = async () => {
	const { user } = await validateRequest()
	if (!user) return null

	const usersFollowed = await prisma.user.findMany({
		where: {
			NOT: {
				id: user.id
			}
		},
		select: userDataSelect,
		take: 5
	})

	return (
		<div className='flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm'>
			<h2 className='text-lg font-bold'>Возможно, вам понравится</h2>
			{usersFollowed.map(user => (
				<div key={user.id} className='flex items-center justify-between gap-3'>
					<Link
						href={`/users/${user.username}`}
						className='flex items-center gap-3'
					>
						<UserAvatar avatarUrl={user.avatarUrl} className='flex-none' />
						<div className='flex flex-col'>
							<p className='text-sm font-semibold text-foreground'>
								{user.name}
							</p>
							<p className='text-sm text-muted-foreground'>@{user.username}</p>
						</div>
					</Link>
					<Button>Подписаться</Button>
				</div>
			))}
		</div>
	)
}

export default TrendsSidebar
