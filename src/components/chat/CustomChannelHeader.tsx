import { ChannelHeader, ChannelHeaderProps } from 'stream-chat-react'
import { Button } from '../ui/button'
import { MenuIcon } from 'lucide-react'

interface CustomChannelHeaderProps extends ChannelHeaderProps {
	openSidebar: () => void
}

const CustomChannelHeader = ({
	openSidebar,
	...props
}: CustomChannelHeaderProps) => {
	return (
		<div className='flex items-center gap-3'>
			<div className='h-full p-2 md:hidden'>
				<Button size='icon' variant='ghost' onClick={openSidebar}>
					<MenuIcon className='size-5' />
				</Button>
			</div>
			<ChannelHeader {...props} />
		</div>
	)
}

export default CustomChannelHeader
