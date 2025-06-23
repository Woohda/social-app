'use client'

import { FollowerInfo } from '@/lib/types'
import { Button } from './ui/button'
import { useFollowerInfo } from '@/hooks/use-followerInfo'
import kyInstance from '@/lib/ky'
import { useMutation } from '@tanstack/react-query'

interface FollowButtonProps {
	userId: string
	initialState: FollowerInfo
}

const FollowButton = ({ userId, initialState }: FollowButtonProps) => {
	const { data } = useFollowerInfo(userId, initialState)

	const { mutate } = useMutation({
		mutationFn: () =>
			data.isFollowedByUser
				? kyInstance.delete(`api/users/${userId}/followers`)
				: kyInstance.post(`api/users/${userId}/followers`)
	})

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
