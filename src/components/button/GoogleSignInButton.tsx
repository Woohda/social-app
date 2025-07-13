import { FcGoogle } from 'react-icons/fc'
import { Button } from '../ui/button'

const GoogleSignInButton = () => {
	return (
		<Button
			variant='outline'
			className='bg-white text-black hover:bg-gray-100 hover:text-black'
			asChild
		>
			<a href='/login/google' className='flex w-full items-center gap-2'>
				<FcGoogle />с помощью Google
			</a>
		</Button>
	)
}

export default GoogleSignInButton
