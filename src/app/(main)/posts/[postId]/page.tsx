import { validateRequest } from '@/auth'
import Post from '@/components/post/Post'
import prisma from '@/lib/prisma'
import { getPostDataInclude } from '@/lib/types'
import UserInfoSidebar from '@/widgets/UserInfoSidebar'
import { Loader2 } from 'lucide-react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache, Suspense } from 'react'

interface PageProps {
	params: Promise<{
		postId: string
	}>
}

// Функция для получения данных поста по его идентификатору
// Используется кэширование для оптимизации производительности
// и предотвращения повторных запросов к базе данных
// при повторном обращении к одному и тому же посту.
const getPost = cache(async (postId: string, loggedInUserId: string) => {
	const post = await prisma.post.findUnique({
		where: {
			id: postId
		},
		include: getPostDataInclude(loggedInUserId)
	})

	if (!post) notFound()

	return post
})

// Функция для генерации метаданных страницы поста
// Используется для SEO-оптимизации и улучшения отображения в социальных сетях
// Возвращает заголовок, описание и Open Graph метаданные для страницы поста.
export async function generateMetadata({
	params: promise
}: PageProps): Promise<Metadata> {
	const postIdValue = (await promise).postId
	const { user: loggedInUser } = await validateRequest()

	if (!loggedInUser) return {}

	const post = await getPost(postIdValue, loggedInUser.id)
	return {
		title: `${post.user.name}: ${post.content.slice(0, 50)}...`,
		openGraph: {
			title: `${post.user.name}: ${post.content.slice(0, 50)}...`,
			description: post.content,
			url: `/posts/${post.id}`,
			images:
				post.attachments && post.attachments.length > 0
					? [post.attachments[0].url]
					: []
		}
	}
}

export default async function Page({ params: promise }: PageProps) {
	const postIdValue = (await promise).postId
	const { user: loggedInUser } = await validateRequest()
	if (!loggedInUser) {
		return (
			<p className='text-destructive bg-card p-5 rounded-lg'>
				Пожалуйста, войдите в систему, чтобы увидеть эту страцницу.
			</p>
		)
	}

	const post = await getPost(postIdValue, loggedInUser.id)

	return (
		<main className='w-full min-w-0 flex gap-5'>
			<div className='w-full flex flex-col gap-5'>
				<Post post={post} />
			</div>
			<div className='sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80'>
				<Suspense fallback={<Loader2 className='mx-auto animate-spin' />}>
					<UserInfoSidebar user={post.user} />
				</Suspense>
			</div>
		</main>
	)
}
