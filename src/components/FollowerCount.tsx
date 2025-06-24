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
		<span className='text-sm'>
			Подписчиков:{' '}
			<span className='font-semibold text-base'>
				{formatNumber(data.followers)}
			</span>
		</span>
	)
}

export default FollowerCount
