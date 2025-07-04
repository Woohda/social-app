import LoadingButton from '@/components/button/LoadingButton'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateProfileMutation } from '@/hooks/use-updateProfileMutation'
import { UserData } from '@/lib/types'
import {
	updateUserProfileSchema,
	UpdateUserProfileValues
} from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import AvatarInput from '@/features/edit-profile/AvatarInput'
import avatarPlaceholder from '@/assets/avatar-placeholder.png'

interface EditProfileDialogProps {
	user: UserData
	open: boolean
	onOpenChange: (open: boolean) => void
}

const EditProfileDialog = ({
	user,
	open,
	onOpenChange
}: EditProfileDialogProps) => {
	const form = useForm<UpdateUserProfileValues>({
		resolver: zodResolver(updateUserProfileSchema),
		defaultValues: {
			name: user.name || '',
			bio: user.bio || ''
		}
	})

	const mutation = useUpdateProfileMutation()

	const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null)

	async function onSubmit(values: UpdateUserProfileValues) {
		const newAvatarFile = croppedAvatar
			? new File([croppedAvatar], `avatar_${user.id}.webp`, {
					type: 'image/webp'
				})
			: undefined
		mutation.mutate(
			{
				values,
				avatar: newAvatarFile
			},
			{
				onSuccess: () => {
					setCroppedAvatar(null)
					onOpenChange(false)
				}
			}
		)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Изменить профиль:</DialogTitle>
				</DialogHeader>
				<div className='flex gap-5 items'>
					<div className='mt-3'>
						<AvatarInput
							src={
								croppedAvatar
									? URL.createObjectURL(croppedAvatar)
									: user.avatarUrl || avatarPlaceholder
							}
							onImageCropped={setCroppedAvatar}
						/>
					</div>

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='flex flex-col gap-3 w-full'
						>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Имя</FormLabel>
										<FormControl>
											<Input {...field} placeholder='Ваше имя...' />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='bio'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Описание</FormLabel>
										<FormControl>
											<Textarea
												{...field}
												placeholder='Напишите что нибудь о себе...'
												className='resize-none'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<DialogFooter>
								<LoadingButton type='submit' loading={mutation.isPending}>
									Сохранить
								</LoadingButton>
							</DialogFooter>
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default EditProfileDialog
