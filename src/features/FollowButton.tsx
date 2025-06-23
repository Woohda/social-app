'use client'

import { FollowerInfo } from '@/lib/types'
import { Button } from '../components/ui/button'
import { useFollowerInfo } from '@/hooks/use-followerInfo'
import kyInstance from '@/lib/ky'
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'

interface FollowButtonProps {
	userId: string
	initialState: FollowerInfo
}

const FollowButton = ({ userId, initialState }: FollowButtonProps) => {
	const { toast } = useToast()

	const query = useQueryClient()
	const queryKey: QueryKey = ['follower-info', userId]

	const { data } = useFollowerInfo(userId, initialState)

	const { mutate } = useMutation({
		mutationFn: () =>
			data.isFollowedByUser
				? kyInstance.delete(`api/users/${userId}/followers`)
				: kyInstance.post(`api/users/${userId}/followers`),
		onMutate: async () => {
			await query.cancelQueries({ queryKey })
			const prevState = query.getQueryData<FollowerInfo>(queryKey)
			query.setQueryData<FollowerInfo>(queryKey, () => {
				return {
					followers:
						(prevState?.followers || 0) +
						(prevState?.isFollowedByUser ? -1 : 1),
					isFollowedByUser: !prevState?.isFollowedByUser
				}
			})
			return { prevState }
		},
		onError: (error, variables, context) => {
			query.setQueryData<FollowerInfo>(queryKey, context?.prevState)
			toast({
				description:
					error instanceof Error
						? error.message
						: 'Что-то пошло не так. Попробуйте позже.',
				variant: 'destructive'
			})
		}
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
