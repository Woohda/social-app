'use client'

import { FollowerInfo } from '@/lib/types'
import { Button } from '../ui/button'
import { useFollowerInfo } from '@/hooks/use-followerInfo'

interface FollowButtonProps {
	userId: string
	initialState: FollowerInfo
}

const FollowButton = ({ userId, initialState }: FollowButtonProps) => {
	const { data, mutate } = useFollowerInfo(userId, initialState)

	return (
		<Button
			variant={data.isFollowedByUser ? 'secondary' : 'default'}
			onClick={() => mutate()}
		>
			{data.isFollowedByUser ? 'Отписаться' : 'Подписаться'}
		</Button>
	)
}

export default FollowButton
