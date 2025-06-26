import LoadingButton from '@/components/button/LoadingButton'
import { Button } from '@/components/ui/button'
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
import { useForm } from 'react-hook-form'

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

	async function onSubmit(values: UpdateUserProfileValues) {
		mutation.mutate(
			{
				values
			},
			{
				onSuccess: () => {
					onOpenChange(false)
				}
			}
		)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Изменить профиль</DialogTitle>
				</DialogHeader>
				<DialogContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='flex flex-col gap-3'
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
								<Button
									type='button'
									variant='outline'
									onClick={() => onOpenChange(false)}
								>
									Отменить
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</DialogContent>
		</Dialog>
	)
}

export default EditProfileDialog
