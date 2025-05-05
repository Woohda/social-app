import * as React from 'react'

import { cn } from '@/lib/utils'
import { Input } from './ui/input'
import { Eye, EyeOff } from 'lucide-react'

const PasswordInput = React.forwardRef<
	HTMLInputElement,
	React.ComponentProps<'input'>
>(({ className, ...props }, ref) => {
	const [showPassword, setShowPassword] = React.useState(false)
	return (
		<div className='relative'>
			<Input
				type={showPassword ? 'text' : 'password'}
				className={cn('pe-10', className)}
				ref={ref}
				{...props}
			/>
			<button
				type='button'
				title={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
				className='absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-primary focus:outline-none'
				onClick={() => setShowPassword(prev => !prev)}
			>
				{showPassword ? (
					<EyeOff className='size-5' />
				) : (
					<Eye className='size-5' />
				)}
			</button>
		</div>
	)
})
PasswordInput.displayName = 'PasswordInput'

export default PasswordInput
