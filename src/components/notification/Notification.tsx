import { NotificationData } from '@/lib/types'
import { cn } from '@/lib/utils'
import { NotificationType } from '@prisma/client'
import Link from 'next/link'
import { Heart, MessageCircle, User2 } from 'lucide-react'
import UserAvatar from '../user/UserAvatar'
import { useRouter } from 'next/navigation'

interface NotificationProps {
	notification: NotificationData
}
const Notification = ({ notification }: NotificationProps) => {
	const router = useRouter()

	const notificationTypeMap: Record<
		NotificationType,
		{ message: string; icon: JSX.Element; href: string }
	> = {
		LIKE: {
			message: 'нравится ваш пост',
			icon: <Heart className='size-7 text-red-700' />,
			href: `/posts/${notification.postId}`
		},
		COMMENT: {
			message: 'прокомментировал(-а) ваш пост',
			icon: <MessageCircle className='size-7 text-primary' />,
			href: `/posts/${notification.postId}`
		},
		FOLLOW: {
			message: 'подписался(-ась) на вас',
			icon: <User2 className='size-7 text-primary' />,
			href: `/users/${notification.issuer.username}`
		}
	}

	const { message, icon, href } = notificationTypeMap[notification.type]

	const handleClick = () => {
		router.push(href)
	}

	return (
		<article
			onClick={handleClick}
			className={cn(
				'flex items-center gap-3 p-3 bg-card rounded-2xl hover:bg-card/70 transition-colors shadow-sm',
				!notification.read && 'bg-primary/10'
			)}
		>
			<span className='my-1'>{icon}</span>

			<div className='flex flex-wrap items-center gap-1'>
				<Link
					href={`/users/${notification.issuer.username}`}
					onClick={e => e.stopPropagation()}
					className='inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
				>
					<UserAvatar
						avatarUrl={notification.issuer.avatarUrl}
						size={36}
						className='flex-none border border-transparent rounded-full hover:border-primary transition-colors duration-200'
					/>
					<span className='font-semibold text-foreground hover:underline hover:text-primary flex-shrink-0'>
						{notification.issuer.name}
					</span>
				</Link>
				{notification.post ? (
					<>
						<span>{message}:</span>
						<p className='text-muted-foreground'>{notification.post.content}</p>
					</>
				) : (
					<span>{message}</span>
				)}
			</div>
		</article>
	)
}

export default Notification
