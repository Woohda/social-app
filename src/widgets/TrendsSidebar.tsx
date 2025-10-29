import { validateRequest } from '@/auth'
import UserAvatar from '@/components/user/UserAvatar'
import prisma from '@/lib/prisma'
import { formatNumber } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { unstable_cache } from 'next/cache'
import FollowButton from '@/components/button/FollowButton'
import { getUserDataSelect } from '@/lib/types'
import UserTooltip from '@/features/UserTooltip'

const TrendsSidebar = () => {
	return (
		<div className='sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80'>
			<Suspense fallback={<Loader2 className='mx-auto animate-spin' />}>
				<WhoToFollow />
				<TrendsTopics />
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
			},
			followers: {
				none: {
					followerId: user.id
				}
			}
		},
		select: getUserDataSelect(user.id),
		take: 5
	})

	return (
		<article className='flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm'>
			<h2 className='text-lg font-bold'>Возможно, вы знакомы</h2>
			{usersFollowed.map(user => (
				<div key={user.id} className='flex items-center justify-between gap-3'>
					<UserTooltip user={user}>
						<Link
							href={`/users/${user.username}`}
							className='flex items-center gap-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
						>
							<UserAvatar
								avatarUrl={user.avatarUrl}
								className='flex-none border border-transparent rounded-full hover:border-primary transition-colors duration-200'
							/>
							<div className='flex flex-col'>
								<p className='text-sm line-clamp-1 break-all font-semibold text-foreground hover:underline hover:text-primary'>
									{user.name}
								</p>
								<p className='text-sm line-clamp-1 break-all text-muted-foreground'>
									@{user.username}
								</p>
							</div>
						</Link>
					</UserTooltip>

					<FollowButton
						userId={user.id}
						initialState={{
							followers: user._count.followers,
							isFollowedByUser: user.followers.some(
								({ followerId }) => followerId === user.id
							)
						}}
					/>
				</div>
			))}
		</article>
	)
}

const getTrendingTopics = unstable_cache(
	async () => {
		const trendsTopics = await prisma.$queryRaw<
			{ hashtag: string; count: bigint }[]
		>`
        SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag,
        COUNT(*) AS count
        FROM posts
        GROUP BY hashtag
        ORDER BY count DESC, hashtag ASC
        LIMIT 5
        `
		return trendsTopics.map(topic => ({
			hashtag: topic.hashtag,
			count: Number(topic.count)
		}))
	},
	['trending_topics'],
	{
		revalidate: 1 // 1 second
	}
)

const TrendsTopics = async () => {
	const trendsTopics = await getTrendingTopics()
	return (
		<article className='flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-sm'>
			<h2 className='text-lg font-bold'>Трендовые обсуждения</h2>
			{trendsTopics.map(({ hashtag, count }) => {
				const title = hashtag.split('#')[1]
				return (
					<Link key={title} href={`/hashtag/${title}`} className='block'>
						<p
							className='line-clamp-1 break-all font-semibold text-foreground hover:underline'
							title={hashtag}
						>
							{hashtag}
						</p>
						<p className='text-sm text-muted-foreground '>
							{formatNumber(count)}{' '}
							{(count === 1 && 'тема') ||
								(count >= 2 && count <= 4 && 'темы') ||
								(count >= 5 && 'тем')}
						</p>
					</Link>
				)
			})}
		</article>
	)
}

export default TrendsSidebar
