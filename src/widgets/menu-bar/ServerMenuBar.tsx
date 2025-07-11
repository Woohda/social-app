import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import ClientMenuBar from './ClientMenuBar'
import { streamServerClient } from '@/lib/stream'

interface ServerMenuBarProps {
	className: string
}

const MenuBar = async ({ className }: ServerMenuBarProps) => {
	const { user } = await validateRequest()
	if (!user) return null

	const [unreadNotificationCount, unreadMessageCount] = await Promise.all([
		prisma.notification.count({
			where: {
				recipientId: user.id,
				read: false
			}
		}),
		(await streamServerClient.getUnreadCount(user.id)).total_unread_count
	])

	return (
		<ClientMenuBar
			unreadNotificationCount={unreadNotificationCount}
			unreadMessageCount={unreadMessageCount}
			className={className}
		/>
	)
}

export default MenuBar
