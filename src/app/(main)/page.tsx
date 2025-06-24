import PostEditor from '@/features/PostEditor/PostEditor'
import FeedYouPosts from '@/features/FeedYouPosts'
import TrendsSidebar from '@/widgets/TrendsSidebar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import FollowingFeed from '@/features/FollowingFeed'

export default async function Home() {
	return (
		<main className='w-full min-w-0 flex gap-5'>
			<div className='w-full flex flex-col gap-5'>
				<PostEditor />
				<Tabs defaultValue='for-you'>
					<TabsList>
						<TabsTrigger value='for-you'>Лента постов</TabsTrigger>
						<TabsTrigger value='following'>Подписки</TabsTrigger>
					</TabsList>
					<TabsContent value='for-you'>
						<FeedYouPosts />
					</TabsContent>
					<TabsContent value='following'>
						<FollowingFeed />
					</TabsContent>
				</Tabs>
			</div>
			<TrendsSidebar />
		</main>
	)
}
