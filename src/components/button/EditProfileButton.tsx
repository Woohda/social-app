'use client'

import { UserData } from '@/lib/types'
import { useState } from 'react'
import { Button } from '../ui/button'
import EditProfileDialog from '@/features/edit-profile/EditProfileDialog'

interface EditProfileButtonProps {
	user: UserData
}

const EditProfileButton = ({ user }: EditProfileButtonProps) => {
	const [showDialog, setShowDialog] = useState(false)
	return (
		<>
			<Button variant='outline' onClick={() => setShowDialog(true)}>
				Изменить профиль
			</Button>
			<EditProfileDialog
				user={user}
				open={showDialog}
				onOpenChange={setShowDialog}
			/>
		</>
	)
}

export default EditProfileButton
