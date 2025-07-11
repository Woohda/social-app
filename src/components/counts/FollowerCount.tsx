'use client'
import { useFollowerInfo } from '@/hooks/use-followerInfo'
import { FollowerInfo } from '@/lib/types'
import { formatNumber } from '@/lib/utils'

interface FollowerCountProps {
	userId: string
	initialState: FollowerInfo
}

const FollowerCount = ({ userId, initialState }: FollowerCountProps) => {
	const { data } = useFollowerInfo(userId, initialState)

	return (
		<span>
			Подписчиков:{' '}
			<span className='font-semibold'>{formatNumber(data.followers)}</span>
		</span>
	)
}

export default FollowerCount
