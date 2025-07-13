'use client'

import { cn } from '@/lib/utils'
import { XIcon } from 'lucide-react'

interface DeleteButtonProps {
	onClick: () => void
	className?: string
}

const DeleteButton = ({ className, onClick }: DeleteButtonProps) => {
	return (
		<button
			onClick={onClick}
			className={cn(
				'group/button inline-flex items-center text-xs font-medium text-destructive transition-all duration-500 hover:text-destructive/80',
				className
			)}
		>
			<XIcon className='size-5 inline-block transition-transform duration-500 group-hover/button:-translate-x-0' />
			<span className='max-w-0 overflow-hidden whitespace-nowrap transition-all duration-500 group-hover/button:max-w-[100px]'>
				Удалить
			</span>
		</button>
	)
}

export default DeleteButton
