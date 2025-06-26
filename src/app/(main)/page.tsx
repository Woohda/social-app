import PostEditor from '@/features/post-editor/PostEditor'
import FeedOfPosts from '@/widgets/Posts/FeedOfPosts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import FollowingFeed from '@/widgets/Posts/FollowingFeed'

export default async function Home() {
	return (
		<main className='w-full min-w-0 flex gap-5'>
			<div className='w-full flex flex-col gap-5'>
				<PostEditor />
				<Tabs defaultValue='for-you'>
					<TabsList className='translate-x-[100%]'>
						<TabsTrigger value='for-you'>Лента постов</TabsTrigger>
						<TabsTrigger value='following'>Подписки</TabsTrigger>
					</TabsList>
					<TabsContent value='for-you'>
						<FeedOfPosts />
					</TabsContent>
					<TabsContent value='following'>
						<FollowingFeed />
					</TabsContent>
				</Tabs>
			</div>
		</main>
	)
}
