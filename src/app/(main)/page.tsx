import PostEditor from '@/features/PostEditor/PostEditor'
import FeedYouPosts from '@/features/FeedYouPosts'
import TrendsSidebar from '@/widgets/TrendsSidebar'

export default async function Home() {
	return (
		<main className='w-full min-w-0 flex gap-5'>
			<div className='w-full flex flex-col gap-5'>
				<PostEditor />
				<FeedYouPosts />
			</div>
			<TrendsSidebar />
		</main>
	)
}
