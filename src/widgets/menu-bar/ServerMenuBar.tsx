import { validateRequest } from '@/auth'
import prisma from '@/lib/prisma'
import ClientMenuBar from './ClientMenuBar'

interface ServerMenuBarProps {
	className: string
}

const MenuBar = async ({ className }: ServerMenuBarProps) => {
	const { user } = await validateRequest()
	if (!user) return null

	const unreadNotificationCount = await prisma.notification.count({
		where: {
			recipientId: user.id,
			read: false
		}
	})

	return (
		<ClientMenuBar
			unreadCount={unreadNotificationCount}
			className={className}
		/>
	)
}

export default MenuBar
