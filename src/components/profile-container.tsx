import { useAuth, UserButton } from '@clerk/clerk-react'
import { Loader } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'

const ProfileContainer = () => {
	const { isLoaded, isSignedIn } = useAuth()
	if (!isLoaded) {
		return (
			<div className='flex items-center '>
				<Loader className=' min-w-6 min-h-6 animate-spin' />
			</div>
		)
	}
	return (
		<div className='flex items-center gap-6'>
			{isSignedIn ? (
				<UserButton afterSignOutUrl='/' />
			) : (
				<Link to={'/sign-in'}>
					<Button>Get Started</Button>
				</Link>
			)}
		</div>
	)
}

export default ProfileContainer
