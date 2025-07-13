'use client'
import { DefaultStreamChatGenerics } from 'stream-chat-react'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '../ui/dialog'
import { useState } from 'react'
import { UserResponse } from 'stream-chat'
import { Loader2, SearchIcon } from 'lucide-react'
import SearchUserResultButton from '../button/SearchUserResultButton'
import { useCreateNewMessage } from '@/hooks/use-createNewMessage'
import LoadingButton from '../button/LoadingButton'
import SelectedUserTagButton from '../button/SelectedUserTagButton'

interface NewChatDialogProps {
	onOpenChange: (open: boolean) => void
	onChatCreated: () => void
}

const NewChatDialog = ({ onOpenChange, onChatCreated }: NewChatDialogProps) => {
	const [searchInput, setSearchInput] = useState('')
	const [selectedUsers, setSelectedUsers] = useState<
		UserResponse<DefaultStreamChatGenerics>[]
	>([])

	const { data, isFetching, isError, isSuccess, mutation } =
		useCreateNewMessage({ searchInput, selectedUsers, onChatCreated })

	return (
		<Dialog open onOpenChange={onOpenChange}>
			<DialogContent className='bg-card p-0'>
				<DialogHeader className='px-6 pt-6'>
					<DialogTitle>Новый сообщение</DialogTitle>
				</DialogHeader>
				<div>
					<div className='relative group'>
						<SearchIcon className='absolute left-5 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground group-focus-within:text-primary' />
						<input
							placeholder='Введите имя'
							className='h-12 w-full pe-4 ps-14 focus:outline-none'
							value={searchInput}
							onChange={e => setSearchInput(e.target.value)}
						/>
					</div>
					{!!selectedUsers.length && (
						<div className='mt-4 flex flex-wrap gap-2 p-2'>
							{selectedUsers.map(user => (
								<SelectedUserTagButton
									key={user.id}
									user={user}
									onRemove={() =>
										setSelectedUsers(prev => prev.filter(u => u.id !== user.id))
									}
								/>
							))}
						</div>
					)}
					<hr />
					<div className='h-96 overflow-y-auto'>
						{isSuccess &&
							data?.users.map(user => (
								<SearchUserResultButton
									key={user.id}
									user={user}
									selected={selectedUsers.some(u => u.id === user.id)}
									onClick={() => {
										setSelectedUsers(prev =>
											prev.some(u => u.id === user.id)
												? prev.filter(u => u.id !== user.id)
												: [...prev, user]
										)
									}}
								/>
							))}
						{isSuccess && !data?.users.length && (
							<p className='my-3 text-center text-muted-foreground'>
								Пользователь с таким именем не найден.
							</p>
						)}
						{isFetching && <Loader2 className='mx-auto my-3 animate-spin' />}
						{isError && (
							<p className='my-3 text-center text-destructive'>
								Произошла ошибка при загрузке пользователей.
							</p>
						)}
					</div>
				</div>
				<DialogFooter className='px-6 pb-6'>
					<LoadingButton
						disabled={!selectedUsers.length}
						loading={mutation.isPending}
						onClick={() => mutation.mutate()}
					>
						Написать
					</LoadingButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default NewChatDialog
