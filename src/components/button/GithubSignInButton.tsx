import { FaGithub } from 'react-icons/fa'
import { Button } from '../ui/button'

const GithubSignInButton = () => {
	return (
		<Button
			variant='outline'
			className='bg-white text-black hover:bg-gray-100 hover:text-black'
			asChild
		>
			<a href='/login/github' className='flex w-full items-center gap-2'>
				<FaGithub /> с помощью GitHub
			</a>
		</Button>
	)
}

export default GithubSignInButton
